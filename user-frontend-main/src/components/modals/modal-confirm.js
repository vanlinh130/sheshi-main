import React from "react";
import { Button, Modal } from "react-bootstrap";

const ModalConfirm = (props) => {
    const { show, handleClose, handleAction, header, content, button } = props;
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{header}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{content}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleAction}>
            {button}
          </Button>
        </Modal.Footer>
      </Modal>
    );   
}

export default ModalConfirm;