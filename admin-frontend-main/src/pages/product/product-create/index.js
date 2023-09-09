import errorHelper from '@/utils/error-helper';
import successHelper from '@/utils/success-helper';
import { Select } from 'antd';
import yup from '@/utils/yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    Button,
    Tabs,
    Divider,
    Tooltip,
    Input,
    Radio,
    Space,
    Spin,
    Typography,
    Image,
    Card,
    Col,
    Row,
    PageHeader,
    Upload,
    Modal,
} from 'antd';
import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import {
    PlusOutlined,
    ArrowLeftOutlined,
    CameraOutlined,
    LoadingOutlined,
    ReloadOutlined,
    CheckOutlined,
} from '@ant-design/icons';
import { useNavigate, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { convertToSlug } from '@/utils/funcs';
import commonApis from '@/apis/commonApis';
import { Editor } from '@tinymce/tinymce-react';
import productCategoryApis from '@/apis/productCategoryApis';
import productApis from '@/apis/productApis';
import ProductTableRows from '@/components/product-table-rows';
import Compressor from 'compressorjs';
import configDataApis from '@/apis/configDataApis';
import { MASTER_DATA, MASTER_DATA_NAME } from '@/constants';
let index = 0;

const REMOVED = 'removed';
const ProductCreate = () => {
    const { t } = useTranslation();
    const { TabPane } = Tabs;
    const schema = yup.object({
        name: yup.string().max(100).required(),
        acronym: yup.string().max(15).nullable(),
        nameVi: yup.string().max(255).nullable(),
        expiry: yup.string().max(30).nullable(),
        slug: yup.string().max(100).required(),
        thumbnail: yup.string().max(255).required(),
        categoryId: yup.number().required(),
        description: yup.string().required().trim(),
        outstanding: yup.number().max(2).required(),
    });

    const {
        control,
        reset,
        handleSubmit,
        formState: { errors },
        setValue,
        getValues,
    } = useForm({
        resolver: yupResolver(schema),
    });

    const [loading, setLoading] = useState(false);
    const [slug, setSlug] = useState('');
    const { thumbnail } = useWatch({ control });
    const refThumbnail = useRef();
    const [isUpdateThumbnail, setIsUpdateThumbnail] = useState(false);
    const [errorProductDetail, setErrorProductDetail] = useState();
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const { Option } = Select;
    const [listCategory, setListCategory] = useState([]);
    const [listOrigin, setListOrigin] = useState([]);
    const [fileList, setFileList] = useState([]);
    const navigate = useNavigate();
    const [compressedFile, setCompressedFile] = useState(null);

    const getListCategory = async () => {
        const categoryId = await productCategoryApis.getAllCategory();
        setListCategory(categoryId);
    };
    const getListOrigin = async () => {
        const originList = await configDataApis.getAllConfigData({
            idMaster: [MASTER_DATA_NAME.ORIGIN],
        });
        setListOrigin(originList);
    };

    useEffect(() => {
        setValue('outstanding', 0);
        getListCategory();
        getListOrigin();
    }, []);

    const handleSetSlug = (value) => {
        setValue('name', value, {
            shouldValidate: true,
            shouldDirty: true,
        });
        setValue('slug', convertToSlug(value), {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

    const onChangeCategory = (value) => {
        setValue('categoryId', value, {
            shouldValidate: true,
            shouldDirty: true,
        });
    };
    const onChangeOrigin = (value) => {
        setValue('originId', value);
    };

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const handleCancel = () => setPreviewVisible(false);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    );

    const onChange_Radio = (e) => {
        setValue(e.target.value);
    };

    const submitCreate = (values) => {
        const {
            name,
            description,
            slug,
            thumbnail,
            outstanding,
            categoryId,
            uses,
            element,
            guide,
            expiry,
            nameVi,
            acronym,
            originId,
        } = values;

        let failCreate;
        // Check validate
        if (rowsData.length === 0) {
            setErrorProductDetail('Cần nhập tối thiểu 1 sản phẩm phụ');
            return;
        }
        rowsData.map((row) => {
            if (row.capacityId === '' || row.unitId === '' || row.price === '' || row.quantity === '') {
                setErrorProductDetail('Có 1 trường nào đó chưa được nhập');
                failCreate = true;
                return;
            }
            const checkExists = rowsData.filter((e) => e.unitId === row.unitId && e.capacityId === row.capacityId);
            if (checkExists.length > 1) {
                setErrorProductDetail('Đã trùng sản phẩm có cùng dung tích và khối lượng trước đó');
                failCreate = true;
            }
        });

        if (failCreate) {
            return;
        }

        const productDetail = rowsData.filter(
            (row) => row.capacityId !== '' && row.unitId !== '' && row.price !== '' && row.quantity !== '',
        );

        const payload = {
            name: name,
            description: description,
            productSlug: slug,
            subImage: fileList,
            mainImage: thumbnail,
            outstanding: outstanding,
            element: element,
            guide: guide,
            uses: uses,
            expiry: expiry,
            nameVi: nameVi,
            acronym: acronym,
            categoryId: categoryId,
            productDetail,
            originId,
        };
        return productApis
            .createProduct(payload)
            .then(() => {
                successHelper(t('create_success'));
                navigate('/product');
            })
            .catch((err) => {
                console.log(err);
                errorHelper(err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleChange = ({ file: newFile }) => {
        if (newFile.status === REMOVED) {
            setFileList(fileList.filter((file) => file.uid !== newFile.uid));
            return;
        }
        new Compressor(newFile.originFileObj, {
            quality: 0.6, // 0.6 can also be used, but its not recommended to go below.
            success: (compressedResult) => {
                // compressedResult has the compressed file.
                // Use the compressed file to upload the images to your server.
                setCompressedFile(compressedResult);
            },
        });
    };

    const changeListImage = async (file) => {
        if (!compressedFile) return null;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name);
        return commonApis
            .preUploadFile(formData)
            .then(async (response) => {
                await commonApis.uploadFile({
                    urlUpload,
                    file: file,
                });

                setFileList([...fileList, { url: response }]);
            })
            .catch((err) => {
                errorHelper(err);
            });
    };

    useEffect(() => {
        changeListImage(compressedFile);
    }, [compressedFile]);

    const onUploadImageContent = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name);
        return commonApis
            .preUploadFile(formData)
            .then(async (response) => {
                return response;
            })
            .catch((err) => {
                errorHelper(err);
            });
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
        setIsUpdateThumbnail(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name);
        return commonApis
            .preUploadFile(formData)
            .then(async (response) => {
                return response;
            })
            .catch((err) => {
                errorHelper(err);
            });
    };

    const goBackListProduct = () => {
        navigate(`/product`);
    };

    const [categoryItems, setCategoryItems] = useState(['', '']);
    const [categoryName, setCategoryName] = useState('');
    const [originName, setOriginName] = useState('');

    const onCategoryNameChange = (event) => {
        setCategoryName(event.target.value);
    };

    const onOriginNameChange = (event) => {
        setOriginName(event.target.value);
    };

    const addCategoryItem = async (e) => {
        e.preventDefault();
        setCategoryItems([...categoryItems, categoryName || `New item ${index++}`]);
        const payload = {
            name: categoryName.trim(),
            categorySlug: convertToSlug(categoryName.trim()),
        };
        await productCategoryApis.createProductCategory(payload);
        getListCategory();
        setCategoryName('');
    };
    const addOriginItem = async (e) => {
        e.preventDefault();
        const payload = {
            name: originName.trim(),
            nameMaster: MASTER_DATA.find((e) => e.value === MASTER_DATA_NAME.ORIGIN)?.nameMaster,
        };
        await configDataApis.createConfigData(payload);
        getListOrigin();
        setOriginName('');
    };

    const [rowsData, setRowsData] = useState([]);

    const addTableRows = () => {
        const rowsInput = {
            price: '',
            quantity: '',
            unitId: '',
            capacityId: '',
        };
        setErrorProductDetail();
        setRowsData([...rowsData, rowsInput]);
    };

    const deleteTableRows = (index) => {
        const rows = [...rowsData];
        rows.splice(index, 1);
        setRowsData(rows);
        setErrorProductDetail();
    };

    const handleChangeTableRows = (index, evnt) => {
        const { name, value } = evnt.target;
        const rowsInput = [...rowsData];
        rowsInput[index][name] = value;
        setRowsData(rowsInput);
        setErrorProductDetail();
    };

    const handleChangeTableRowsCombobox = (index, name, value) => {
        const rowsInput = [...rowsData];
        rowsInput[index][name] = value;
        setRowsData(rowsInput);
        setErrorProductDetail();
    };

    return (
        <>
            <form onSubmit={handleSubmit(submitCreate)}>
                <PageHeader
                    onBack={() => goBackListProduct()}
                    className="site-page-header-responsive"
                    title={t('product_add')}
                    extra={[
                        <Button icon={<CheckOutlined />} key="1" htmlType="submit" type="primary" loading={loading}>
                            {t('submit')}
                        </Button>,
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={() => {
                                reset();
                            }}
                            htmlType="reset"
                            key="2"
                        >
                            {t('reset')}
                        </Button>,
                    ]}
                >
                    <Row gutter={[24, 12]} align="top">
                        <Col xs={24} sm={24} md={17} xl={17}>
                            <Card bordered={false} className="mb-3">
                                <div className="field mb-3">
                                    <label>{t('product_name')}</label>
                                    <Controller
                                        name="name"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                onChange={(event) => handleSetSlug(event.target.value)}
                                                status={errors?.name?.message}
                                                placeholder={t('product_name')}
                                            />
                                        )}
                                    />
                                    {errors?.name?.message && <p className="text-error">{errors?.name?.message}</p>}
                                </div>

                                <div id="edit-slug" className="field mb-3">
                                    <label>{t('slug')}</label>
                                    <Controller
                                        name="slug"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                status={errors?.slug?.message}
                                                placeholder={t('slug')}
                                                disabled
                                            />
                                        )}
                                    />
                                    {errors?.slug?.message && <p className="text-error">{errors?.slug?.message}</p>}
                                </div>

                                <div className="field mb-3">
                                    <Tabs defaultActiveKey="1">
                                        <TabPane tab="Mô tả sản phẩm" key="1">
                                            <Controller
                                                name="description"
                                                control={control}
                                                render={({ field }) => (
                                                    <Editor
                                                        tinymceScriptSrc={'/tinymce/tinymce.min.js'}
                                                        onEditorChange={(newText) => field.onChange(newText)}
                                                        init={{
                                                            onchange_callback: 'myCustomOnChangeHandler',
                                                            menubar: false,
                                                            plugins: [
                                                                'preview',
                                                                'importcss',
                                                                'searchreplace',
                                                                'autolink',
                                                                'autosave',
                                                                'save',
                                                                'directionality',
                                                                'code',
                                                                'visualblocks',
                                                                'visualchars',
                                                                'fullscreen',
                                                                'image',
                                                                'link',
                                                                'media',
                                                                'template',
                                                                'codesample',
                                                                'table',
                                                                'charmap',
                                                                'pagebreak',
                                                                'anchor',
                                                                'insertdatetime',
                                                                'advlist',
                                                                'lists',
                                                                'wordcount',
                                                                'help',
                                                                'charmap',
                                                                'nonbreaking',
                                                            ],
                                                            toolbar:
                                                                'code | undo redo | bold italic underline strikethrough | forecolor backcolor removeformat | alignleft aligncenter alignright alignjustify | fontsize blocks | insertfile image media template link anchor codesample | outdent indent |  numlist bullist | pagebreak | charmap | fullscreen  preview save print | ltr rtl',
                                                            image_caption: true,
                                                            image_title: true,
                                                            automatic_uploads: true,
                                                            file_picker_types: 'image',
                                                            file_picker_callback: (cb) => {
                                                                const input = document.createElement('input');
                                                                input.setAttribute('type', 'file');
                                                                input.setAttribute('accept', 'image/*');
                                                                input.addEventListener('change', (e) => {
                                                                    const file = e.target.files[0];

                                                                    const reader = new FileReader();
                                                                    reader.addEventListener('load', async () => {
                                                                        const id = 'blobid' + new Date().getTime();
                                                                        const blobCache =
                                                                            tinymce.activeEditor.editorUpload.blobCache;
                                                                        const base64 = await onUploadImageContent(file);
                                                                        const blobInfo = blobCache.create(
                                                                            id,
                                                                            file,
                                                                            base64,
                                                                        );
                                                                        blobCache.add(blobInfo);
                                                                        cb(blobInfo.base64(), { title: file.name });
                                                                    });
                                                                    reader.readAsDataURL(file);
                                                                });

                                                                input.click();
                                                            },
                                                        }}
                                                    />
                                                )}
                                            />
                                        </TabPane>
                                        <TabPane tab="Thành phần" key="2">
                                            <div className="field mb-3">
                                                <Controller
                                                    name="element"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Editor
                                                            tinymceScriptSrc={'/tinymce/tinymce.min.js'}
                                                            onEditorChange={(newTextElement) =>
                                                                field.onChange(newTextElement)
                                                            }
                                                            init={{
                                                                onchange_callback: 'myCustomOnChangeHandler',
                                                                menubar: false,
                                                                plugins: [
                                                                    'preview',
                                                                    'importcss',
                                                                    'searchreplace',
                                                                    'autolink',
                                                                    'autosave',
                                                                    'save',
                                                                    'directionality',
                                                                    'code',
                                                                    'visualblocks',
                                                                    'visualchars',
                                                                    'fullscreen',
                                                                    'image',
                                                                    'link',
                                                                    'media',
                                                                    'template',
                                                                    'codesample',
                                                                    'table',
                                                                    'charmap',
                                                                    'pagebreak',
                                                                    'anchor',
                                                                    'insertdatetime',
                                                                    'advlist',
                                                                    'lists',
                                                                    'wordcount',
                                                                    'help',
                                                                    'charmap',
                                                                    'nonbreaking',
                                                                ],
                                                                toolbar:
                                                                    'code | undo redo | bold italic underline strikethrough | forecolor backcolor removeformat | alignleft aligncenter alignright alignjustify | fontsize blocks | insertfile image media template link anchor codesample | outdent indent |  numlist bullist | pagebreak | charmap | fullscreen  preview save print | ltr rtl',
                                                                image_caption: true,
                                                                image_title: true,
                                                                automatic_uploads: true,
                                                                file_picker_types: 'image',
                                                                file_picker_callback: (cb) => {
                                                                    const input = document.createElement('input');
                                                                    input.setAttribute('type', 'file');
                                                                    input.setAttribute('accept', 'image/*');
                                                                    input.addEventListener('change', (e) => {
                                                                        const file = e.target.files[0];

                                                                        const reader = new FileReader();
                                                                        reader.addEventListener('load', async () => {
                                                                            const id = 'blobid' + new Date().getTime();
                                                                            const blobCache =
                                                                                tinymce.activeEditor.editorUpload
                                                                                    .blobCache;
                                                                            const base64 = await onUploadImageContent(
                                                                                file,
                                                                            );
                                                                            const blobInfo = blobCache.create(
                                                                                id,
                                                                                file,
                                                                                base64,
                                                                            );
                                                                            blobCache.add(blobInfo);
                                                                            cb(blobInfo.base64(), {
                                                                                title: file.name,
                                                                            });
                                                                        });
                                                                        reader.readAsDataURL(file);
                                                                    });

                                                                    input.click();
                                                                },
                                                            }}
                                                        />
                                                    )}
                                                />
                                                {errors?.element?.message && (
                                                    <p className="text-error">{errors?.element?.message}</p>
                                                )}
                                            </div>
                                        </TabPane>
                                        <TabPane tab="Công dụng" key="3">
                                            <div className="field mb-3">
                                                <Controller
                                                    name="uses"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Editor
                                                            tinymceScriptSrc={'/tinymce/tinymce.min.js'}
                                                            onEditorChange={(newTextUses) =>
                                                                field.onChange(newTextUses)
                                                            }
                                                            init={{
                                                                onchange_callback: 'myCustomOnChangeHandler',
                                                                menubar: false,
                                                                plugins: [
                                                                    'preview',
                                                                    'importcss',
                                                                    'searchreplace',
                                                                    'autolink',
                                                                    'autosave',
                                                                    'save',
                                                                    'directionality',
                                                                    'code',
                                                                    'visualblocks',
                                                                    'visualchars',
                                                                    'fullscreen',
                                                                    'image',
                                                                    'link',
                                                                    'media',
                                                                    'template',
                                                                    'codesample',
                                                                    'table',
                                                                    'charmap',
                                                                    'pagebreak',
                                                                    'anchor',
                                                                    'insertdatetime',
                                                                    'advlist',
                                                                    'lists',
                                                                    'wordcount',
                                                                    'help',
                                                                    'charmap',
                                                                    'nonbreaking',
                                                                ],
                                                                toolbar:
                                                                    'code | undo redo | bold italic underline strikethrough | forecolor backcolor removeformat | alignleft aligncenter alignright alignjustify | fontsize blocks | insertfile image media template link anchor codesample | outdent indent |  numlist bullist | pagebreak | charmap | fullscreen  preview save print | ltr rtl',
                                                                image_caption: true,
                                                                image_title: true,
                                                                automatic_uploads: true,
                                                                file_picker_types: 'image',
                                                                file_picker_callback: (cb) => {
                                                                    const input = document.createElement('input');
                                                                    input.setAttribute('type', 'file');
                                                                    input.setAttribute('accept', 'image/*');
                                                                    input.addEventListener('change', (e) => {
                                                                        const file = e.target.files[0];

                                                                        const reader = new FileReader();
                                                                        reader.addEventListener('load', async () => {
                                                                            const id = 'blobid' + new Date().getTime();
                                                                            const blobCache =
                                                                                tinymce.activeEditor.editorUpload
                                                                                    .blobCache;
                                                                            const base64 = await onUploadImageContent(
                                                                                file,
                                                                            );
                                                                            const blobInfo = blobCache.create(
                                                                                id,
                                                                                file,
                                                                                base64,
                                                                            );
                                                                            blobCache.add(blobInfo);
                                                                            cb(blobInfo.base64(), {
                                                                                title: file.name,
                                                                            });
                                                                        });
                                                                        reader.readAsDataURL(file);
                                                                    });

                                                                    input.click();
                                                                },
                                                            }}
                                                        />
                                                    )}
                                                />
                                                {errors?.uses?.message && (
                                                    <p className="text-error">{errors?.uses?.message}</p>
                                                )}
                                            </div>
                                        </TabPane>
                                        <TabPane tab="Hướng dẫn sử dụng" key="4">
                                            <div className="field mb-3">
                                                <Controller
                                                    name="guide"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Editor
                                                            tinymceScriptSrc={'/tinymce/tinymce.min.js'}
                                                            onEditorChange={(newTextGuide) =>
                                                                field.onChange(newTextGuide)
                                                            }
                                                            init={{
                                                                onchange_callback: 'myCustomOnChangeHandler',
                                                                menubar: false,
                                                                plugins: [
                                                                    'preview',
                                                                    'importcss',
                                                                    'searchreplace',
                                                                    'autolink',
                                                                    'autosave',
                                                                    'save',
                                                                    'directionality',
                                                                    'code',
                                                                    'visualblocks',
                                                                    'visualchars',
                                                                    'fullscreen',
                                                                    'image',
                                                                    'link',
                                                                    'media',
                                                                    'template',
                                                                    'codesample',
                                                                    'table',
                                                                    'charmap',
                                                                    'pagebreak',
                                                                    'anchor',
                                                                    'insertdatetime',
                                                                    'advlist',
                                                                    'lists',
                                                                    'wordcount',
                                                                    'help',
                                                                    'charmap',
                                                                    'nonbreaking',
                                                                ],
                                                                toolbar:
                                                                    'code | undo redo | bold italic underline strikethrough | forecolor backcolor removeformat | alignleft aligncenter alignright alignjustify | fontsize blocks | insertfile image media template link anchor codesample | outdent indent |  numlist bullist | pagebreak | charmap | fullscreen  preview save print | ltr rtl',
                                                                image_caption: true,
                                                                image_title: true,
                                                                automatic_uploads: true,
                                                                file_picker_types: 'image',
                                                                file_picker_callback: (cb) => {
                                                                    const input = document.createElement('input');
                                                                    input.setAttribute('type', 'file');
                                                                    input.setAttribute('accept', 'image/*');
                                                                    input.addEventListener('change', (e) => {
                                                                        const file = e.target.files[0];

                                                                        const reader = new FileReader();
                                                                        reader.addEventListener('load', async () => {
                                                                            const id = 'blobid' + new Date().getTime();
                                                                            const blobCache =
                                                                                tinymce.activeEditor.editorUpload
                                                                                    .blobCache;
                                                                            const base64 = await onUploadImageContent(
                                                                                file,
                                                                            );
                                                                            const blobInfo = blobCache.create(
                                                                                id,
                                                                                file,
                                                                                base64,
                                                                            );
                                                                            blobCache.add(blobInfo);
                                                                            cb(blobInfo.base64(), {
                                                                                title: file.name,
                                                                            });
                                                                        });
                                                                        reader.readAsDataURL(file);
                                                                    });

                                                                    input.click();
                                                                },
                                                            }}
                                                        />
                                                    )}
                                                />
                                                {errors?.guide?.message && (
                                                    <p className="text-error">{errors?.guide?.message}</p>
                                                )}
                                            </div>
                                        </TabPane>
                                    </Tabs>
                                    {errors?.description?.message && (
                                        <p className="text-error">{errors?.description?.message}</p>
                                    )}
                                </div>
                            </Card>

                            <Card
                                bordered={false}
                                className="mb-3"
                                title={
                                    <div className="d-flex">
                                        <p>Thêm sản phẩm phụ</p> <p style={{ color: 'red' }}>&nbsp;&nbsp;*</p>
                                    </div>
                                }
                            >
                                <table className="table-product-child">
                                    <thead>
                                        <tr>
                                            <th>Giá bán</th>
                                            <th>Số lượng</th>
                                            <th>Dung tích/ Trọng lượng</th>
                                            <th>
                                                <Button type="primary" onClick={addTableRows} icon={<PlusOutlined />}>
                                                    Thêm
                                                </Button>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <ProductTableRows
                                            rowsData={rowsData}
                                            deleteTableRows={deleteTableRows}
                                            handleChangeTableRows={handleChangeTableRows}
                                            handleChangeTableRowsCombobox={handleChangeTableRowsCombobox}
                                        />
                                    </tbody>
                                </table>
                                {errorProductDetail && <p className="text-error">{errorProductDetail}</p>}
                            </Card>

                            <Card bordered={false} className="mb-3" title={t('product_image')}>
                                <Upload
                                    // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                    listType="picture-card"
                                    type="file"
                                    accept="image/*"
                                    fileList={fileList}
                                    onPreview={handlePreview}
                                    onChange={handleChange}
                                >
                                    {fileList.length >= 8 ? null : uploadButton}
                                </Upload>
                                <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
                                    <img
                                        alt="example"
                                        style={{
                                            width: '100%',
                                        }}
                                        src={previewImage}
                                    />
                                </Modal>
                            </Card>
                        </Col>
                        <Col xs={24} sm={24} md={7} xl={7}>
                            <Card className="mb-3" title={t('product_category')} bordered={false}>
                                <Controller
                                    name="categoryId"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            showSearch
                                            status={errors?.categoryId?.message}
                                            control={control}
                                            name="categoryId"
                                            placeholder={t('select_a_category')}
                                            optionFilterProp="children"
                                            onChange={onChangeCategory}
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().includes(input.toLowerCase())
                                            }
                                            dropdownRender={(menu) => (
                                                <>
                                                    {menu}
                                                    <Divider
                                                        style={{
                                                            margin: '8px 0',
                                                        }}
                                                    />
                                                    <Space
                                                        align="center"
                                                        style={{
                                                            padding: '0 8px 4px',
                                                        }}
                                                    >
                                                        <Input
                                                            maxLength={255}
                                                            placeholder={t('category_name')}
                                                            value={categoryName}
                                                            onChange={onCategoryNameChange}
                                                        />
                                                        <Typography.Link
                                                            onClick={addCategoryItem}
                                                            style={{
                                                                whiteSpace: 'nowrap',
                                                            }}
                                                        >
                                                            <Button type="primary" loading={loading}>
                                                                <PlusOutlined /> {t('create')}
                                                            </Button>
                                                        </Typography.Link>
                                                    </Space>
                                                </>
                                            )}
                                        >
                                            {listCategory.map((e) => {
                                                return (
                                                    <Option value={e.id} key={e.id}>
                                                        {e.name}
                                                    </Option>
                                                );
                                            })}
                                        </Select>
                                    )}
                                />
                                {errors?.categoryId?.message && (
                                    <p className="text-error">{errors?.categoryId?.message}</p>
                                )}
                            </Card>

                            <Card className="mb-3" title={t('shows')} bordered={false}>
                                <div className="field mb-3">
                                    <label>Mã sản phẩm</label>
                                    <Controller
                                        name="acronym"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                status={errors?.acronym?.message}
                                                placeholder="SSPRO001"
                                            />
                                        )}
                                    />
                                    {errors?.acronym?.message && (
                                        <p className="text-error">{errors?.acronym?.message}</p>
                                    )}
                                </div>
                                <div className="field mb-3">
                                    <label>Tên tiếng Việt</label>
                                    <Controller
                                        name="nameVi"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                status={errors?.nameVi?.message}
                                                placeholder="Tên tiếng Việt"
                                            />
                                        )}
                                    />
                                    {errors?.nameVi?.message && <p className="text-error">{errors?.nameVi?.message}</p>}
                                </div>
                                <div className="field mb-3">
                                    <label>Hạn sử dụng</label>
                                    <Controller
                                        name="expiry"
                                        control={control}
                                        render={({ field }) => (
                                            <Input {...field} status={errors?.expiry?.message} placeholder="36 tháng" />
                                        )}
                                    />
                                    {errors?.expiry?.message && <p className="text-error">{errors?.expiry?.message}</p>}
                                </div>
                                <div className="field mb-3">
                                    <label>Xuất xứ</label>
                                    <Controller
                                        name="originId"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                showSearch
                                                status={errors?.originId?.message}
                                                control={control}
                                                name="originId"
                                                placeholder={'Chọn nơi xuất xứ'}
                                                optionFilterProp="children"
                                                onChange={onChangeOrigin}
                                                filterOption={(input, option) =>
                                                    option.children.toLowerCase().includes(input.toLowerCase())
                                                }
                                                dropdownRender={(menu) => (
                                                    <>
                                                        {menu}
                                                        <Divider
                                                            style={{
                                                                margin: '8px 0',
                                                            }}
                                                        />
                                                        <Space
                                                            align="center"
                                                            style={{
                                                                padding: '0 8px 4px',
                                                            }}
                                                        >
                                                            <Input
                                                                maxLength={255}
                                                                placeholder="Tên xuất xứ"
                                                                value={originName}
                                                                onChange={onOriginNameChange}
                                                            />
                                                            <Typography.Link
                                                                onClick={addOriginItem}
                                                                style={{
                                                                    whiteSpace: 'nowrap',
                                                                }}
                                                            >
                                                                <Button type="primary" loading={loading}>
                                                                    <PlusOutlined /> {t('create')}
                                                                </Button>
                                                            </Typography.Link>
                                                        </Space>
                                                    </>
                                                )}
                                            >
                                                {listOrigin.map((e) => {
                                                    return (
                                                        <Option value={e.id} key={e.id}>
                                                            {e.name}
                                                        </Option>
                                                    );
                                                })}
                                            </Select>
                                        )}
                                    />
                                    {errors?.originId?.message && (
                                        <p className="text-error">{errors?.originId?.message}</p>
                                    )}
                                </div>
                                <div className="field mb-3">
                                    <Space size="large">
                                        {t('featured')}

                                        <Controller
                                            name="outstanding"
                                            control={control}
                                            render={({ field }) => (
                                                <Radio.Group onChange={onChange_Radio} {...field}>
                                                    <Radio value={0}>{t('off')}</Radio>
                                                    <Radio value={1}>{t('on')}</Radio>
                                                </Radio.Group>
                                            )}
                                        />
                                    </Space>
                                    {errors?.outstanding?.message && (
                                        <p className="text-error">{errors?.outstanding?.message}</p>
                                    )}
                                </div>
                            </Card>

                            <Card className="mb-3" title={t('thumbnail')} bordered={false}>
                                <div className="field mb-3">
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
                                                    <Spin
                                                        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                                                    />
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
                                    {errors?.thumbnail?.message && (
                                        <p className="text-error">{errors?.thumbnail?.message}</p>
                                    )}
                                </div>
                            </Card>
                        </Col>
                    </Row>

                    <Row justify="end">
                        <Col span={24} className="layout-btn-action">
                            <Space size="small">
                                <Button
                                    icon={<CheckOutlined />}
                                    key="1"
                                    htmlType="submit"
                                    type="primary"
                                    loading={loading}
                                >
                                    {t('submit')}
                                </Button>
                                <Button
                                    icon={<ReloadOutlined />}
                                    onClick={() => {
                                        reset();
                                    }}
                                    htmlType="reset"
                                    key="2"
                                >
                                    {t('reset')}
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                </PageHeader>
            </form>
        </>
    );
};

export default ProductCreate;
