import React, { useState } from 'react';
import { Col, Row } from 'reactstrap';

interface TabsProps {
  tabNames: {
    title: string;
  }[];
}
export const Tabs: React.FC<TabsProps> = ({ tabNames }) => {
  const [tabIndex, setTabIndex] = useState(0);
  return (
    <Row>
      {tabNames.map((entry, index) => (
        <Col key={index} className="pr-0">
          <div
            className={`tab ${
              index === tabIndex ? 'tab-active' : 'tab-non-active'
            }`}
            onClick={() => setTabIndex(index)}
          >
            <p>{entry.title}</p>
          </div>
        </Col>
      ))}
    </Row>
  );
};
