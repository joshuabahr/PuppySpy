import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

const AllowUserModal = ({ camId, show, onClose, allowCamUser }) => (
  <Modal isOpen={show} toggle={onClose}>
    <ModalHeader toggle={onClose}>Allow User Access</ModalHeader>
    <ModalBody>
      <p>By clicking &apos;Allow User Access&apos; you will be providing the user permanent access to this stream.</p>
      <br />
      <p>The user will not have access to any other streams you&apos;ve created.</p>
    </ModalBody>
    <ModalFooter>
      <Button color="success" onClick={() => allowCamUser(camId)}>
        Allow User Access
      </Button>

      <Button onClick={onClose}>Cancel</Button>
    </ModalFooter>
  </Modal>
);
export default AllowUserModal;
