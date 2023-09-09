import errorHelper from '@/utils/error-helper';
import successHelper from '@/utils/success-helper';
import yup from '@/utils/yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Modal, Input, Select, Tooltip, Spin, Image, Typography } from "antd";
import React, { forwardRef, useImperativeHandle, useState, useRef, useEffect } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import configDataApis from "@/apis/configDataApis";
import { BONUS_TYPE, MASTER_DATA } from '@/constants';
import { numberDecimalWithCommas } from '@/utils/funcs';
import accountApis from '@/apis/accountApis';

export const TYPE_MODAL = {
  APPROVE: 1,
  REJECT: 2,
};

const ModalWithdrawBonus = ({ onSubmit, onAfterUpdate }, ref) => {
  const { t } = useTranslation();
  const { Text } = Typography;
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({});

  const [visible, setVisible] = useState(false);
  const [user, setUser] = useState();
  const [typeModal, setTypeModal] = useState();

  const onOpen = (record, type) => {
    setTypeModal(type)
    setVisible(true);
    setUser(record)
  };

  useImperativeHandle(ref, () => ({
    onOpen,
  }));

  const onClose = () => {
    setVisible(false);
    reset();
  };

  const submitWithdraw = async () => {
    const payload = {
      type:
        typeModal === TYPE_MODAL.APPROVE
          ? BONUS_TYPE.WITHDRAW
          : BONUS_TYPE.REJECT,
    };

    return accountApis
      .updateTypeBonus(user.id, payload)
      .then(() => {
        successHelper("Đã xác nhận thành công");
        onClose();
        onAfterUpdate();
      })
      .catch((err) => {
        console.log(err)
        errorHelper(err);
      });
  };

  return (
    <Modal
      footer={null}
      visible={visible}
      onCancel={onClose}
      maskClosable={false}
      destroyOnClose
    >
      <h3>Xác nhận trả tiền cho người dùng</h3>
      <form onSubmit={handleSubmit(submitWithdraw)}>
        {typeModal === TYPE_MODAL.APPROVE && (
          <h4>Bạn muốn xác nhận trả tiền cho người dùng ?</h4>
        )}
        {typeModal === TYPE_MODAL.REJECT && (
          <h5>Bạn muốn từ chối trả tiền hoa hồng cho người dùng</h5>
        )}
        <div className="d-flex justify-content-center">
          <Button htmlType="submit" type="primary">
            {typeModal === TYPE_MODAL.APPROVE ? "Chấp nhận" : "Từ chối" }
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default forwardRef(ModalWithdrawBonus)
