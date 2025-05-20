import { Request, Response } from 'express';
import { z } from 'zod';
import mongoose from 'mongoose';

import { InterviewService } from '@/services/interview.service';
import { getUserFromRequest } from '@/middlewares/utils';
import { InterviewStatus, InterviewType } from '@vtmp/common/constants';

const InterviewIdParamsSchema = z.object({
  interviewId: z
    .string({ required_error: 'Interview ID is required' })
    .refine((id) => mongoose.Types.ObjectId.isValid(id), {
      message: 'Invalid interview ID format',
    }),
});

const InterviewCreateSchema = z.object({
  applicationId: z
    .string({ required_error: 'Application ID is required' })
    .refine((id) => mongoose.Types.ObjectId.isValid(id), {
      message: 'Invalid application ID format',
    }),
  type: z.array(z.nativeEnum(InterviewType), {
    required_error: 'Interview type is required',
    invalid_type_error: 'Invalid interview type format',
  }),
  status: z.nativeEnum(InterviewStatus).optional(),
  interviewOnDate: z
    .string({ required_error: 'Interview date is required' })
    .refine((str) => !isNaN(Date.parse(str)), {
      message: 'Interview date is required',
    })
    .transform((str) => new Date(str)),
  note: z.string().optional(),
});

const InterviewUpdateSchema = z.object({
  type: z.array(z.nativeEnum(InterviewType)).optional(),
  status: z.nativeEnum(InterviewStatus).optional(),
  interviewOnDate: z.coerce.date().optional(),
  note: z.string().optional(),
});

const InterviewApplicationFilter = z.object({
  applicationId: z
    .string()
    .refine((id) => mongoose.Types.ObjectId.isValid(id), {
      message: 'Invalid application ID format',
    }),
});

const InterviewCompanyFilter = z
  .object({
    companyName: z.string({ required_error: 'Company Name is required' }),
  })
  .transform((data) =>
    Object.fromEntries(Object.entries(data).filter(([, v]) => v != undefined))
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
    Object.fromEntries(Object.entries(data).filter(([, v]) => v != undefined))
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
    const updatedMetadata = InterviewUpdateSchema.parse(req.body);

    const updatedInterview = await InterviewService.updateInterviewById({
      interviewId,
      userId,
      updatedMetadata,
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
};
