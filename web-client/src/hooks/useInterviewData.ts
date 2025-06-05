import axios from 'axios';
import { groupBy, sortBy } from 'remeda';
import { useEffect, useState } from 'react';
import {
  DateWithCount,
  InterviewRecordsPerCompany,
  MergedDateWithCount,
  MergedInterviewData,
  MergedInterviewRecordsPerCompany,
} from '@/types';
import { MentorshipYear } from '@/utils/constants';
import { parseInterviewRecords } from '@/utils/parse';
import { EnvConfig } from '@/config/env';

export const useInterviewData = () => {
  const [data, setData] = useState<MergedInterviewData>({
    data: [] as MergedInterviewRecordsPerCompany[],
    totalInterviewsCount: 0,
    totalInvitationsCount: 0,
    datesWithCount: [],
  });
  useEffect(() => {
    const getData = async () => {
      const dataObj: MergedInterviewData = {
        data: [] as MergedInterviewRecordsPerCompany[],
        totalInterviewsCount: 0,
        totalInvitationsCount: 0,
        datesWithCount: [] as MergedDateWithCount[],
      };
      const unmergedDatesWithCount = [] as DateWithCount[][];
      const dataRecords: Partial<
        Record<MentorshipYear, InterviewRecordsPerCompany[]>
      > = {};
      if (EnvConfig.get().VITE_VTMP_2023_INTERVIEWS_CSV) {
        const res = await axios.get(
          EnvConfig.get().VITE_VTMP_2023_INTERVIEWS_CSV
        );
        const { data: interviewData2023, ...remaining } = parseInterviewRecords(
          res.data,
          2023
        );
        dataRecords[MentorshipYear.YEAR_2023] = interviewData2023;
        dataObj[MentorshipYear.YEAR_2023] = remaining;
        dataObj.totalInterviewsCount += remaining.totalInterviewsCount;
        dataObj.totalInvitationsCount += remaining.totalInvitationsCount;
        unmergedDatesWithCount.push(remaining.datesWithCount);
      }
      if (EnvConfig.get().VITE_VTMP_2024_INTERVIEWS_CSV) {
        const res = await axios.get(
          EnvConfig.get().VITE_VTMP_2024_INTERVIEWS_CSV
        );
        const { data: interviewData2024, ...remaining } = parseInterviewRecords(
          res.data,
          2024
        );
        dataRecords[MentorshipYear.YEAR_2024] = interviewData2024;
        dataObj[MentorshipYear.YEAR_2024] = remaining;
        dataObj.totalInterviewsCount += remaining.totalInterviewsCount;
        dataObj.totalInvitationsCount += remaining.totalInvitationsCount;
        unmergedDatesWithCount.push(remaining.datesWithCount);
      }
      const dataWithYearPopulated = Object.entries(dataRecords)
        .map(([year, data]) =>
          data.map((d) => {
            return {
              ...d,
              year,
            };
          })
        )
        .flatMap((d) => d);

      Object.entries(groupBy(dataWithYearPopulated, (d) => d.company)).forEach(
        ([company, interviewData]) => {
          const dataPerCompany: MergedInterviewRecordsPerCompany = {
            company,
            [MentorshipYear.YEAR_2023]: interviewData.find(
              (d) => d.year === MentorshipYear.YEAR_2023
            ),
            [MentorshipYear.YEAR_2024]: interviewData.find(
              (d) => d.year === MentorshipYear.YEAR_2024
            ),
          };
          dataObj.data.push(dataPerCompany);
        }
      );
      dataObj.data = sortBy(dataObj.data, (d) => d.company);
      // Condition to ensure nmergedDatesWithCount[0] is not accessed if the array is empty
      if (unmergedDatesWithCount.length > 0) {
        for (let i = 0; i < unmergedDatesWithCount[0].length; i++) {
          dataObj.datesWithCount.push({
            date: unmergedDatesWithCount[0][i].date,
            [MentorshipYear.YEAR_2023]:
              unmergedDatesWithCount[0][i]?.count ?? 0,
            [MentorshipYear.YEAR_2024]:
              unmergedDatesWithCount[1][i]?.count ?? 0,
          });
        }
      }
      setData(dataObj);
    };
    getData();
  }, []);
  return { data };
};
