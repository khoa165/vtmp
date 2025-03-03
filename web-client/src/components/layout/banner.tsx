import React from 'react';
import { Col, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import 'styles/scss/layout.scss';

export const Banner = () => {
  return (
    <div id="mentorship-banner">
      <Row className="overlay">
        <Col xs="12" lg="8" className="left-section">
          <h1>Viet Tech Mentorship Program</h1>
          <p>
            Seeks to build a sustainable pipeline of early career talent and
            empower Vietnamese students to break into the tech industry
          </p>
          <Link to="/summary" className="mt-md-5 about-us-btn rainbow d-block">
            View our achievements
          </Link>
        </Col>
        <Col lg="4" className="d-none d-lg-block">
          <div className="viettech-logo-wrapper">
            <img
              src="https://res.cloudinary.com/khoa165/image/upload/v1718192551/viettech/VTMP_logo.png"
              alt="Viet Tech logo banner"
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};
