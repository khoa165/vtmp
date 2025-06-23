import {
  JobPostingModel,
  IJobPosting,
  JobFilter,
  JobFilterPagination,
} from '@/models/job-posting.model';
import { toMongoId } from '@/testutils/mongoID.testutil';
import { JobPostingRegion, SortedOrder } from '@vtmp/common/constants';
import escapeStringRegexp from 'escape-string-regexp';
import { Filter } from 'mongodb';

import { ClientSession } from 'mongoose';

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
    filters?: JobFilter;
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
    ]);
  },

  getJobPostingsUserHasNotAppliedToPagination: async ({
    userId,
    filters,
  }: {
    userId: string;
    filters: JobFilterPagination;
  }): Promise<IJobPosting[]> => {
    const q: Filter<IJobPosting> = {};

    if (filters.jobTitle) {
      q.title = { $regex: filters.jobTitle, $options: 'i' };
    }
    if (filters.companyName) {
      q.companyName = { $regex: filters.companyName, $options: 'i' };
    }
    if (filters.location) {
      q.location = { $regex: filters.location, $options: 'i' };
    }
    if (filters.jobFunction) {
      q.jobFunction = filters.jobFunction;
    }

    if (filters.jobType) {
      q.jobType = filters.jobType;
    }
    if (filters.postingDateRangeStart && filters.postingDateRangeEnd) {
      q.postedAt = {
        $gte: new Date(filters.postingDateRangeStart),
        $lte: new Date(filters.postingDateRangeEnd),
      };
    }

    const appliedJobIds = await JobPostingModel.db
      .collection('applications')
      .find({ userId })
      .project({ jobId: 1 })
      .toArray()
      .then((arr) => arr.map((item) => item.jobId));

    if (appliedJobIds.length) {
      q._id = { $nin: appliedJobIds };
    }

    const allowed = ['_id', 'postedAt'];
    const field = allowed.includes(filters.sortedField ?? '')
      ? filters.sortedField!
      : '_id';
    const direction = filters.sortedOrder === SortedOrder.ASC ? 1 : -1;
    const sort = [
      [field, direction],
      ['_id', direction],
    ] as [string, 1 | -1][];

    if (filters.previous_cursor) {
      const [cursorId, cursorField] = filters.previous_cursor.split('_');
      const parsedId = toMongoId(cursorId || '');
      const parsedField =
        field === 'postedAt'
          ? new Date(cursorField ?? '')
          : field === '_id'
            ? parsedId
            : cursorField;

      q.$or = [
        { [field]: { $lt: parsedField } },
        { [field]: parsedField, _id: { $lt: parsedId } },
      ];
    } else if (filters.next_cursor) {
      const [cursorId, cursorField] = filters.next_cursor.split('_');
      const parsedId = toMongoId(cursorId || '');
      const parsedField =
        field === 'postedAt'
          ? new Date(cursorField ?? '')
          : field === '_id'
            ? parsedId
            : cursorField;

      q.$or = [
        { [field]: { $gt: parsedField } },
        { [field]: parsedField, _id: { $gt: parsedId } },
      ];
    }

    const limit = Math.max(1, Math.min(50, filters.limit || 20));

    const collection = JobPostingModel.db.collection('jobPostings');
    const results = await collection
      .find(q, { sort: sort })
      .limit(limit)
      .toArray();

    if (filters.previous_cursor) {
      results.reverse();
    }

    return results.map((doc) => ({
      ...doc,
      _id: doc._id?.toString?.() ?? doc._id,
    })) as IJobPosting[];
  },
};
