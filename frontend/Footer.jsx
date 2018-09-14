import React from 'react';
import { Container, Row, Col } from 'reactstrap';

const Footer = () => (
  <Container fluid className="footer">
    <Row>
      <Col xs="4" className="text-sm-center">
        <p>©2018: Joshua Bahr</p>
      </Col>
      <Col xs="4" className="text-sm-center">
        <a href="https://github.com/joshuabahr">GitHub</a>
      </Col>
      <Col xs="4" className="text-sm-center">
        <a href="mailto:joshuabahr73@gmail.com">Email</a>
      </Col>
    </Row>
  </Container>
);

export default Footer;
