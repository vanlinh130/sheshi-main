import errorHelper from '@/utils/error-helper';
import successHelper from '@/utils/success-helper';
import yup from '@/utils/yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Modal, Input, Select, Tooltip, Spin, Image } from 'antd';
import React, { forwardRef, useImperativeHandle, useState, useRef } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MASTER_DATA } from '@/constants';

const schema = yup.object({
    name: yup.string().trim().required().max(255),
    nameMaster: yup.string().trim().required().max(255).nullable(),
});

const ModalConfigDataCreate = ({ onSubmit, onAfterCreate }, ref) => {
    const { t } = useTranslation();

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm({
        resolver: yupResolver(schema),
    });

    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorConfigData, setErrorConfigData] = useState('');
    const onOpen = () => {
        setVisible(true);
    };

    useImperativeHandle(ref, () => ({
        onOpen,
    }));

    const onClose = () => {
        setVisible(false);
        reset({
            name: '',
            nameMaster: null,
            note: '',
        });
        setLoading(false);
        setErrorConfigData('');
    };

    const submitConfigDataCreate = (values) => {
        const { name, nameMaster, note } = values;

        const payload = {
            name: name,
            nameMaster: MASTER_DATA.find((e) => e.value === +nameMaster)?.nameMaster,
            note: note,
        };

        setLoading(true);

        return onSubmit(payload)
            .then(() => {
                successHelper(t('create_success'));
                onClose();
                onAfterCreate();
            })
            .catch((err) => {
                errorHelper(err);
            })
            .finally(() => setLoading(false));
    };

    return (
        <Modal footer={null} visible={visible} onCancel={onClose} maskClosable={false} destroyOnClose>
            <h3>{t('config_data_add')}</h3>
            <form onSubmit={handleSubmit(submitConfigDataCreate)}>
                <div className="field mb-3">
                    <label>{t('code')}</label>

                    <Controller
                        name="nameMaster"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                showSearch
                                status={errors?.nameMaster?.message}
                                control={control}
                                name="nameMaster"
                                placeholder={t('select_a_config_data')}
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {MASTER_DATA.map((e) => {
                                    return (
                                        <Option value={e.value} key={e.value}>
                                            {e.nameMaster}
                                        </Option>
                                    );
                                })}
                            </Select>
                        )}
                    />
                    {errors?.nameMaster?.message && <p className="text-error">{errors?.nameMaster?.message}</p>}
                </div>

                <div className="field mb-3">
                    <label>{t('name')}</label>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} status={errors?.name?.message ? 'error' : null} placeholder={t('name')} />
                        )}
                    />
                    {errors?.name?.message && <p className="text-error">{errors?.name?.message}</p>}
                </div>

                <div className="field mb-3">
                    <label>{t('note')}</label>
                    <Controller
                        name="note"
                        control={control}
                        render={({ field }) => (
                            <Input.TextArea
                                {...field}
                                status={errors?.note?.message ? 'error' : null}
                                placeholder={t('note')}
                            />
                        )}
                    />
                    {errors?.note?.message && <p className="text-error">{errors?.note?.message}</p>}
                </div>

                <div className="d-flex justify-content-center">
                    <Button htmlType="submit" type="primary" loading={loading}>
                        {t('create')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default forwardRef(ModalConfigDataCreate);
