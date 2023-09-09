import userApis from "@/apis/userApis";
import { MASTER_DATA_NAME } from "@/constants";
import errorHelper from "@/utils/error-helper";
import successHelper from "@/utils/success-helper";
import { Button, Modal, Space } from "antd";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";

const ModalUserChangeStatus = ({ onSubmit, onAfterChangeStatus }, ref) => {
    const { t } = useTranslation();
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [idUser, setIdUser] = useState(null);
    const [type, setType] = useState(null);
    const [statusUser, setStatusUser] = useState(null);

    const onOpen = (id, level, type) => {
        setVisible(true);
        setStatusUser(level);
        setIdUser(id);
        setType(type)
    };

    useImperativeHandle(ref, () => ({
        onOpen,
    }));

    const onClose = () => {
        setVisible(false);
        setLoading(false);
        setIdUser(null);
        setStatusUser(null);
    };

    const submitUserChangeStatus = async () => {
        setLoading(true);
        let body = {
          id: idUser,
        };
        type === MASTER_DATA_NAME.STATUS_ORDER && (body.level = statusUser)
        type === MASTER_DATA_NAME.ROLE && (body.role = statusUser);
        return userApis
          .setLevelUser(body)
          .then(() => {
            successHelper(t("update_success"));
            onClose();
            onAfterChangeStatus();
          })
          .catch((err) => {
            errorHelper(err);
          })
          .finally(() => setLoading(false));
    };


    return (
        <>
            <Modal
                footer={null}
                visible={visible}
                onCancel={onClose}
                maskClosable={false}
                destroyOnClose
            >
                <h3>{t("user_status_change")}</h3>
                <div className="d-flex justify-content-center">
                    <Space>
                        <Button
                            className="m-1"
                            htmlType="submit"
                            type="primary"
                            loading={loading}
                            onClick={() => submitUserChangeStatus()}
                        >
                            {t("confirm")}
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
        </>
    );
};

export default forwardRef(ModalUserChangeStatus);
