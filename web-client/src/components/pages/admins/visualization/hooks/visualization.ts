import { useQuery } from '@tanstack/react-query';

import { VisualizationSchema } from '#vtmp/web-client/components/pages/admins/visualization/validation';
import { request } from '@/utils/api';
import { Method, QueryKey } from '@/utils/constants';

export const useGetVisualizations = () => {
  return useQuery({
    queryKey: [QueryKey.GET_VISUALIZATIONS],

    queryFn: () =>
      request({
        method: Method.GET,
        url: '/visualization',
        schema: VisualizationSchema,
        options: {
          includeOnlyDataField: true,
          requireAuth: true,
        },
      }),
  });
};
