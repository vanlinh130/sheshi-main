import errorHelper from '@/utils/error-helper';
import successHelper from '@/utils/success-helper';
import { Button, Modal, Space } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GLOBAL_STATUS } from "@/constants";
import newsApis from '@/apis/newsApis';

const ModalNewsChangeStatus = ({ onAfterChangeStatus }, ref) => {
    const { t } = useTranslation()
    const [visible, setVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [idNews, setIdNews] = useState(null)
    const [statusNews, setStatusNews] = useState(null)

    const onOpen = (id, item) => {
        setVisible(true)
        setStatusNews(item.status)
        setIdNews(id)
    }

    useImperativeHandle(ref, () => ({
        onOpen
    }))

    const onClose = () => {
        setVisible(false)
        setLoading(false)
        setIdNews(null)
        setStatusNews(null)
    }

    const submitNewsChangeStatus = () => {
        setLoading(true)
        const body = {
            id: idNews,
            status:
                statusNews === GLOBAL_STATUS.ACTIVE
                    ? GLOBAL_STATUS.INACTIVE
                    : GLOBAL_STATUS.ACTIVE,
        };
        return newsApis
          .updateNews(body)
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
                    Cập nhật trạng thái mới cho tin tức
                </h3>
                <label className='d-flex justify-content-center mb-3'>
                    {statusNews === GLOBAL_STATUS.ACTIVE && <p>{t('category_status_new')}: {t('off')}</p>}
                    {statusNews === GLOBAL_STATUS.INACTIVE && <p>{t('category_status_new')}: {t('on')}</p>}
                </label>
                <div className='d-flex justify-content-center'>
                    <Space>
                        <Button className="m-1" htmlType="submit" type="primary" loading={loading} onClick={() => submitNewsChangeStatus()}>
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

export default forwardRef(ModalNewsChangeStatus)
