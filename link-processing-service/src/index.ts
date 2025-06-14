import { LinkProcessorService } from '@/services/link-processor.service';
// import { submitLinkWithToken } from '@/utils/auth';
import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { handleErrorMiddleware } from '@/utils/errors';
import { APIGatewayProxyEventV2, APIGatewayProxyResult } from 'aws-lambda';
import { z } from 'zod';

const EventBodySchema = z.object({
  url: z.string().url(),
});

const lambdaHandler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResult> => {
  const { url } = EventBodySchema.parse(event.body);
  const processedMetadata = await LinkProcessorService.processLink(url);

  console.log(processedMetadata);

  // Need to deal with case when submitLinkWithToken throws?
  // await submitLinkWithToken('/links', processedMetadata);

  return {
    statusCode: 200,
    body: JSON.stringify({
      processedMetadata,
    }),
  };
};

export const handler = middy(lambdaHandler)
  .use(httpJsonBodyParser())
  .use(handleErrorMiddleware());
