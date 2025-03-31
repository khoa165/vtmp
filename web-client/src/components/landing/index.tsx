import { useRef } from 'react';
import { PrgramValues } from './program-values';
import { mentorshipProgramValues } from 'utils/values';
import { VisualStack } from './visual-stack';
import { Col, Row } from 'reactstrap';
import { BannerPage } from './banner-page';

export const LandingContainer = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const onScrollClick = (keyword) => {
    const element = document.getElementById(`value-${keyword.toLowerCase()}`);
    element?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  return (
    <div id="landing-page">
      <BannerPage contentRef={contentRef} />
      <div id="content-wrapper" ref={contentRef}>
        {mentorshipProgramValues.map((group, index) => (
          <div
            key={index}
            className="value-page-wrapper"
            id={`value-${group.keyword.toLowerCase()}`}
          >
            <Row>
              <Col md="6" className="visual-stack-wrapper">
                <VisualStack activeTile={index} />
              </Col>
              <Col md="6" className="program-value-wrapper">
                <PrgramValues
                  key={index}
                  keyword={group.keyword}
                  value={group.value}
                />
              </Col>
            </Row>
            {index < mentorshipProgramValues.length - 1 && (
              <div
                className="arrows-wrapper"
                onClick={() => onScrollClick(group.nextKeyword)}
              >
                <div className="arrows" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
