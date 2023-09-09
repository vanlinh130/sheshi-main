import errorHelper from "@/utils/error-helper";
import successHelper from "@/utils/success-helper";
import { Button, Modal, Space } from "antd";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";
import orderApis from "@/apis/orderApis";
import { STATUS_ORDER } from "@/constants";
import { checkConditionLevelUp } from "@/utils/funcs";
import userApis from "@/apis/userApis";

const ModalOrderChangeStatus = ({ onSubmit, onAfterChangeStatus }, ref) => {
    const { t } = useTranslation();
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [idOrder, setIdOrder] = useState(null);
    const [order, setOrder] = useState(null);
    const [userId, setUserId] = useState();
    const [statusOrder, setStatusOrder] = useState(null);

    const onOpen = (id, status, record) => {
        setVisible(true);
        setStatusOrder(status);
        setIdOrder(id);
        const order = record.orderItem.map((e) => ({
            quantity: e.quantity,
            productId: e.productId,
            subProductId: e.subProductId
        }));
        setOrder(order)
        setUserId(record.userId)
    };

    useImperativeHandle(ref, () => ({
        onOpen,
    }));

    const onClose = () => {
        setVisible(false);
        setLoading(false);
        setIdOrder(null);
        setStatusOrder(null);
    };

    const submitOrderChangeStatus = async () => {
        setLoading(true);
        const user = await userApis.getAccountInfoUser({ id: userId });
        const body = {
          status: statusOrder,
          productDetail: order,
        };
        return orderApis
            .updateOrder(idOrder, body)
            .then(() => {
                if (body.status === STATUS_ORDER.DELIVERED && !!userId) {
                    console.log("ok");
                  checkConditionLevelUp(user);
                }
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
                <h3>{t("order_status_change")}</h3>
                <div className="d-flex justify-content-center">
                    <Space>
                        <Button
                            className="m-1"
                            htmlType="submit"
                            type="primary"
                            loading={loading}
                            onClick={() => submitOrderChangeStatus()}
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

export default forwardRef(ModalOrderChangeStatus);
