import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { handleErrorMiddleware } from '@/utils/errors';
import { APIGatewayProxyEventV2, APIGatewayProxyResult } from 'aws-lambda';
import { LinkProcessorService } from '@/services/link-processor.service';
import { updateLink } from '@/utils/api';
import {
  EventBodySchema,
  ExtractedMetadata,
  UpdateLinkPayload,
} from '@/services/link-metadata-validation';

// Need an extra service function to flatten out processedResults
// Update attemptsCount
// Update lastProcessedAt
// Organize the list of objects, so that each object only have {linkId: string, url: string, updatePayload: that already have _id and url pruned from}
const prepareUpdatePayloads = (
  processedResults: ExtractedMetadata[]
): { linkId: string; url: string; updatePayload: UpdateLinkPayload }[] => {
  return processedResults.map((result) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { error, processedContent, ...rest } = result;
    const processedResult = {
      ...rest,
      ...processedContent,
      lastProcessedAt: new Date(),
    };

    processedResult.attemptsCount += 1;
     
    const { _id, url, ...updatePayload } = processedResult;
    return { linkId: _id, url, updatePayload };
  });
};

const lambdaHandler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResult> => {
  const { linksData } = EventBodySchema.parse(event.body);
  const processedResults = await LinkProcessorService.processLinks(linksData);
  console.log(processedResults);

  // Need to deal with case when updateLink throws?
  const updateLinksPayloads = prepareUpdatePayloads(processedResults);
  await Promise.all(
    updateLinksPayloads.map(async ({ linkId, url, updatePayload }) => {
      try {
        await updateLink(`/links/${linkId}/metaData`, updatePayload);
      } catch (error: unknown) {
        console.error(`Failed to update link for ${url}:`, error);
      }
    })
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ processedResults }),
  };
};

export const handler = middy(lambdaHandler)
  .use(httpJsonBodyParser())
  .use(handleErrorMiddleware());
