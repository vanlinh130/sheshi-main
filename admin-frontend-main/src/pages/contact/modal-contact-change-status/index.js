import errorHelper from '@/utils/error-helper';
import successHelper from '@/utils/success-helper';
import { Button, Modal, Space } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GLOBAL_STATUS } from '@/constants';
import contactApis from '@/apis/contactApis';

const ModalContactChangeStatus = ({ onSubmit, onAfterChangeStatus }, ref) => {
    const { t } = useTranslation();
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [idContact, setIdContact] = useState(null);
    const [statusContact, setStatusContact] = useState(null);

    const onOpen = (id, item) => {
        setVisible(true);
        setStatusContact(item.status);
        setIdContact(id);
    };

    useImperativeHandle(ref, () => ({
        onOpen,
    }));

    const onClose = () => {
        setVisible(false);
        setLoading(false);
        setIdContact(null);
        setStatusContact(null);
    };

    const submitContactChangeStatus = () => {
        setLoading(true);
        const body = {
            id: idContact,
            status: statusContact === GLOBAL_STATUS.ACTIVE ? GLOBAL_STATUS.INACTIVE : GLOBAL_STATUS.ACTIVE,
        };
        return contactApis
            .updateStatusContact(body)
            .then(() => {
                successHelper(t('update_success'));
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
            <Modal footer={null} visible={visible} onCancel={onClose} maskClosable={false} destroyOnClose>
                <h3>{t('contact_status_change')}</h3>
                <label className="d-flex justify-content-center mb-3">
                    {statusContact === GLOBAL_STATUS.ACTIVE && (
                        <p>
                            {t('contact_status_new')}: {t('off')}
                        </p>
                    )}
                    {statusContact === GLOBAL_STATUS.INACTIVE && (
                        <p>
                            {t('contact_status_new')}: {t('on')}
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
                            onClick={() => submitContactChangeStatus()}
                        >
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

export default forwardRef(ModalContactChangeStatus);
