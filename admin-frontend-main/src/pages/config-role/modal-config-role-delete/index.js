import errorHelper from '@/utils/error-helper';
import successHelper from '@/utils/success-helper';
import { Button, Modal, Space } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';

const ModalConfigRoleDelete = ({ onSubmit, onAfterDelete }, ref) => {
    const { t } = useTranslation()
    const [visible, setVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [actionsId, setActionsId] = useState([]);
    const [groupId, setGroupId] = useState();

    const onOpen = (roleGroup) => {
        setVisible(true)
        setGroupId(roleGroup.groupId);
        setActionsId(roleGroup.actions.map((actions) => actions.id));
    }

    useImperativeHandle(ref, () => ({
        onOpen
    }))

    const onClose = () => {
        setVisible(false)
        setLoading(false),
        setGroupId()
        setActionsId([]);
    }

    const submitDeleteRoleModule = () => {
        const body = {
          actionsId,
          groupId,
        };
        setLoading(true)
        return onSubmit(body)
          .then(() => {
            successHelper(t("delete_success"));
            onClose();
            onAfterDelete();
          })
          .catch((err) => errorHelper(err))
          .finally(() => setLoading(false));
    }

    return (
      <Modal
        footer={null}
        visible={visible}
        onCancel={onClose}
        maskClosable={false}
        destroyOnClose
      >
        <h3 className="mb-3">Bạn có muốn xoá quyền truy cập module này không ?</h3>
        <div className="d-flex justify-content-center">
          <Space>
            <Button
              className="m-1"
              htmlType="submit"
              type="primary"
              danger
              loading={loading}
              onClick={() => submitDeleteRoleModule()}
            >
              {t("approve")}
            </Button>
            <Button
              className="m-1"
              htmlType="submit"
              loading={loading}
              onClick={() => onClose()}
            >
              {t("close")}
            </Button>
          </Space>
        </div>
      </Modal>
    );
};

export default forwardRef(ModalConfigRoleDelete)
