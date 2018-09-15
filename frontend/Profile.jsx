import React from 'react';
import { Container, Row, Col, ListGroup, ListGroupItem } from 'reactstrap';

const Profile = ({
  userStore: {
    handleInputChange,
    updateUserPhone,
    state: { name, email, phone, updatePhone }
  }
}) => {
  let phoneNo;

  if (!phone) {
    phoneNo = 'N/A';
  } else {
    phoneNo = phone;
  }

  return (
    <Container fluid className="profile">
      <Row className="justify-content-center">
        <Col xs="11" sm="9" md="7" lg="5">
          <ListGroup flush>
            <ListGroupItem>E-mail: {email}</ListGroupItem>
            <ListGroupItem>Name: {name}</ListGroupItem>
            <ListGroupItem>Phone: {phoneNo}</ListGroupItem>
            <ListGroupItem>
              <input type="text" value={updatePhone} onChange={handleInputChange} placeholder="Phone No" />
              <button type="button" onClick={() => updateUserPhone(updatePhone)}>
                click to update phone
              </button>
            </ListGroupItem>
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
