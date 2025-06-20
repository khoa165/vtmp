import mongoose, { Document, Schema, Types, UpdateQuery } from 'mongoose';

import {
  JobFunction,
  LinkStatus,
  JobType,
  LinkProcessingFailureStage,
 LinkRegion } from '@vtmp/common/constants';

import { InternalServerError } from '@/utils/errors';

export interface ILink extends Document {
  _id: Types.ObjectId;
  url: string;
  originalUrl: string;
  status: LinkStatus;
  failureStage?: LinkProcessingFailureStage;
  submittedOn: Date;
  jobTitle?: string;
  companyName?: string;
  location?: LinkRegion;
  jobFunction?: JobFunction;
  jobType?: JobType;
  datePosted?: Date;
  jobDescription?: string;
  attemptsCount: number;
  lastProcessedAt?: Date;
  submittedBy?: Types.ObjectId;
  deletedAt?: Date;
}

const LinkSchema = new mongoose.Schema<ILink>(
  {
    originalUrl: {
      type: String,
      unique: true,
      required: true,
    },
    url: {
      type: String,
      default: function (this: ILink) {
        return this.originalUrl;
      },
      unique: true,
    },

    status: {
      type: String,
      enum: Object.values(LinkStatus),
      default: LinkStatus.PENDING_PROCESSING,
    },
    failureStage: {
      type: String,
      enum: Object.values(LinkProcessingFailureStage),
    },
    submittedOn: {
      type: Date,
      default: Date.now,
    },
    jobTitle: {
      type: String,
    },
    companyName: {
      type: String,
    },
    location: {
      type: String,
      enum: Object.values(LinkRegion),
    },
    jobFunction: {
      type: String,
      enum: Object.values(JobFunction),
    },
    jobType: {
      type: String,
      enum: Object.values(JobType),
    },
    datePosted: {
      type: Date,
    },
    jobDescription: {
      type: String,
    },
    attemptsCount: {
      type: Number,
      default: 0,
    },
    lastProcessedAt: {
      type: Date,
    },
    submittedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

LinkSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate() as UpdateQuery<ILink>;
  if (!('$set' in update)) {
    return next(
      new InternalServerError('Updates must use the $set operator', { update })
    );
  }
  const status = update['$set']?.status;
  const failureStage = update['$set']?.failureStage;

  if (status === undefined || failureStage === undefined) {
    return next(
      new InternalServerError('status or failureStage must be set', { update })
    );
  }
  if (status === LinkStatus.PENDING_PROCESSING) {
    return next(
      new InternalServerError('status cannot be reset to PENDING_PROCESSING', {
        update,
      })
    );
  }

  const isFailed =
    status === LinkStatus.PENDING_RETRY ||
    status === LinkStatus.PIPELINE_FAILED ||
    status === LinkStatus.PIPELINE_REJECTED;

  if (isFailed) {
    if (!failureStage) {
      return next(
        new InternalServerError(
          'failureStage must be set when status is PENDING_RETRY, PIPELINE_FAILED, or PIPELINE_REJECTED',
          { update }
        )
      );
    }
  } else {
    if (failureStage) {
      return next(
        new InternalServerError(
          'failureStage must not be set for ADMIN_APPROVED, ADMIN_REJECTED, PENDING_PROCESSING, or PENDING_ADMIN_REVIEW',
          { update }
        )
      );
    }
  }

  if (
    status !== LinkStatus.ADMIN_APPROVED &&
    status !== LinkStatus.ADMIN_REJECTED
  ) {
    const attemptsCount = update['$set']?.attemptsCount;
    const lastProcessedAt = update['$set']?.lastProcessedAt;

    if (attemptsCount === undefined) {
      return next(
        new InternalServerError('attemptsCount must be set', { update })
      );
    } else if (attemptsCount <= 0) {
      return next(
        new InternalServerError('attemptsCount must be greater than 0', {
          update,
        })
      );
    }

    if (!lastProcessedAt) {
      return next(
        new InternalServerError('lastProcessedAt must be set', { update })
      );
    }
  }

  next();
});

export const LinkModel = mongoose.model<ILink>('Link', LinkSchema);
