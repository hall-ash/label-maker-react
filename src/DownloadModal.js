import React from 'react';
import { Modal, ModalHeader, ModalBody, Button } from 'reactstrap';

const DownloadModal = ({ isOpen, toggle, downloadLink }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Download PDF</ModalHeader>
      <ModalBody>
        <Button color="primary" onClick={() => {
          const link = document.createElement('a');
          link.href = downloadLink;
          link.download = 'demo.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }}>
          Download Label Sheet(s)
        </Button>
      </ModalBody>
    </Modal>
  );
};

export default DownloadModal;

