import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { APIGatewayProxyEventV2, APIGatewayProxyResult } from 'aws-lambda';

import { LinkProcessorService } from '@/services/link-processor.service';
import {
  EventBodySchema,
  FailedProcessedLink,
  MetadataExtractedLink,
  UpdateLinkPayload,
} from '@/types/link-processing.types';
import { updateLink } from '@/utils/api';
import { handleErrorMiddleware } from '@/utils/errors';

const buildSuccessfulLinksPayloads = (
  processedResults: MetadataExtractedLink[]
): {
  linkId: string;
  originalUrl: string;
  updatePayload: UpdateLinkPayload;
}[] => {
  return processedResults.map((result) => {
    const { originalRequest, extractedMetadata, scrapedText, ...rest } = result;
    const flattenResult = {
      ...rest,
      ...extractedMetadata,
      ...originalRequest,
      lastProcessedAt: new Date().toISOString(),
    };
    flattenResult.attemptsCount += 1;
    const { _id, originalUrl, ...updatePayload } = flattenResult;

    return { linkId: _id, originalUrl, updatePayload };
  });
};

const buildFailedLinksPayloads = (
  processedResults: FailedProcessedLink[]
): {
  linkId: string;
  originalUrl: string;
  updatePayload: UpdateLinkPayload;
}[] => {
  return processedResults.map((result) => {
    const { originalRequest, scrapedText, error, ...rest } = result;
    const flattenResult = {
      ...rest,
      ...originalRequest,
      lastProcessedAt: new Date().toISOString(),
    };
    flattenResult.attemptsCount += 1;
    const { _id, originalUrl, ...updatePayload } = flattenResult;

    return { linkId: _id, originalUrl, updatePayload };
  });
};

const lambdaHandler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResult> => {
  const { linksData } = EventBodySchema.parse(event.body);
  const { successfulLinks, failedLinks } =
    await LinkProcessorService.processLinks(linksData);

  const successfulLinksPayloads = buildSuccessfulLinksPayloads(successfulLinks);
  const failedLinksPayloads = buildFailedLinksPayloads(failedLinks);
  const allUpdateLinksPayloads = [
    ...successfulLinksPayloads,
    ...failedLinksPayloads,
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
    body: JSON.stringify({ successfulLinks, failedLinks }),
  };
};

export const handler = middy(lambdaHandler)
  .use(httpJsonBodyParser())
  .use(handleErrorMiddleware());
