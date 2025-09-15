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
  JobPostingFilter,
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
  }: {
    userId: string;
    filters: JobPostingFilter;
  }): Promise<JobPostingPagination> => {
    const {
      limit = 10,
      cursor,
      sortOrder = SortOrder.ASC,
      sortField = JobPostingSortField.DATE_POSTED,
      jobTitle,
      companyName,
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
    if (filters?.jobFunction) dynamicMatch.jobFunction = filters.jobFunction;
    if (filters?.location) dynamicMatch.location = filters.location;
    if (filters?.jobType) dynamicMatch.jobType = filters.jobType;
    if (filters?.postingDateRangeStart || filters?.postingDateRangeEnd) {
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
    const getPaginationMatch = (cursor?: string): Record<string, unknown> => {
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

      return paginationMatch;
    };

    let data: IJobPosting[] = [];
    let hasNextPage = true;
    let cursorNext = cursor;
    let paginationMatchNext: Record<string, unknown> =
      getPaginationMatch(cursor);

    while (data.length < limit && hasNextPage) {
      let jobPostings = await JobPostingModel.aggregate([
        {
          $match: {
            ...dynamicMatch,
            deletedAt: null,
          },
        },
        {
          $sort: {
            [sortField]: sortDirection,
            _id: sortDirection,
          },
        },
        { $match: paginationMatchNext },
        { $limit: limit + 1 },
      ]);

      if (jobPostings.length <= limit) {
        hasNextPage = false;
      }

      const jobIds = jobPostings.map((job) => job._id);
      const last = jobPostings[jobPostings.length - 1];
      if (last) {
        const lastCursorValue =
          last[sortField] instanceof Date
            ? last[sortField]?.toISOString()
            : last[sortField];
        cursorNext = `${last._id.toString()}_${lastCursorValue}`;
      }

      paginationMatchNext = getPaginationMatch(cursorNext);

      const temp_data = await JobPostingModel.aggregate([
        {
          $match: {
            _id: { $in: jobIds },
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
          $sort: {
            [sortField]: sortDirection,
            _id: sortDirection,
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
      ]);
      data = [...data, ...temp_data];
    }

    let results = data.slice(0, limit);

    const response: {
      data: IJobPosting[];
      cursor?: string;
    } = {
      data: results,
    };

    if (results.length > 0) {
      const last = results[results.length - 1];
      if (last) {
        const lastCursorValue =
          last[sortField] instanceof Date
            ? last[sortField]?.toISOString()
            : last[sortField];
        response.cursor = `${last._id.toString()}_${lastCursorValue}`;
      }
    }

    return response;
  },
};
