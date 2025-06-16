import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { request } from '@/utils/api';
import { Method, QueryKey } from '@/utils/constants';
import { toast } from 'sonner';
import {
  ApplicationsResponseSchema,
  ApplicationResponseSchema,
  ApplicationsCountByStatusSchema,
  InterviewsResponseSchema,
  InterviewResponseSchema,
} from '@/components/pages/application-tracker/applications/validation';
import { ApplicationStatus, InterestLevel } from '@vtmp/common/constants';
import axios from 'axios';

const STALE_TIME = 1000 * 20;

export const useGetApplications = (
  applicationFilter: { status?: ApplicationStatus } = {}
) =>
  useQuery({
    queryKey: [QueryKey.GET_APPLICATIONS, applicationFilter],
    queryFn: () =>
      request({
        method: Method.GET,
        url: '/applications',
        data: applicationFilter,
        schema: ApplicationsResponseSchema,
        options: { includeOnlyDataField: true, requireAuth: true },
      }),
    staleTime: STALE_TIME,
  });

export const useGetApplicationsCountByStatus = () =>
  useQuery({
    queryKey: [QueryKey.GET_APPLICATIONS_COUNT_BY_STATUS],
    queryFn: () =>
      request({
        method: Method.GET,
        url: '/applications/count-by-status',
        schema: ApplicationsCountByStatusSchema,
        options: { includeOnlyDataField: true, requireAuth: true },
      }),
    staleTime: STALE_TIME,
  });

export const useGetApplicationById = (applicationId: string) => {
  return useQuery({
    queryKey: [QueryKey.GET_APPLICATION_BY_ID, applicationId],
    queryFn: () =>
      request({
        method: Method.GET,
        url: `/applications/${applicationId}`,
        schema: ApplicationResponseSchema,
        options: { includeOnlyDataField: true, requireAuth: true },
      }),
    enabled: !!applicationId,
    staleTime: STALE_TIME,
  });
};

export const useDeleteApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (applicationId: string) =>
      request({
        method: Method.DELETE,
        url: `/applications/${applicationId}`,
        schema: ApplicationResponseSchema,
        options: { requireAuth: true },
      }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.GET_APPLICATIONS],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKey.GET_APPLICATION_BY_ID, res.data._id],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKey.GET_APPLICATIONS_COUNT_BY_STATUS],
      });
      toast.success(res.message);
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessages = error.response.data.errors.map(
          (err) => err.message
        );
        toast.error(errorMessages.join('\n'));
      } else {
        toast.error('Unexpected error');
      }
    },
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicationId,
      body,
    }: {
      applicationId: string;
      body: { updatedStatus: ApplicationStatus };
    }) =>
      request({
        method: Method.PUT,
        url: `/applications/${applicationId}/updateStatus`,
        data: body,
        schema: ApplicationResponseSchema,
        options: { requireAuth: true },
      }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.GET_APPLICATIONS],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKey.GET_APPLICATION_BY_ID, res.data._id],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKey.GET_APPLICATIONS_COUNT_BY_STATUS],
      });
      toast.success(res.message);
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessages = error.response.data.errors.map(
          (err) => err.message
        );
        toast.error(errorMessages.join('\n'));
      } else {
        toast.error('Unexpected error');
      }
    },
  });
};

export const useUpdateApplicationMetadata = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicationId,
      body,
    }: {
      applicationId: string;
      body: {
        interest?: InterestLevel;
        portalLink?: string;
        referrer?: string;
        note?: string;
      };
    }) =>
      request({
        method: Method.PUT,
        url: `/applications/${applicationId}`,
        data: body,
        schema: ApplicationResponseSchema,
        options: { requireAuth: true },
      }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.GET_APPLICATIONS],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKey.GET_APPLICATION_BY_ID, res.data._id],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKey.GET_APPLICATIONS_COUNT_BY_STATUS],
      });
      toast.success(res.message);
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessages = error.response.data.errors.map(
          (err) => err.message
        );
        toast.error(errorMessages.join('\n'));
      } else {
        toast.error('Unexpected error');
      }
    },
  });
};

export const useGetInterviewByApplicationId = (applicationId: string) => {
  return useQuery({
    queryKey: [QueryKey.GET_INTERVIEW_BY_APPLICATION_ID, applicationId],
    queryFn: () =>
      request({
        method: Method.GET,
        url: `/interviews/by-application/${applicationId}`,
        schema: InterviewsResponseSchema,
        options: { includeOnlyDataField: true, requireAuth: true },
      }),
    enabled: !!applicationId,
    staleTime: STALE_TIME,
  });
};

export const useCreateInterview = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      body,
    }: {
      body: {
        applicationId: string;
        interviewOnDate: Date;
        types: string[];
        status: string;
        note?: string;
      };
    }) =>
      request({
        method: Method.POST,
        url: '/interviews',
        data: body,
        schema: InterviewResponseSchema,
        options: { requireAuth: true },
      }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [
          QueryKey.GET_INTERVIEW_BY_APPLICATION_ID,
          res.data.applicationId,
        ],
      });
      toast.success(res.message);
      onSuccess?.();
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessages = error.response.data.errors.map(
          (err) => err.message
        );
        toast.error(errorMessages.join('\n'));
      } else {
        toast.error('Unexpected error');
      }
    },
  });
};

export const useUpdateInterview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      interviewId,
      body,
    }: {
      interviewId: string;
      body: {
        interviewOnDate: Date;
        types: string[];
        status: string;
        note?: string;
      };
    }) =>
      request({
        method: Method.PUT,
        url: `/interviews/${interviewId}`,
        data: body,
        schema: InterviewResponseSchema,
        options: { requireAuth: true },
      }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [
          QueryKey.GET_INTERVIEW_BY_APPLICATION_ID,
          res.data.applicationId,
        ],
      });
      toast.success(res.message);
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessages = error.response.data.errors.map(
          (err) => err.message
        );
        toast.error(errorMessages.join('\n'));
      } else {
        toast.error('Unexpected error');
      }
    },
  });
};

export const useDeleteInterview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (interviewId: string) =>
      request({
        method: Method.DELETE,
        url: `/interviews/${interviewId}`,
        schema: InterviewResponseSchema,
        options: { requireAuth: true },
      }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [
          QueryKey.GET_INTERVIEW_BY_APPLICATION_ID,
          res.data.applicationId,
        ],
      });
      toast.success(res.message);
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessages = error.response.data.errors.map(
          (err) => err.message
        );
        toast.error(errorMessages.join('\n'));
      } else {
        toast.error('Unexpected error');
      }
    },
  });
};
