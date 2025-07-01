import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';

import { InterviewStatus, InterviewType } from '@vtmp/common/constants';

import { getUserFromRequest } from '@/middlewares/utils';
import { InterviewService } from '@/services/interview.service';

const InterviewIdParamsSchema = z
  .object({
    interviewId: z
      .string({ required_error: 'Interview ID is required' })
      .refine((id) => mongoose.Types.ObjectId.isValid(id), {
        message: 'Invalid interview ID format',
      }),
  })
  .strict();

const InterviewCreateSchema = z
  .object({
    applicationId: z
      .string({ required_error: 'Application ID is required' })
      .refine((id) => mongoose.Types.ObjectId.isValid(id), {
        message: 'Invalid application ID format',
      }),
    types: z
      .array(z.nativeEnum(InterviewType), {
        required_error: 'Interview types is required',
        invalid_type_error: 'Invalid interview type format',
      })
      .min(1, { message: 'Must select at least 1 interview type' }),
    status: z.nativeEnum(InterviewStatus).optional(),
    interviewOnDate: z.coerce.date(),
    note: z.string().optional(),
  })
  .strict();

const InterviewUpdateSchema = z
  .object({
    types: z.array(z.nativeEnum(InterviewType)).optional(),
    status: z.nativeEnum(InterviewStatus).optional(),
    interviewOnDate: z.coerce.date().optional(),
    note: z.string().optional(),
  })
  .strict()
  .transform((data) =>
    Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    )
  );

const InterviewApplicationFilter = z
  .object({
    applicationId: z
      .string()
      .refine((id) => mongoose.Types.ObjectId.isValid(id), {
        message: 'Invalid application ID format',
      }),
  })
  .strict()
  .transform((data) =>
    Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    )
  );

const InterviewCompanyFilter = z
  .object({
    companyName: z.string({ required_error: 'Company Name is required' }),
  })
  .strict()
  .transform((data) =>
    Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    )
  );

const AdminInterviewFilter = z
  .object({
    applicationId: z
      .string()
      .refine((id) => mongoose.Types.ObjectId.isValid(id), {
        message: 'Invalid application ID format',
      })
      .optional(),
    userId: z
      .string()
      .refine((id) => mongoose.Types.ObjectId.isValid(id), {
        message: 'Invalid user ID format',
      })
      .optional(),
    companyName: z.string().optional(),
  })
  .transform((data) =>
    Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    )
  );

const ShareInterviewSchema = z
  .object({
    isDisclosed: z.boolean().optional(),
  })
  .strict()
  .transform((data) =>
    Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    )
  );

export const InterviewController = {
  createInterview: async (req: Request, res: Response) => {
    const userId = getUserFromRequest(req).user.id;
    const interviewData = InterviewCreateSchema.parse(req.body);

    const newInterview = await InterviewService.createInterview({
      userId,
      ...interviewData,
    });

    res.status(201).json({
      message: 'Interview created successfully',
      data: newInterview,
    });
  },

  getInterviewById: async (req: Request, res: Response) => {
    const { interviewId } = InterviewIdParamsSchema.parse(req.params);
    const userId = getUserFromRequest(req).user.id;

    const interview = await InterviewService.getInterviewById({
      interviewId,
      userId,
    });

    res.status(200).json({
      message: 'Interview retrieved successfully',
      data: interview,
    });
  },

  getInterviewsByApplicationId: async (req: Request, res: Response) => {
    const filters = InterviewApplicationFilter.parse(req.params);
    const userId = getUserFromRequest(req).user.id;

    const interviews = await InterviewService.getInterviews({
      filters: { ...filters, userId },
    });

    res.status(200).json({
      message: 'Interviews retrieved successfully',
      data: interviews,
    });
  },

  getInterviewsByCompanyName: async (req: Request, res: Response) => {
    const filters = InterviewCompanyFilter.parse(req.query);

    const interviews = await InterviewService.getInterviews({ filters });

    res.status(200).json({
      message: 'Interviews retrieved successfully',
      data: interviews,
    });
  },

  getInterviews: async (req: Request, res: Response) => {
    const filters = AdminInterviewFilter.parse(req.query);

    const interviews = await InterviewService.getInterviews({ filters });

    res.status(200).json({
      message: 'Interviews retrieved successfully',
      data: interviews,
    });
  },

  updateInterviewById: async (req: Request, res: Response) => {
    const { interviewId } = InterviewIdParamsSchema.parse(req.params);
    const userId = getUserFromRequest(req).user.id;
    const newUpdate = InterviewUpdateSchema.parse(req.body);

    const updatedInterview = await InterviewService.updateInterviewById({
      interviewId,
      userId,
      newUpdate,
    });

    res.status(200).json({
      message: 'Interview updated successfully',
      data: updatedInterview,
    });
  },

  deleteInterviewById: async (req: Request, res: Response) => {
    const { interviewId } = InterviewIdParamsSchema.parse(req.params);
    const userId = getUserFromRequest(req).user.id;

    const deletedInterview = await InterviewService.deleteInterviewById({
      interviewId,
      userId,
    });

    res.status(200).json({
      message: 'Interview deleted successfully',
      data: deletedInterview,
    });
  },

  shareInterview: async (req: Request, res: Response) => {
    const { interviewId } = InterviewIdParamsSchema.parse(req.params);
    const { isDisclosed } = ShareInterviewSchema.parse(req.body);
    const userId = getUserFromRequest(req).user.id;

    const sharedInterview = await InterviewService.updateInterviewById({
      interviewId,
      userId,
      newUpdate: {
        isDisclosed: isDisclosed,
      },
      isShare: true,
    });

    res.status(200).json({
      message: 'Interview shared successfully',
      data: sharedInterview,
    });
  },

  unshareInterview: async (req: Request, res: Response) => {
    const { interviewId } = InterviewIdParamsSchema.parse(req.params);
    const userId = getUserFromRequest(req).user.id;

    const sharedInterview = await InterviewService.updateInterviewById({
      interviewId,
      userId,
      isShare: false,
    });

    res.status(200).json({
      message: 'Interview unshared successfully',
      data: sharedInterview,
    });
  },
};
