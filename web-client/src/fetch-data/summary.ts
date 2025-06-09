import axios from 'axios';

import { EnvConfig } from '@/config/env';
import { GetSummaryDataResponseSchema } from '@/fetch-data/fetch-response-validation/summary';

export const getSummaryData = async () => {
  const response = await axios.get(
    `${EnvConfig.get().VITE_API_URL}/vtmp-summary`
  );

  return GetSummaryDataResponseSchema.parse(response.data);
};
