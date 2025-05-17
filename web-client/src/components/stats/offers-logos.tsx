import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useOffersData } from '@/hooks/useOffersData';
import { Row, Col } from 'reactstrap';
import { chunk, debounce, slice, sortBy } from 'lodash';
import { CompanyLogo } from '@/components/layout/company-logo';
import { CompanyMetadataWithOffers } from '@/types';
import { useWindowSize } from 'usehooks-ts';

export const OfferLogos = () => {
  const populatedData = useOffersData();
  const data = useMemo(
    () =>
      sortBy(Object.values(populatedData), [
        (d) => -d.offersCountTotal,
        (d) => d.displayName.toLowerCase(),
      ]),
    [populatedData]
  );

  const { width: windowWidth } = useWindowSize();

  const getColumnsCount = useCallback(() => {
    if (windowWidth >= 1200) {
      return 8;
    } else if (windowWidth >= 992) {
      return 6;
    } else if (windowWidth >= 768) {
      return 4;
    } else {
      return 2;
    }
  }, [windowWidth]);

  const [dataChunks, setDataChunks] = useState<CompanyMetadataWithOffers[][]>(
    chunk(data, getColumnsCount())
  );
  const [halfSize, setHalfSize] = useState(getColumnsCount() / 2);

  useEffect(() => {
    const respliceData = () => {
      const newHalfSize = getColumnsCount() / 2;
      if (newHalfSize !== halfSize) {
        setDataChunks(chunk(data, newHalfSize * 2));
        setHalfSize(newHalfSize);
      }
    };
    const debounceRespliceData = debounce(respliceData, 300);

    debounceRespliceData();
  }, [windowWidth, data, halfSize, getColumnsCount]);

  return (
    <div id="companies-logo-canvas">
      <Row className="align-items-start">
        {dataChunks.map((row, index) => {
          return (
            <Fragment key={index}>
              <Col xs="6">
                <Row>
                  {slice(row, 0, halfSize).map((company) => (
                    <Col
                      md="6"
                      lg="4"
                      xl="3"
                      className="mb-4"
                      key={company.displayName}
                    >
                      <CompanyLogo company={company} />
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
                        lg="4"
                        xl="3"
                        className="mb-4"
                        key={company.displayName}
                      >
                        <CompanyLogo company={company} />
                      </Col>
                    ))}
                  </Row>
                )}
              </Col>
            </Fragment>
          );
        })}
      </Row>
    </div>
  );
};
