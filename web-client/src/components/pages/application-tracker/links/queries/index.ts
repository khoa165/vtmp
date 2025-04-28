import { SubmitLinkResponseSchema } from '@/components/pages/application-tracker/links/queries/validation.ts';
import { api } from '@/utils/axios';

export const submitLink = async (url: string) => {
  const response = await api.post('/links', { url });
  console.log(response.data);

  return SubmitLinkResponseSchema.parse(response.data);
};
