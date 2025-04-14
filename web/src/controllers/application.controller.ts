import { Request, Response } from 'express';
import { ApplicationService } from '@/services/application.service';
import { z } from 'zod';
import mongoose from 'mongoose';
import { ApplicationStatus, InterestLevel } from '@common/enums';
import { IApplication } from '@/models/application.model';
import { omitBy } from 'remeda';

const ApplicationRequestSchema = z.object({
  jobPostingId: z
    .string({ required_error: 'Job posting ID is required' })
    .refine((id) => mongoose.Types.ObjectId.isValid(id), {
      message: 'Invalid job posting ID format',
    }),
});

const ApplicationStatusSchema = z.object({
  updatedStatus: z.nativeEnum(ApplicationStatus, {
    required_error: 'New updated status is required',
    invalid_type_error: 'Invalid application status',
  }),
});

const ApplicationMetaDataSchema = z.object({
  note: z.string().optional(),
  referrer: z.string().optional(),
  portalLink: z.string().url().optional(),
  interest: z
    .nativeEnum(InterestLevel, {
      invalid_type_error: 'Invalid interest level',
    })
    .optional(),
});

const ApplicationIdParamsSchema = z.object({
  applicationId: z
    .string()
    .refine((id) => mongoose.Types.ObjectId.isValid(id), {
      message: 'Invalid application ID format',
    }),
});

// TODO: dson - need to figure out how to remove "as AuthenticatedRequest"
interface AuthenticatedRequest extends Request {
  user: {
    id: string;
  };
}

export const ApplicationController = {
  createApplication: async (req: Request, res: Response) => {
    const { jobPostingId } = ApplicationRequestSchema.parse(req.body);

    const userId = (req as AuthenticatedRequest).user.id;

    const newApplication = await ApplicationService.createApplication({
      jobPostingId,
      userId,
    });

    res.status(201).json({
      message: 'Application created successfully',
      data: newApplication,
    });
  },

  getApplications: async (req: Request, res: Response) => {
    const userId = (req as AuthenticatedRequest).user.id;

    const applications = await ApplicationService.getApplications(userId);

    res.status(200).json({
      message: 'Applications retrieved successfully',
      data: applications,
    });
    return;
  },

  getApplicationById: async (req: Request, res: Response) => {
    const { applicationId } = ApplicationIdParamsSchema.parse(req.params);
    const userId = (req as AuthenticatedRequest).user.id;

    const application = await ApplicationService.getApplicationById({
      applicationId,
      userId,
    });

    res.status(200).json({
      message: 'Application retrieved successfully',
      data: application,
    });
    return;
  },

  updateApplicationStatus: async (req: Request, res: Response) => {
    const userId = (req as AuthenticatedRequest).user.id;
    const { applicationId } = ApplicationIdParamsSchema.parse(req.params);
    const { updatedStatus } = ApplicationStatusSchema.parse(req.body);

    let updatedApplication: IApplication | null;
    if (updatedStatus === ApplicationStatus.REJECTED) {
      updatedApplication = await ApplicationService.markApplicationAsRejected({
        applicationId,
        userId,
      });
    } else {
      updatedApplication = await ApplicationService.updateApplicationById({
        applicationId,
        userId,
        updatedMetadata: { status: updatedStatus },
      });
    }

    res.status(200).json({
      message: 'Application status updated successfully',
      data: updatedApplication,
    });
  },

  updateApplicationMetadata: async (req: Request, res: Response) => {
    const userId = (req as AuthenticatedRequest).user.id;
    const { applicationId } = ApplicationIdParamsSchema.parse(req.params);
    const updatedMetadata = omitBy(
      ApplicationMetaDataSchema.parse(req.body),
      (value) => value == undefined
    );

    const updatedApplication = await ApplicationService.updateApplicationById({
      applicationId,
      userId,
      updatedMetadata: updatedMetadata,
    });

    res.status(200).json({
      message: 'Application metadata updated successfully',
      data: updatedApplication,
    });
    return;
  },

  deleteApplication: async (req: Request, res: Response) => {
    const userId = (req as AuthenticatedRequest).user.id;
    const { applicationId } = ApplicationIdParamsSchema.parse(req.params);

    const deletedApplication = await ApplicationService.deleteApplicationById({
      applicationId,
      userId,
    });

    res.status(200).json({
      message: 'Application deleted successfully',
      data: deletedApplication,
    });
    return;
  },
};
