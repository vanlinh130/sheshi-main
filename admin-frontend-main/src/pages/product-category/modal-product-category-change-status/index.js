import errorHelper from "@/utils/error-helper";
import successHelper from "@/utils/success-helper";
import { Button, Modal, Space } from "antd";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";
import { GLOBAL_STATUS } from "@/constants";
import productCategoryApis from "@/apis/productCategoryApis";

const ModalProductCategoryChangeStatus = (
    { onSubmit, onAfterChangeStatus },
    ref
) => {
    const { t } = useTranslation();
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [idProductCategory, setIdProductCategory] = useState(null);
    const [statusProductCategory, setStatusProductCategory] = useState(null);

    const onOpen = (id, item) => {
        setVisible(true);
        setStatusProductCategory(item.status);
        setIdProductCategory(id);
    };

    useImperativeHandle(ref, () => ({
        onOpen,
    }));

    const onClose = () => {
        setVisible(false);
        setLoading(false);
        setIdProductCategory(null);
        setStatusProductCategory(null);
    };

    const submitProductCategoryChangeStatus = () => {
        setLoading(true);
        const body = {
            id: idProductCategory,
            status:
                statusProductCategory === GLOBAL_STATUS.ACTIVE
                    ? GLOBAL_STATUS.INACTIVE
                    : GLOBAL_STATUS.ACTIVE,
        };
        return productCategoryApis
            .updateStatusCategory(body)
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
                <h3>{t("category_status_change")}</h3>
                <label className="d-flex justify-content-center mb-3">
                    {statusProductCategory === GLOBAL_STATUS.ACTIVE && (
                        <p>
                            {t("category_status_new")}: {t("off")}
                        </p>
                    )}
                    {statusProductCategory === GLOBAL_STATUS.INACTIVE && (
                        <p>
                            {t("category_status_new")}: {t("on")}
                        </p>
                    )}
                </label>
                <div className="d-flex justify-content-center">
                    <Space>
                        <Button
                            className="m-1"
                            htmlType="submit"
                            type="primary"
                            loading={loading}
                            onClick={() => submitProductCategoryChangeStatus()}
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

export default forwardRef(ModalProductCategoryChangeStatus);
