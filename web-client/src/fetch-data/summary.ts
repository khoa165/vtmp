import axios from 'axios';
import { GetSummaryDataResponseSchema } from '@/fetch-data/fetch-response-validation/summary';

export const getSummaryData = async () => {
  const response = await axios.get('http://localhost:8000/vtmp-summary');

  return GetSummaryDataResponseSchema.parse(response.data);
};
