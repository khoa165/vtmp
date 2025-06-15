// import { LinkProcessorService } from '@/services/link-processor.service';
// import { submitLinkWithToken } from '@/utils/auth';
import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { handleErrorMiddleware } from '@/utils/errors';
import { APIGatewayProxyEventV2, APIGatewayProxyResult } from 'aws-lambda';
import { z } from 'zod';
import { LinkProcessorService } from '@/services/link-processor.service';
import { submitLinkWithToken } from '@/utils/auth';

// const EventBodySchema = z.object({
//   url: z.string().url(),
// });

const EventBodySchema = z.object({
  urls: z.array(z.string().url()).min(1),
});

const lambdaHandler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResult> => {
  // const { url } = EventBodySchema.parse(event.body);
  const { urls } = EventBodySchema.parse(event.body);
  // const processedMetadata = await LinkProcessorService.processLink(url);

  // const browser = await WebScrapingService.openBrowserInstance();

  // const results = await Promise.all(
  //   links.map(async (url) => {
  //     try {
  //       const processedMetadata = await LinkProcessorService.processLink(url);
  //       return { url, processedMetadata, status: 'success' };
  //     } catch (error: unknown) {
  //       return { url, error: error || String(error), status: 'failed' };
  //     }
  //   })
  // );

  // const results = await WebScrapingService.entryPoint(links);
  const results = await LinkProcessorService.processLink(urls);

  // console.log(processedMetadata);
  console.log(results);

  // Need to deal with case when submitLinkWithToken throws?
  // await submitLinkWithToken('/links', processedMetadata);

  // Submit links to backend API server
  await Promise.all(
    results.map(async (result) => {
      try {
        await submitLinkWithToken('/links', result);
      } catch (error: unknown) {
        console.error(`Failed to submit for ${result.url}:`, error);
      }
    })
  );

  // return {
  //   statusCode: 200,
  //   body: JSON.stringify({
  //     processedMetadata,
  //   }),
  // };

  return {
    statusCode: 200,
    body: JSON.stringify({ results }),
  };
};

export const handler = middy(lambdaHandler)
  .use(httpJsonBodyParser())
  .use(handleErrorMiddleware());
