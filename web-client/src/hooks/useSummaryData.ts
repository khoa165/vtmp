import axios from 'axios';
import { useEffect, useState } from 'react';
import { map, uniqueBy } from 'remeda';

import { EnvConfig } from '@/config/env';
import { offerCompanies } from '@/data/companies';
import { mentorshipPeople } from '@/data/people';

const parseData = (data: string) => {
  const rows = data.split(/\r?\n/).slice(5);
  let invitations = 0;
  let interviews = 0;
  rows.forEach((row) => {
    const columns = row.split(',').slice(1);
    if (columns.length === 0 || columns[0].length === 0) {
      return null;
    }

    const interviewsData = columns.slice(1).filter((col) => col.length > 0);
    interviews += interviewsData.length;
    invitations += uniqueBy(
      map(interviewsData, (d) => d.split(' - ')[2]),
      (x) => x
    ).length;
  });
  return { invitations, interviews };
};

export const useSummaryData = () => {
  const [data, setData] = useState({
    mentorsCount: 0,
    menteesCount: 0,
    invitationsCount: 0,
    interviewsCount: 0,
    offersCount: 0,
    logosCount: 0,
  });

  useEffect(() => {
    const getData = async () => {
      let mentorsCount = 0;
      let menteesCount = 0;
      let offersCount = 0;

      Object.values(mentorshipPeople).forEach((person) => {
        if (person.hasNeverBeenMenteeOfProgram) {
          mentorsCount += 1;
        } else {
          menteesCount += 1;
          person.terms?.forEach((term) => {
            offersCount += term.offers?.length ?? 0;
          });
        }
      });

      let invitationsCount = 0;
      let interviewsCount = 0;

      if (EnvConfig.get().VITE_VTMP_2023_INTERVIEWS_CSV) {
        const res = await axios.get(
          EnvConfig.get().VITE_VTMP_2023_INTERVIEWS_CSV
        );

        const { invitations, interviews } = parseData(res.data);
        invitationsCount += invitations;
        interviewsCount += interviews;
      }
      if (EnvConfig.get().VITE_VTMP_2024_INTERVIEWS_CSV) {
        const res = await axios.get(
          EnvConfig.get().VITE_VTMP_2024_INTERVIEWS_CSV
        );

        const { invitations, interviews } = parseData(res.data);
        invitationsCount += invitations;
        interviewsCount += interviews;
      }
      setData({
        mentorsCount,
        menteesCount,
        invitationsCount,
        interviewsCount,
        offersCount,
        logosCount: Object.keys(offerCompanies).length,
      });
    };

    getData();
  }, []);

  return data;
};
