import { useMemo } from 'react';
import { mentorshipPeople } from 'data/people';
import 'styles/scss/stats.scss';
import { OffersBarChart } from './offers-bar-chart';
import { useInterviewData } from 'hooks/useInterviewData';
import { Container } from 'reactstrap';
import { InterviewsBarChart } from './interviews-bar-chart';
import { Tabs, Tab, Box } from '@mui/material';
import { StatsType } from 'utils/constants';
import { useNavigate } from 'react-router-dom';
import { Timeline } from './timeline';
import { OfferLogos } from './offers-logos';

interface StatsPageProps {
  type: StatsType;
}
export const StatsPage: React.FC<StatsPageProps> = ({ type }) => {
  const navigate = useNavigate();

  const onChangeTab = (_e: React.SyntheticEvent, key: StatsType) => {
    navigate(`/stats/${key}`);
  };

  const { data: interviewData } = useInterviewData();

  const { count, data } = useMemo(() => {
    const offers: Record<string, Record<number, number>> = {};
    const people = Object.values(mentorshipPeople);
    let totalCount = 0;
    people.forEach((person) => {
      person.terms.forEach((t) => {
        t?.offers?.forEach((o) => {
          totalCount += 1;
          if (o.name in offers) {
            if (t.year in offers[o.name]) {
              offers[o.name][t.year] += 1;
            } else {
              offers[o.name][t.year] = 1;
            }
          } else {
            offers[o.name] = {};
            offers[o.name][t.year] = 1;
          }
        });
      });
    });
    return {
      count: totalCount,
      data: Object.keys(offers)
        .sort()
        .map((c) => {
          return {
            company: c,
            count2023: offers[c][2023] ?? 0,
            count2024: offers[c][2024] ?? 0,
          };
        }),
    };
  }, []);

  return (
    <>
      <Container>
        <Tabs value={type} onChange={onChangeTab}>
          <Tab label="Logos" value={StatsType.LOGOS} />
          <Tab label="Timeline" value={StatsType.TIMELINE} />
          <Tab label="Offers" value={StatsType.OFFERS} />
          <Tab label="Interviews" value={StatsType.INTERVIEWS} />
        </Tabs>
      </Container>

      <div id="stats-container" className="app-flex flex-column">
        <TabPanel value={type} type={StatsType.LOGOS}>
          <OfferLogos />
        </TabPanel>
        <TabPanel value={type} type={StatsType.TIMELINE}>
          <Timeline datesWithCount={interviewData.datesWithCount} />
        </TabPanel>
        <TabPanel value={type} type={StatsType.OFFERS}>
          <OffersBarChart count={count} data={data} />
        </TabPanel>
        <TabPanel value={type} type={StatsType.INTERVIEWS}>
          <InterviewsBarChart data={interviewData} />
        </TabPanel>
      </div>
    </>
  );
};

interface TabPanelProps {
  children?: React.ReactNode;
  type: StatsType;
  value: StatsType;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, type, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== type}
      id={`simple-tabpanel-${type}`}
      aria-labelledby={`simple-tab-${type}`}
      {...other}
    >
      {value === type && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};
