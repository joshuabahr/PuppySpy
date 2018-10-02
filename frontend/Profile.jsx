import React from 'react';
import { Container, Row, Col, ListGroup, ListGroupItem, Button } from 'reactstrap';
import AddPhoneModal from './AddPhoneModal';

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
    <Container fluid className="mainview profile">
      <Row>
        <AddPhoneModal show={modalShow} onClose={handleModalClose} updateUserPhone={updateUserPhone} />

        <Col xs="12" md="9">
          <ListGroup flush>
            <ListGroupItem className="profilelist">
              <b>E-mail:</b> {email}
            </ListGroupItem>
            <ListGroupItem className="profilelist">
              <b>Name:</b> {name}
            </ListGroupItem>
            <ListGroupItem className="profilelist">
              <b>Phone:</b> {phoneNo}
            </ListGroupItem>
            <ListGroupItem className="profilelist">
              <input type="text" value={updatePhone} onChange={handleInputChange} placeholder="Phone Number" />
              <Button onClick={handleModalShow}>click to update phone</Button>
            </ListGroupItem>
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
