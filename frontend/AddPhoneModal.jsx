import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

const AddPhoneModal = ({ show, onClose, updateUserPhone }) => (
  <Modal isOpen={show} toggle={onClose}>
    <ModalHeader toggle={onClose}>Add Phone Number</ModalHeader>
    <ModalBody>
      <p>By adding your phone number you are agreeing to receive SMS alerts from the PuppySpy website.</p>
      <br />
      <p>You can opt out at any time.</p>
    </ModalBody>
    <ModalFooter>
      <Button color="success" onClick={updateUserPhone}>
        Add Phone Number
      </Button>

      <Button onClick={onClose}>Cancel</Button>
    </ModalFooter>
  </Modal>
);
export default AddPhoneModal;
