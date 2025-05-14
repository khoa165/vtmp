import { Request, Response } from 'express';
import { ApplicationService } from '@/services/application.service';
import { z } from 'zod';
import mongoose from 'mongoose';
import { ApplicationStatus, InterestLevel } from '@vtmp/common/constants';
import { IApplication } from '@/models/application.model';
import { getUserFromRequest } from '@/middlewares/utils';

const JobPostingIdParamSchema = z.object({
  jobPostingId: z
    .string({ required_error: 'Job posting ID is required' })
    .refine((id) => mongoose.Types.ObjectId.isValid(id), {
      message: 'Invalid job posting ID format',
    }),
});

const ApplicationIdParamsSchema = z.object({
  applicationId: z
    .string({ required_error: 'Application ID is required' })
    .refine((id) => mongoose.Types.ObjectId.isValid(id), {
      message: 'Invalid application ID format',
    }),
});

const ApplicationStatusUpdateSchema = z
  .object({
    updatedStatus: z.nativeEnum(ApplicationStatus, {
      message: 'Invalid application status',
    }),
  })
  .strict({ message: 'Only allow updating status' });

const ApplicationFilterSchema = z
  .object({
    status: z
      .nativeEnum(ApplicationStatus, {
        message: 'Invalid application status',
      })
      .optional(),
  })
  .strict({
    message: 'Only allow filtering by status',
  })
  .transform((data: object) =>
    Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    )
  );

const ApplicationMetadataUpdateSchema = z
  .object({
    note: z.string().optional(),
    referrer: z.string().optional(),
    portalLink: z.string().url().optional(),
    interest: z
      .nativeEnum(InterestLevel, {
        message: 'Invalid interest level',
      })
      .optional(),
  })
  .strict({ message: 'Only allow updating valid metadata fields' })
  .transform((data: object) =>
    Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    )
  );

export const ApplicationController = {
  createApplication: async (req: Request, res: Response) => {
    const { jobPostingId } = JobPostingIdParamSchema.parse(req.body);

    // const userId = getUserFromRequest(req).user.id;
    const userId = '68110356bd157e78f5a2137e';

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
    // const userId = getUserFromRequest(req).user.id;
    const userId = '68110356bd157e78f5a2137e';

    const filters = ApplicationFilterSchema.parse(req.query);
    const applications = await ApplicationService.getApplications({
      userId,
      filters,
    });

    res.status(200).json({
      message: 'Applications retrieved successfully',
      data: applications,
    });
  },

  getApplicationById: async (req: Request, res: Response) => {
    const { applicationId } = ApplicationIdParamsSchema.parse(req.params);
    const userId = getUserFromRequest(req).user.id;

    const application = await ApplicationService.getApplicationById({
      applicationId,
      userId,
    });

    res.status(200).json({
      message: 'Application retrieved successfully',
      data: application,
    });
  },

  updateApplicationStatus: async (req: Request, res: Response) => {
    // const userId = getUserFromRequest(req).user.id;
    const userId = '68110356bd157e78f5a2137e';
    const { applicationId } = ApplicationIdParamsSchema.parse(req.params);
    const { updatedStatus } = ApplicationStatusUpdateSchema.parse(req.body);

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
    const userId = getUserFromRequest(req).user.id;
    const { applicationId } = ApplicationIdParamsSchema.parse(req.params);
    const updatedMetadata = ApplicationMetadataUpdateSchema.parse(req.body);

    const updatedApplication = await ApplicationService.updateApplicationById({
      applicationId,
      userId,
      updatedMetadata,
    });

    res.status(200).json({
      message: 'Application metadata updated successfully',
      data: updatedApplication,
    });
  },

  deleteApplication: async (req: Request, res: Response) => {
    // const userId = getUserFromRequest(req).user.id;
    const userId = '68110356bd157e78f5a2137e';
    const { applicationId } = ApplicationIdParamsSchema.parse(req.params);

    const deletedApplication = await ApplicationService.deleteApplicationById({
      applicationId,
      userId,
    });

    res.status(200).json({
      message: 'Application deleted successfully',
      data: deletedApplication,
    });
  },

  getApplicationsCountByStatus: async (req: Request, res: Response) => {
    // const userId = getUserFromRequest(req).user.id;
    const userId = '68110356bd157e78f5a2137e';

    const applicationsCountByStatus =
      await ApplicationService.getApplicationsCountByStatus(userId);

    res.status(200).json({
      message: 'Applications count by status retrieved successfully',
      data: applicationsCountByStatus,
    });
  },
};
