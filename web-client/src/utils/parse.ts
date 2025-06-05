import { map, uniqueBy, sumBy, countBy, flatMap, filter } from 'remeda';
import moment from 'moment';
import {
  DateWithCount,
  InterviewData,
  InterviewRecordsPerCompany,
  MentorshipTerm,
  MergedDateWithCount,
} from '@/types';
import { isSome } from '@/utils/maybe';
import { interviewTypeAbbreviation, MentorshipYear } from './constants';
import { mentorshipPeople } from '@/data/people';
import { InterviewType } from '@vtmp/common/constants';

interface InterviewCell {
  date: string;
  type: string;
  person: string;
}

interface InterviewCount {
  mixedCount: number;
  technicalCount: number;
  behavioralCount: number;
  practicalCount: number;
}

const processInterviewCell = (
  cell: string,
  counts: InterviewCount
): InterviewCell => {
  const [date, type, person] = cell.split(' - ');
  const hasTechnicalPortion = [
    InterviewType.TECHNICAL_LC_CODING,
    InterviewType.PRACTICAL_CODING,
  ].some((t) => type.includes(interviewTypeAbbreviation[t]));
  const hasBehavioralPortion = [
    InterviewType.OVERALL_BEHAVIORAL,
    InterviewType.RECRUITER_SCREEN,
    InterviewType.HIRING_MANAGER,
  ].some((t) => type.includes(interviewTypeAbbreviation[t]));
  const hasPracticalPortion = [
    InterviewType.TRIVIA_CONCEPT,
    InterviewType.SYSTEM_DESIGN,
    InterviewType.PROJECT_WALKTHROUGH,
    InterviewType.DEBUGGING,
    InterviewType.CRITICAL_THINKING,
    InterviewType.CODE_REVIEW,
  ].some((t) => type.includes(interviewTypeAbbreviation[t]));
  const interviewFlags = [
    hasTechnicalPortion,
    hasBehavioralPortion,
    hasPracticalPortion,
  ];
  const interviewTypes = interviewFlags.filter((hasType) => hasType);
  const isMixedInterview = interviewTypes.length !== 1;

  if (isMixedInterview) {
    counts.mixedCount += 1;
  } else if (hasTechnicalPortion) {
    counts.technicalCount += 1;
  } else if (hasBehavioralPortion) {
    counts.behavioralCount += 1;
  } else if (hasPracticalPortion) {
    counts.practicalCount += 1;
  }

  return {
    date,
    type,
    person,
  };
};

export const parseInterviewRecords = (
  csvText: string,
  year: number
): InterviewData => {
  const rows = csvText.split(/\r?\n/).slice(5);
  const data: InterviewRecordsPerCompany[] = [];
  let totalInvitationsCount = 0;
  let totalInterviewsCount = 0;
  let totalMixedCount = 0;
  let totalTechnicalCount = 0;
  let totalBehavioralCount = 0;
  let totalPracticalCount = 0;
  const interviews = rows
    .map((row) => {
      const columns = row.split(',').slice(1);
      if (columns.length === 0 || columns[0].length === 0) {
        return null;
      }
      const company = columns[0];
      const interviewsData = columns.slice(1).filter((col) => col.length > 0);
      const counts = {
        mixedCount: 0,
        technicalCount: 0,
        behavioralCount: 0,
        practicalCount: 0,
      };
      const interviews = interviewsData.map((col) => {
        const { date, type, person } = processInterviewCell(col, counts);

        const formattedDate = moment(
          `${year} - ${date}`,
          'YYYY - MMM DD'
        ).format('MMM DD');
        return { date: formattedDate, type, person };
      });
      const invitationsCount = uniqueBy(
        map(interviewsData, (d) => d.split(' - ')[2]),
        (x) => x
      ).length;
      const interviewsCount = sumBy(Object.values(counts), (x) => x as number);
      data.push({
        company,
        invitationsCount,
        interviewsCount,
        ...counts,
        interviews,
      });

      totalInterviewsCount += interviewsCount;
      totalInvitationsCount += invitationsCount;
      totalMixedCount += counts.mixedCount;
      totalTechnicalCount += counts.technicalCount;
      totalBehavioralCount += counts.behavioralCount;
      totalPracticalCount += counts.practicalCount;

      return interviews;
    })
    .filter(isSome)
    .flatMap((il) => il);
  const countByDate = countBy(interviews, (i) => i.date);
  const datesWithCount: DateWithCount[] = [];
  let currentMoment = moment(`${year}-07-01`, 'YYYY-MM-DD');
  let countSoFar = 0;
  const oneYearFromNow = moment(`${year}-07-01`, 'YYYY-MM-DD')
    .add(1, 'year')
    .subtract(1, 'day');
  while (currentMoment.isSameOrBefore(oneYearFromNow, 'day')) {
    if (currentMoment.month() === 1 && currentMoment.date() === 28) {
      // Skip Feb 29
      currentMoment = currentMoment.add(1, 'day');
      continue;
    }
    const key = currentMoment.format('MMM DD');
    const count = countByDate[key] || 0;
    countSoFar += count;
    datesWithCount.push({
      date: currentMoment.format('MMM DD'),
      count: countSoFar,
    });
    currentMoment = currentMoment.add(1, 'day');
  }

  return {
    data,
    totalInterviewsCount,
    totalInvitationsCount,
    datesWithCount,
    totalMixedCount,
    totalTechnicalCount,
    totalBehavioralCount,
    totalPracticalCount,
  };
};

const countOfferByDate = (terms: MentorshipTerm[]) =>
  countBy(
    filter(
      flatMap(terms, (t) => t.offers),
      isSome
    ),
    (o) => moment(o.date, 'YYYY-MM-DD').format('MMM DD')
  );

export const getDatesWithCountOffers = () => {
  const terms = Object.values(mentorshipPeople).flatMap((p) => p.terms);
  const offers2023 = countOfferByDate(terms.filter((t) => t.year === 2023));
  const offers2024 = countOfferByDate(terms.filter((t) => t.year === 2024));

  const datesWithCount: MergedDateWithCount[] = [];
  let currentMoment = moment(`2024-07-01`, 'YYYY-MM-DD');
  let count2023SoFar = 0;
  let count2024SoFar = 0;
  const oneYearFromNow = moment(`2024-07-01`, 'YYYY-MM-DD')
    .add(1, 'year')
    .subtract(1, 'day');
  while (currentMoment.isSameOrBefore(oneYearFromNow, 'day')) {
    if (currentMoment.month() === 1 && currentMoment.date() === 28) {
      // Skip Feb 29
      currentMoment = currentMoment.add(1, 'day');
      continue;
    }
    const key = currentMoment.format('MMM DD');
    count2023SoFar += offers2023[key] || 0;
    count2024SoFar += offers2024[key] || 0;
    datesWithCount.push({
      date: currentMoment.format('MMM DD'),
      [MentorshipYear.YEAR_2023]: count2023SoFar,
      [MentorshipYear.YEAR_2024]: count2024SoFar,
    });
    currentMoment = currentMoment.add(1, 'day');
  }
  return datesWithCount;
};
