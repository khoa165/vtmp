import escapeStringRegexp from 'escape-string-regexp';
import { ObjectId } from 'mongodb';
import { ClientSession } from 'mongoose';

import {
  JobPostingRegion,
  JobPostingSortField,
  SortOrder,
} from '@vtmp/common/constants';

import {
  IJobPosting,
  JobFilter,
  JobPostingFilterSort,
  JobPostingModel,
  JobPostingPagination,
} from '@/models/job-posting.model';
import { toMongoId } from '@/testutils/mongoID.testutil';

export const JobPostingRepository = {
  createJobPosting: async ({
    jobPostingData,
    session,
  }: {
    jobPostingData: object;
    session?: ClientSession;
  }): Promise<IJobPosting | undefined> => {
    const jobPostings = await JobPostingModel.create([jobPostingData], {
      session: session ?? null,
    });

    return jobPostings[0];
  },

  getJobPostingById: async (jobId: string): Promise<IJobPosting | null> => {
    return JobPostingModel.findOne({ _id: jobId, deletedAt: null }).lean();
  },

  updateJobPostingById: async (
    jobId: string,
    newUpdate: {
      externalPostingId?: string;
      url?: string;
      jobTitle?: string;
      companyName?: string;
      location?: JobPostingRegion;
      datePosted?: Date;
      jobDescription?: string;
      adminNote?: string;
    }
  ): Promise<IJobPosting | null> => {
    return JobPostingModel.findOneAndUpdate(
      { _id: jobId, deletedAt: null },
      { $set: newUpdate },
      { new: true }
    ).lean();
  },

  deleteJobPostingById: async (jobId: string): Promise<IJobPosting | null> => {
    return JobPostingModel.findOneAndUpdate(
      { _id: jobId, deletedAt: null },
      { $set: { deletedAt: new Date() } },
      { new: true }
    ).lean();
  },

  getJobPostingsUserHasNotAppliedTo: async ({
    userId,
    filters,
    limit = 10,
    cursor,
  }: {
    userId: string;
    filters?: JobFilter;
    limit?: number;
    cursor?: { _id: string };
  }): Promise<IJobPosting[]> => {
    const dynamicMatch: Record<string, unknown> = {};

    if (filters?.jobTitle) {
      dynamicMatch.jobTitle = {
        $regex: escapeStringRegexp(filters.jobTitle),
        $options: 'i',
      };
    }
    if (filters?.companyName) {
      dynamicMatch.companyName = {
        $regex: escapeStringRegexp(filters.companyName),
        $options: 'i',
      };
    }
    if (filters?.location) dynamicMatch.location = filters.location;
    if (filters?.postingDateRangeStart || filters?.postingDateRangeEnd) {
      const datePostedFilter: Record<string, Date> = {};

      if (filters.postingDateRangeStart) {
        datePostedFilter.$gte = filters.postingDateRangeStart;
      }
      if (filters.postingDateRangeEnd) {
        datePostedFilter.$lte = filters.postingDateRangeEnd;
      }

      dynamicMatch.datePosted = datePostedFilter;
    }

    return JobPostingModel.aggregate([
      {
        $match: {
          ...dynamicMatch,
          deletedAt: null,
        },
      },
      {
        $lookup: {
          from: 'applications',
          let: { jobId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$jobPostingId', '$$jobId'] },
                    { $eq: ['$userId', toMongoId(userId)] },
                    { $eq: ['$deletedAt', null] },
                  ],
                },
              },
            },
          ],
          as: 'userApplication',
        },
      },
      {
        $match: {
          userApplication: { $size: 0 },
        },
      },
      {
        $project: {
          userApplication: 0,
        },
      },
      ...(cursor
        ? [
            {
              $match: {
                _id: { $gt: toMongoId(cursor._id) },
              },
            },
          ]
        : []),
      { $sort: { _id: 1 } },
      { $limit: limit || 10 },
    ]);
  },

  getJobPostingsUserHasNotAppliedToSort: async ({
    userId,
    filters,
  }: {
    userId: string;
    filters: JobPostingFilterSort;
  }): Promise<JobPostingPagination> => {
    const {
      limit = 10,
      cursor,
      sortOrder = SortOrder.ASC,
      sortField = JobPostingSortField.DATE_POSTED,
      jobTitle,
      companyName,
      location,
      jobFunction,
      jobType,
      postingDateRangeStart,
      postingDateRangeEnd,
    } = filters;

    const dynamicMatch: Record<string, unknown> = {};

    if (jobTitle) {
      dynamicMatch.jobTitle = {
        $regex: escapeStringRegexp(jobTitle),
        $options: 'i',
      };
    }
    if (companyName) {
      dynamicMatch.companyName = {
        $regex: escapeStringRegexp(companyName),
        $options: 'i',
      };
    }
    if (location) dynamicMatch.location = location;
    if (jobFunction) dynamicMatch.jobFunction = jobFunction;
    if (jobType) dynamicMatch.jobType = jobType;
    if (postingDateRangeStart || postingDateRangeEnd) {
      const datePostedFilter: Record<string, Date> = {};

      if (postingDateRangeStart) {
        datePostedFilter.$gte = postingDateRangeStart;
      }
      if (postingDateRangeEnd) {
        datePostedFilter.$lte = postingDateRangeEnd;
      }

      dynamicMatch.datePosted = datePostedFilter;
    }

    const orderKey = sortOrder === SortOrder.ASC ? '$gt' : '$lt';
    const sortDirection = sortOrder === SortOrder.ASC ? 1 : -1;

    let paginationMatch: Record<string, unknown> = {};
    if (cursor) {
      const [cursorIdString, cursorValueString] = cursor.split('_');
      const cursorId = new ObjectId(cursorIdString);

      if (cursorValueString) {
        const cursorValue =
          sortField === JobPostingSortField.DATE_POSTED
            ? new Date(cursorValueString)
            : cursorValueString;

        paginationMatch = {
          $or: [
            { [sortField]: { [orderKey]: cursorValue } },
            {
              [sortField]: cursorValue,
              _id: { [orderKey]: cursorId },
            },
          ],
        };
      } else {
        paginationMatch = {
          _id: { [orderKey]: cursorId },
        };
      }
    }

    const data: IJobPosting[] = await JobPostingModel.aggregate([
      {
        $match: {
          ...dynamicMatch,
          deletedAt: null,
        },
      },
      {
        $lookup: {
          from: 'applications',
          let: { jobId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$jobPostingId', '$$jobId'] },
                    { $eq: ['$userId', toMongoId(userId)] },
                    { $eq: ['$deletedAt', null] },
                  ],
                },
              },
            },
          ],
          as: 'userApplication',
        },
      },
      {
        $match: {
          userApplication: { $size: 0 },
        },
      },
      {
        $project: {
          userApplication: 0,
        },
      },
      ...(cursor ? [{ $match: paginationMatch }] : []),
      {
        $sort: {
          [sortField]: sortDirection,
          _id: sortDirection,
        },
      },
      { $limit: limit + 1 },
    ]);

    let hasNextPage = false;
    let results = data;
    if (data.length > limit) {
      hasNextPage = true;
      results = data.slice(0, limit);
    }

    const response: {
      data: IJobPosting[];
      cursor?: string;
    } = {
      data: results,
    };

    if (hasNextPage) {
      const last = results[results.length - 1];
      if (last) {
        const lastCursorValue =
          sortField === JobPostingSortField.DATE_POSTED
            ? last[sortField]?.toISOString()
            : last[sortField];
        response.cursor = `${last._id.toString()}_${lastCursorValue}`;
      }
    }

    return response;
  },
};
