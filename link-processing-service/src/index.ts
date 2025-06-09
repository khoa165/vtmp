import { LinkProcessorService } from '@/services/link-processor.service';
import { submitLinkWithToken } from '@/utils/auth';
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

  try {
    const response = await submitLinkWithToken('/links', processedMetadata);

    if (response.status === 201) {
      console.log('Job link and metadata deposited successfully!');
    } else {
      console.log('Failed to deposit job link!');
    }
  } catch (error: unknown) {
    console.error('Failed to POST to /links: ', error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      processedMetadata,
    }),
  };
};
