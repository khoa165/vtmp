import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { handleErrorMiddleware } from '@/utils/errors';
import { APIGatewayProxyEventV2, APIGatewayProxyResult } from 'aws-lambda';
import { LinkProcessorService } from '@/services/link-processor.service';
import { updateLink } from '@/utils/api';
import {
  EventBodySchema,
  FailedProcessedLink,
  MetadataExtractedLink,
  UpdateLinkPayload,
} from '@/services/link-metadata-validation';

const buildSucceeddedLinksUpdatePayloads = (
  processedResults: MetadataExtractedLink[]
): {
  linkId: string;
  originalUrl: string;
  updatePayload: UpdateLinkPayload;
}[] => {
  return processedResults.map((result) => {
    // destructure to take out originalRequest and extractedMetadata
    const { originalRequest, extractedMetadata, ...rest } = result;
    // Flatten, attach lastProcessedAt, and add attemptsCount
    const flattenResult = {
      ...rest,
      ...extractedMetadata,
      ...originalRequest,
      lastProcessedAt: new Date().toISOString(),
    };

    // Increment attempsCount
    flattenResult.attemptsCount += 1;

    const { _id, originalUrl, ...updatePayload } = flattenResult;
    return { linkId: _id, originalUrl, updatePayload };
  });
};

const buildFailedLinksUpdatePayloads = (
  processedResults: FailedProcessedLink[]
): {
  linkId: string;
  originalUrl: string;
  updatePayload: UpdateLinkPayload;
}[] => {
  return processedResults.map((result) => {
    // destructure to take out error and scrapedText
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { originalRequest, scrapedText, error, ...rest } = result;
    // Flatten, attach lastProcessedAt, and add attemptsCount
    const flattenResult = {
      ...rest,
      ...originalRequest,
      lastProcessedAt: new Date().toISOString(),
    };

    // Increment attempsCount
    flattenResult.attemptsCount += 1;

    const { _id, originalUrl, ...updatePayload } = flattenResult;
    return { linkId: _id, originalUrl, updatePayload };
  });
};

const lambdaHandler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResult> => {
  const { linksData } = EventBodySchema.parse(event.body);
  const { succeededLinks, failedLinks } =
    await LinkProcessorService.processLinks(linksData);

  console.log('Succeeded links: ', succeededLinks);
  console.log('Failed links: ', failedLinks);

  // Need to deal with case when updateLink throws?
  const updateSucceededLinksPayloads =
    buildSucceeddedLinksUpdatePayloads(succeededLinks);
  const updateFailedLinksPayloads = buildFailedLinksUpdatePayloads(failedLinks);
  const allUpdateLinksPayloads = [
    ...updateSucceededLinksPayloads,
    ...updateFailedLinksPayloads,
  ];
  await Promise.all(
    allUpdateLinksPayloads.map(
      async ({ linkId, originalUrl, updatePayload }) => {
        try {
          await updateLink(`/links/${linkId}/metaData`, updatePayload);
        } catch (error: unknown) {
          console.error(`Failed to update link for ${originalUrl}:`, error);
        }
      }
    )
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ succeededLinks, failedLinks }),
  };
};

export const handler = middy(lambdaHandler)
  .use(httpJsonBodyParser())
  .use(handleErrorMiddleware());
