import { LinkProcessorService } from '@/services/link-processor.service';
import {
  Context,
  APIGatewayProxyResult,
  APIGatewayProxyEvent,
} from 'aws-lambda';

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);
  const url = event.body || '';
  const processedMetadata = await LinkProcessorService.processLink(url);
  console.log(processedMetadata);
  return {
    statusCode: 200,
    body: JSON.stringify({
      processedMetadata,
    }),
  };
};
