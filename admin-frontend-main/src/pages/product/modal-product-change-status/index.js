import errorHelper from '@/utils/error-helper';
import successHelper from '@/utils/success-helper';
import { Button, Modal, Space } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GLOBAL_STATUS } from "@/constants";
import productApis from '@/apis/productApis';

const ModalProductChangeStatus = ({ onAfterChangeStatus }, ref) => {
    const { t } = useTranslation()
    const [visible, setVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [idProduct, setIdProduct] = useState(null)
    const [statusProduct, setStatusProduct] = useState(null)

    const onOpen = (id, item) => {
        setVisible(true)
        setStatusProduct(item.status)
        setIdProduct(id)
    }

    useImperativeHandle(ref, () => ({
        onOpen
    }))

    const onClose = () => {
        setVisible(false)
        setLoading(false)
        setIdProduct(null)
        setStatusProduct(null)
    }

    const submitProductChangeStatus = () => {
        setLoading(true)
        const body = {
            id: idProduct,
            status:
                statusProduct === GLOBAL_STATUS.ACTIVE
                    ? GLOBAL_STATUS.INACTIVE
                    : GLOBAL_STATUS.ACTIVE,
        };
        return productApis
            .changeStatusProduct(body)
            .then(() => {
                successHelper(t("update_success"));
                onClose();
                onAfterChangeStatus();
            })
            .catch((err) => {
                errorHelper(err);
            })
            .finally(() => setLoading(false));
    }

    return (
        <>
            <Modal
                footer={null}
                visible={visible}
                onCancel={onClose}
                maskClosable={false}
                destroyOnClose
            >
                <h3>
                    {t('product_change')}
                </h3>
                <label className='d-flex justify-content-center mb-3'>
                    {statusProduct === GLOBAL_STATUS.ACTIVE && <p>{t('category_status_new')}: {t('off')}</p>}
                    {statusProduct === GLOBAL_STATUS.INACTIVE && <p>{t('category_status_new')}: {t('on')}</p>}
                </label>
                <div className='d-flex justify-content-center'>
                    <Space>
                        <Button className="m-1" htmlType="submit" type="primary" loading={loading} onClick={() => submitProductChangeStatus()}>
                            {t('confirm')}
                        </Button>
                        <Button className="m-1" htmlType="submit" loading={loading} onClick={() => onClose()}>
                            {t('close')}
                        </Button>
                    </Space>
                </div>
            </Modal>
        </>
    );
};

export default forwardRef(ModalProductChangeStatus)
