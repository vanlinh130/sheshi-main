import accountApis from "@/apis/accountApis";
import { BONUS_TYPE } from "@/constants";
import errorHelper from "@/utils/error-helper";
import numberWithCommas from "@/utils/number-with-commas";
import successHelper from "@/utils/success-helper";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

const ModalWithdraw = (prop) => {
  const { show, handleClose, totalBonus, userId } = prop;
  const [validated, setValidated] = useState(false);

  const withdraw = async (e) => {
    e.preventDefault();
    setValidated(true);
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      return;
    }
    const payload = {
      priceBonus: +e.target.priceBonus.value,
      userId,
      type: BONUS_TYPE.REQUEST,
    };

    return accountApis
      .withdrawBonus(payload)
      .then(() => {
        successHelper("Bạn đã gửi yêu cầu rút tiền");
        handleClose();
      })
      .catch((err) => {
        errorHelper(err);
      });
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Yêu cầu rút thưởng</Modal.Title>
        </Modal.Header>
        <Form noValidate validated={validated} onSubmit={withdraw}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="priceBonus">
              <Form.Label>Số tiền thưởng</Form.Label>
              <Form.Control
                type="number"
                required
                defaultValue={totalBonus}
                max={totalBonus}
                min={5000}
                placeholder="Nhập số tiền thưởng muốn rút"
                autoFocus
              />
              <Form.Control.Feedback type="invalid">
                Vui lòng nhập đúng số tiền muốn rút.
                <br />
                Số tiền tối đa bạn được rút là {numberWithCommas(totalBonus)}đ
              </Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Yêu cầu rút
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default ModalWithdraw;
