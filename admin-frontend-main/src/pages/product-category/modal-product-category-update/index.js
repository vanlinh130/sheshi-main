import errorHelper from '@/utils/error-helper';
import successHelper from '@/utils/success-helper';
import yup from '@/utils/yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Modal, Input, Tooltip, Spin, Image } from 'antd';
import React, { forwardRef, useImperativeHandle, useState, useRef } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import productCategoryApis from '@/apis/productCategoryApis';
import { CameraOutlined, LoadingOutlined } from '@ant-design/icons';
import commonApis from '@/apis/commonApis';
import { convertToSlug } from '@/utils/funcs';
import Compressor from 'compressorjs';

const schema = yup.object({
    name: yup.string().trim().required().max(255),
    categorySlug: yup.string().trim().required().max(255),
});

const ModalProductCategoryUpdate = ({ onSubmit, onAfterUpdate }, ref) => {
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
    const [idDataProductCategory, setIdDataProductCategory] = useState(null);
    const [errorProductCategory, setErrorProductCategory] = useState('');

    const handleSetSlug = (value) => {
        setValue('name', value, {
            shouldValidate: true,
            shouldDirty: true,
        });
        setValue('categorySlug', convertToSlug(value), {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

    const onOpen = (id) => {
        setVisible(true);
        setLoading(true);
        setIdDataProductCategory(id);
        productCategoryApis
            .getDetailCategory(id)
            .then((res) => {
                const { name, categorySlug, description, image } = res;
                setValue('name', name?.trim(), {
                    shouldValidate: true,
                    shouldDirty: true,
                });
                setValue('categorySlug', categorySlug?.trim(), {
                    shouldValidate: true,
                    shouldDirty: true,
                });
                setValue('description', description?.trim(), {
                    shouldValidate: true,
                    shouldDirty: true,
                });
                setValue('thumbnail', image?.trim(), {
                    shouldValidate: true,
                    shouldDirty: true,
                });
            })
            .catch((err) => {
                errorHelper(err.message);
            })
            .finally(() => setLoading(false));
    };

    const { thumbnail } = useWatch({ control });
    const refThumbnail = useRef();
    const [isUpdateThumbnail, setIsUpdateThumbnail] = useState(false);

    useImperativeHandle(ref, () => ({
        onOpen,
    }));

    const onClose = () => {
        setVisible(false);
        setLoading(false);
        reset();
        setIdDataProductCategory(null);
        setErrorProductCategory('');
    };

    const submitUpdateProductCategory = (values) => {
        const { name, categorySlug, description, thumbnail } = values;
        const payload = {
            id: idDataProductCategory,
            name: name.trim(),
            categorySlug: categorySlug?.trim(),
            description: description?.trim(),
            image: thumbnail,
        };

        return productCategoryApis
            .updateCategory(payload)
            .then(() => {
                successHelper(t('update_success'));
                onClose();
                onAfterUpdate();
            })
            .catch((err) => {
                errorHelper(err);
            })
            .finally(() => setLoading(false));
    };

    const onchangeThumbnail = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            new Compressor(files[0], {
                quality: 0.8,
                success: (compressedImg) => {
                    // compressedResult has the compressed file.
                    // Use the compressed file to upload the images to your server.
                    onUploadThumbnail(compressedImg)
                        .then((response) => {
                            setValue('thumbnail', response, {
                                shouldValidate: true,
                                shouldDirty: true,
                            });
                        })
                        .finally(() => {
                            setIsUpdateThumbnail(false);
                        });
                },
            });
        }
        e.target.value = null;
    };

    const onUploadThumbnail = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name);
        try {
            const res = await commonApis.preUploadFile(formData);
            return res;
        } catch (ex) {
            console.log(ex);
        }
    };

    return (
        <Modal footer={null} visible={visible} onCancel={onClose} maskClosable={false} destroyOnClose>
            <h3>{t('category_update')}</h3>
            <form onSubmit={handleSubmit(submitUpdateProductCategory)}>
                <div className="field mb-3">
                    <label>{t('name')}</label>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                onChange={(event) => handleSetSlug(event.target.value)}
                                status={errors?.name?.message ? 'error' : null}
                                placeholder={t('name')}
                            />
                        )}
                    />
                    {errors?.name?.message && <p className="text-error">{errors?.name?.message}</p>}
                </div>
                <div className="field mb-3">
                    <label>{t('slug')}</label>
                    <Controller
                        name="categorySlug"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                status={errors?.categorySlug?.message || errorProductCategory ? 'error' : null}
                                placeholder={t('slug')}
                                disabled
                            />
                        )}
                    />
                    {errors?.categorySlug?.message && <p className="text-error">{errors?.categorySlug?.message}</p>}
                    {errorProductCategory && <p className="text-error">{errorProductCategory}</p>}
                </div>
                <div className="field mb-3">
                    <label>{t('description')}</label>
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                status={errors?.description?.message ? 'error' : null}
                                placeholder={t('description')}
                            />
                        )}
                    />
                    {errors?.description?.message && <p className="text-error">{errors?.description?.message}</p>}
                </div>

                <div className="field mb-3">
                    <label>{t('thumbnail')}</label>
                    <div className="thumbnail-upload">
                        <Image
                            className="img-thumbnail"
                            src={
                                thumbnail ||
                                'data:image/png;base64,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'
                            }
                            alt=""
                        />
                        <Tooltip placement="left" title={t('thumbnail_action_note')}>
                            <button
                                type={'button'}
                                disabled={isUpdateThumbnail}
                                onClick={() => refThumbnail.current.click()}
                                className="button-camera"
                            >
                                {isUpdateThumbnail ? (
                                    <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                                ) : (
                                    <CameraOutlined />
                                )}
                                <input
                                    ref={refThumbnail}
                                    type="file"
                                    accept="image/*"
                                    onChange={onchangeThumbnail}
                                    style={{ display: 'none' }}
                                />
                            </button>
                        </Tooltip>
                    </div>
                    {errors?.thumbnail?.message && <p className="text-error">{errors?.thumbnail?.message}</p>}
                </div>

                <div className="d-flex justify-content-center">
                    <Button htmlType="submit" type="primary" loading={loading}>
                        {t('update')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default forwardRef(ModalProductCategoryUpdate);
