import React from 'react';
import { Container, Row, Col, ListGroup, ListGroupItem } from 'reactstrap';
import AddPhoneModal from './AddPhoneModal';

// on Phone number add, validates phone number by sending SMS

// add a way to delete phone number via SMS response?

const Profile = ({
  userStore: {
    handleInputChange,
    updateUserPhone,
    handleModalShow,
    handleModalClose,
    state: { name, email, phone, updatePhone, modalShow }
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
        <AddPhoneModal show={modalShow} onClose={handleModalClose} updateUserPhone={updateUserPhone} />

        <Col xs="11" sm="9" md="7" lg="5">
          <ListGroup flush>
            <ListGroupItem>E-mail: {email}</ListGroupItem>
            <ListGroupItem>Name: {name}</ListGroupItem>
            <ListGroupItem>Phone: {phoneNo}</ListGroupItem>
            <ListGroupItem>
              <input type="text" value={updatePhone} onChange={handleInputChange} placeholder="Phone No" />
              <button type="button" onClick={() => handleModalShow()}>
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
