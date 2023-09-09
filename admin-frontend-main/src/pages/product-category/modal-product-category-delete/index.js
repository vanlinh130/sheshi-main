import errorHelper from '@/utils/error-helper';
import successHelper from '@/utils/success-helper';
import { Button, Modal, Space } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';


const ModalProductCategoryDelete = ({ onSubmit, onAfterDelete }, ref) => {
    const { t } = useTranslation()


    const [visible, setVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [dataProductCategory, setDataProductCategory] = useState({
        id: null,
    })

    const onOpen = (id) => {
        setVisible(true)
        setDataProductCategory({ id })
    }

    useImperativeHandle(ref, () => ({
        onOpen
    }))

    const onClose = () => {
        setVisible(false)
        setLoading(false),
            setDataProductCategory(null)
    }

    const submitProductCategoryDelete = () => {

        setLoading(true)

        return onSubmit(dataProductCategory.id)
            .then(() => {
                successHelper(t('delete_success'))
                onClose()
                onAfterDelete()
            })
            .catch(err => errorHelper(err))
            .finally(() => setLoading(false))
    }

    return (
        <Modal
            footer={null}
            visible={visible}
            onCancel={onClose}
            maskClosable={false}
            destroyOnClose
        >
            <h3 className="mb-3">
                {t('product_category_delete_confirm')}
            </h3>
            <div className='d-flex justify-content-center'>
                <Space>
                    <Button className="m-1" htmlType="submit" type="primary" danger loading={loading} onClick={() => submitProductCategoryDelete()}>
                        {t('approve')}
                    </Button>
                    <Button className="m-1" htmlType="submit" loading={loading} onClick={() => onClose()}>
                        {t('close')}
                    </Button>
                </Space>
            </div>
        </Modal>
    );
};

export default forwardRef(ModalProductCategoryDelete)
