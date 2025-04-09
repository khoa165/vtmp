import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useOffersData } from 'src/hooks/useOffersData';
import { Row, Col } from 'reactstrap';
import { chunk, debounce, slice, sortBy } from 'lodash';
import { CompanyLogo } from 'src/components/layout/company-logo';
import { CompanyMetadataWithOffers } from 'src/types';
import { useWindowSize } from 'usehooks-ts';
import { useSummaryData } from 'src/hooks/useSummaryData';
import { useQuery } from '@tanstack/react-query';
import { getSummaryData } from '@/fetch-data/summary';

export const SummaryContainer = () => {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['summary'],
    queryFn: getSummaryData,
  });

  const populatedData = useOffersData();
  const sortedData = useMemo(
    () =>
      sortBy(Object.values(populatedData), [
        (d) => -d.offersCountTotal,
        (d) => (d.isPartTimeOffer ? 1 : 0),
        (d) => d.displayName.toLowerCase(),
      ]),
    [populatedData]
  );

  const { width: windowWidth } = useWindowSize();

  const getColumnsCount = useCallback(() => {
    if (windowWidth >= 1200) {
      return 6;
    } else if (windowWidth >= 768) {
      return 4;
    } else {
      return 2;
    }
  }, [windowWidth]);

  const [dataChunks, setDataChunks] = useState<CompanyMetadataWithOffers[][]>(
    chunk(sortedData, getColumnsCount())
  );
  const [halfSize, setHalfSize] = useState(getColumnsCount() / 2);

  useEffect(() => {
    const respliceData = () => {
      const newHalfSize = getColumnsCount() / 2;
      if (newHalfSize !== halfSize) {
        setDataChunks(chunk(sortedData, newHalfSize * 2));
        setHalfSize(newHalfSize);
      }
    };
    const debounceRespliceData = debounce(respliceData, 300);

    debounceRespliceData();
  }, [windowWidth, sortedData, halfSize, getColumnsCount]);

  const summaryData = useSummaryData();

  if (isLoading || !data) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return (
      <span>Error: {error.message || 'Failed to load summary data.'}</span>
    );
  }

  return (
    <div id="summary-container">
      <Row>
        <Col lg="7">
          <Row className="align-items-start">
            {dataChunks.map((row, index) => {
              return (
                <Fragment key={index}>
                  <Col xs="6">
                    <Row>
                      {slice(row, 0, halfSize).map((company) => (
                        <Col
                          md="6"
                          xl="4"
                          className="mb-4"
                          key={company.displayName}
                        >
                          <CompanyLogo company={company} maxHeight={84} />
                        </Col>
                      ))}
                    </Row>
                  </Col>
                  <Col xs="6">
                    {row.length > halfSize && (
                      <Row>
                        {slice(row, halfSize).map((company) => (
                          <Col
                            md="6"
                            xl="4"
                            className="mb-4"
                            key={company.displayName}
                          >
                            <CompanyLogo company={company} maxHeight={84} />
                          </Col>
                        ))}
                      </Row>
                    )}
                  </Col>
                </Fragment>
              );
            })}
          </Row>
        </Col>
        <Col lg="5">
          <div className="summary-right-panel">
            <div className="left">
              <h4>
                <span>{data.conversations}</span>conversation back in 2022
              </h4>
              <h4>
                <span>{data.snapInterns}</span>Snap interns with a vision
              </h4>
              <h4>
                <span>{data.months}</span>months of wondering
              </h4>
              <h4>
                <span>{data.believers}</span>believers joining forces
              </h4>
              <hr />
            </div>
            <div className="right">
              <h4>
                we reviewed{' '}
                <span>{data.reviewedApplications} applications</span>
              </h4>
              <h4>
                we interviewed{' '}
                <span>{data.interviewedCandidates} candidates</span>
              </h4>
              <h4>
                we assembled <span>{summaryData.mentorsCount} mentors</span>
              </h4>
              <h4>
                we recruited <span>{summaryData.menteesCount} mentees</span>
              </h4>
              <hr />
            </div>
            <div className="left">
              <h4>
                <span>{data.workshops}</span>workshops
              </h4>
              <h4>
                <span>{data.amas}</span>AMAs
              </h4>
              <h4>
                <span>{data.groupProjects}</span>group projects
              </h4>
              <h4>
                <span>{data.leetcodeContests}</span>Leetcode contests
              </h4>
              <hr />
            </div>
            <div className="right">
              <h4>
                we hustled
                <span>{summaryData.invitationsCount} invitations</span>
              </h4>
              <h4>
                we prepared<span>{summaryData.interviewsCount} interviews</span>
              </h4>
              <h4>
                we achieved<span>{summaryData.offersCount} offers</span>
              </h4>
              <h4>
                we collected<span>{summaryData.logosCount} logos</span>
              </h4>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};
