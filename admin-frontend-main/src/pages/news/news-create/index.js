import errorHelper from "@/utils/error-helper";
import successHelper from "@/utils/success-helper";
import { Select } from "antd";
import yup from "@/utils/yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
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
} from "antd";
import React, { forwardRef, useState, useRef, useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  CameraOutlined,
  LoadingOutlined,
  ReloadOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { useNavigate, Navigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { convertToSlug } from "@/utils/funcs";
import commonApis from "@/apis/commonApis";
import { Editor } from "@tinymce/tinymce-react";
import Compressor from "compressorjs";
import newsApis from "@/apis/newsApis";

const NewsCreate = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const schema = yup.object({
    nameNews: yup.string().max(100).required(),
    title: yup.string().max(100).required(),
    description: yup.string().max(500).required(),
    descriptionSEO: yup.string().max(500).required(),
    content: yup.string().required().trim(),
    slug: yup.string().required().max(100).trim(),
    thumbnail: yup.string().required().trim(),
    outstanding: yup.number().max(2).required(),
  });
  const { TextArea } = Input;

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
  const { thumbnail } = useWatch({ control });
  const refThumbnail = useRef();
  const [isUpdateThumbnail, setIsUpdateThumbnail] = useState(false);
  const navigate = useNavigate();

  const onChange_Radio = (e) => {
    setValue(e.target.value);
  };

  const submitCreate = async (values) => {
    if (id) {
      return newsApis
        .updateNews({ ...values, id })
        .then(() => {
          successHelper(t("update_success"));
          navigate("/news");
        })
        .catch((err) => {
          console.log(err);
          errorHelper(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      return newsApis
      .createNews(values)
      .then(() => {
        successHelper(t("create_success"));
        navigate("/news");
      })
      .catch((err) => {
        console.log(err);
        errorHelper(err);
      })
      .finally(() => {
        setLoading(false);
      });
    }
  }

  const getNews = async () => {
    const detailNews = await newsApis.getDetailNews(id);
    console.log(detailNews.content)
    setValue("nameNews", detailNews.nameNews, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("title", detailNews.title, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("description", detailNews.description, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("descriptionSEO", detailNews.descriptionSEO, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("content", detailNews.content, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("slug", detailNews.slug, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("thumbnail", detailNews.thumbnail, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("outstanding", detailNews.outstanding, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }

  useEffect(() => {
    if (id) {
      getNews()
    } else {
      setValue("outstanding", 0);
    }
  }, []);

  const handleChangeNameNews = (value) => {
    setValue("title", value, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("nameNews", value, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("slug", convertToSlug(value), {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleChangeDesciption = (value) => {
    setValue("description", value, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("descriptionSEO", value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onUploadImageContent = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);
    return commonApis
      .preUploadFile(formData)
      .then(async (response) => {
        return response;
      })
      .catch((err) => {
        errorHelper(err);
      });
  };

  const onUploadThumbnail = async (file) => {
    setIsUpdateThumbnail(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);
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
              setValue("thumbnail", response, {
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

  const goBackListNews = () => {
    navigate(`/news`);
  };

  return (
    <>
      <form onSubmit={handleSubmit(submitCreate)}>
        <PageHeader
          onBack={() => goBackListNews()}
          className="site-page-header-responsive"
          title={id ? "Cập nhật tin tức" : "Thêm tin tức"}
          extra={[
            <Button
              icon={<CheckOutlined />}
              key="1"
              htmlType="submit"
              type="primary"
              loading={loading}
            >
              {id ? t("update") : t("submit")}
            </Button>,
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                reset();
              }}
              htmlType="reset"
              key="2"
            >
              {t("reset")}
            </Button>,
          ]}
        >
          <Row gutter={[24, 12]} align="top">
            <Col xs={24} sm={24} md={17} xl={17}>
              <Card bordered={false} className="mb-3">
                <div className="field mb-3">
                  <label>Tên bài viết</label>
                  <Controller
                    name="nameNews"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        onChange={(event) =>
                          handleChangeNameNews(event.target.value)
                        }
                        status={errors?.nameNews?.message}
                        placeholder="Tên bài viết"
                      />
                    )}
                  />
                  {errors?.nameNews?.message && (
                    <p className="text-error">{errors?.nameNews?.message}</p>
                  )}
                </div>

                <div className="field mb-3">
                  <label>Mô tả</label>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <TextArea
                        {...field}
                        onChange={(event) =>
                          handleChangeDesciption(event.target.value)
                        }
                        status={errors?.description?.message}
                        placeholder={t("description")}
                      />
                    )}
                  />
                  {errors?.description?.message && (
                    <p className="text-error">{errors?.description?.message}</p>
                  )}
                </div>

                <div className="field mb-3">
                  <label>Nội dung</label>
                  <Controller
                    name="content"
                    control={control}
                    render={({ field }) => (
                      <Editor
                        value={getValues("content")}
                        tinymceScriptSrc={"/tinymce/tinymce.min.js"}
                        onEditorChange={(newText) => field.onChange(newText)}
                        init={{
                          onchange_callback: "myCustomOnChangeHandler",
                          menubar: false,
                          plugins: [
                            "preview",
                            "importcss",
                            "searchreplace",
                            "autolink",
                            "autosave",
                            "save",
                            "directionality",
                            "code",
                            "visualblocks",
                            "visualchars",
                            "fullscreen",
                            "image",
                            "link",
                            "media",
                            "template",
                            "codesample",
                            "table",
                            "charmap",
                            "pagebreak",
                            "anchor",
                            "insertdatetime",
                            "advlist",
                            "lists",
                            "wordcount",
                            "help",
                            "charmap",
                            "nonbreaking",
                          ],
                          toolbar:
                            "code | undo redo | bold italic underline strikethrough | forecolor backcolor removeformat | alignleft aligncenter alignright alignjustify | fontsize blocks | insertfile image media template link anchor codesample | outdent indent |  numlist bullist | pagebreak | charmap | fullscreen  preview save print | ltr rtl",
                          image_caption: true,
                          image_title: true,
                          automatic_uploads: true,
                          file_picker_types: "image",
                          file_picker_callback: (cb) => {
                            const input = document.createElement("input");
                            input.setAttribute("type", "file");
                            input.setAttribute("accept", "image/*");
                            input.addEventListener("change", (e) => {
                              const file = e.target.files[0];

                              const reader = new FileReader();
                              reader.addEventListener("load", async () => {
                                const id = "blobid" + new Date().getTime();
                                const blobCache =
                                  tinymce.activeEditor.editorUpload.blobCache;
                                const base64 = await onUploadImageContent(file);
                                const blobInfo = blobCache.create(
                                  id,
                                  file,
                                  base64
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
                  {errors?.content?.message && (
                    <p className="text-error">{errors?.content?.message}</p>
                  )}
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={7} xl={7}>
              <Card className="mb-3" title={t("thumbnail")} bordered={false}>
                <div className="field mb-3">
                  <div className="thumbnail-upload">
                    <Image
                      className="img-thumbnail"
                      src={
                        thumbnail ||
                        "data:image/png;base64,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"
                      }
                      alt=""
                    />
                    <Tooltip
                      placement="left"
                      title={t("thumbnail_action_note")}
                    >
                      <button
                        type={"button"}
                        disabled={isUpdateThumbnail}
                        onClick={() => refThumbnail.current.click()}
                        className="button-camera"
                      >
                        {isUpdateThumbnail ? (
                          <Spin
                            indicator={
                              <LoadingOutlined style={{ fontSize: 24 }} spin />
                            }
                          />
                        ) : (
                          <CameraOutlined />
                        )}
                        <input
                          ref={refThumbnail}
                          type="file"
                          accept="image/*"
                          onChange={onchangeThumbnail}
                          style={{ display: "none" }}
                        />
                      </button>
                    </Tooltip>
                  </div>
                  {errors?.thumbnail?.message && (
                    <p className="text-error">{errors?.thumbnail?.message}</p>
                  )}
                </div>
              </Card>
              <Card className="mb-3" title={t("shows")} bordered={false}>
                <div className="field mb-3">
                  <Space size="large">
                    {t("featured")}

                    <Controller
                      name="outstanding"
                      control={control}
                      render={({ field }) => (
                        <Radio.Group onChange={onChange_Radio} {...field}>
                          <Radio value={0}>{t("off")}</Radio>
                          <Radio value={1}>{t("on")}</Radio>
                        </Radio.Group>
                      )}
                    />
                  </Space>
                  {errors?.outstanding?.message && (
                    <p className="text-error">{errors?.outstanding?.message}</p>
                  )}
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={17} xl={17}>
              <Card bordered={false} className="mb-3" title="Tối ưu SEO">
                <div className="field mb-3">
                  <label>Tiêu đề trang</label>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        status={errors?.title?.message}
                        placeholder="Tiêu đề trang"
                      />
                    )}
                  />
                  {errors?.title?.message && (
                    <p className="text-error">{errors?.title?.message}</p>
                  )}
                </div>

                <div className="field mb-3">
                  <label>Mô tả trang</label>
                  <Controller
                    name="descriptionSEO"
                    control={control}
                    render={({ field }) => (
                      <TextArea
                        {...field}
                        status={errors?.descriptionSEO?.message}
                        placeholder="Mô tả trang"
                      />
                    )}
                  />
                  {errors?.descriptionSEO?.message && (
                    <p className="text-error">
                      {errors?.descriptionSEO?.message}
                    </p>
                  )}
                </div>
                <div className="field mb-3">
                  <label>Đường dẫn</label>
                  <Controller
                    name="slug"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        tatus={errors?.slug?.message}
                        placeholder="Đường dẫn trang"
                        addonBefore="http://sheshi.vn/tin-tuc/"
                      />
                    )}
                  />
                  {errors?.slug?.message && (
                    <p className="text-error">{errors?.slug?.message}</p>
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
                  {t("submit")}
                </Button>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    reset();
                  }}
                  htmlType="reset"
                  key="2"
                >
                  {t("reset")}
                </Button>
              </Space>
            </Col>
          </Row>
        </PageHeader>
      </form>
    </>
  );
};

export default NewsCreate;
