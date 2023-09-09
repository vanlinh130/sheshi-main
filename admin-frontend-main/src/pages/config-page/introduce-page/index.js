import commonApis from "@/apis/commonApis";
import configPageApis from "@/apis/configPageApis";
import { CONTENT_PAGE, SLIDE_PAGE } from "@/constants";
import errorHelper from "@/utils/error-helper";
import successHelper from "@/utils/success-helper";
import yup from "@/utils/yup";
import { CameraOutlined, CheckOutlined, LoadingOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { Editor } from "@tinymce/tinymce-react";
import { Button, Card, Col, Image, Modal, PageHeader, Row, Spin, Tabs, Tooltip, Upload } from "antd";
import Compressor from "compressorjs";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

const schema = yup.object({
  introduceContent: yup.string().required(),
  storyContent: yup.string().required(),
  customerContent: yup.string().required(),
  thumbnailIntroduce: yup.string().required(),
  thumbnailStory: yup.string().required(),
  thumbnailCustomer: yup.string().required()
});

const IntroducePage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues
  } = useForm({
    resolver: yupResolver(schema),
  });

  const submitUpdate = async (value) => {
    const listContent = [
      {
        content: value.introduceContent,
        image: value.thumbnailIntroduce,
        pageCode: CONTENT_PAGE.INTRODUCE_PAGE,
      },
      {
        content: value.storyContent,
        image: value.thumbnailStory,
        pageCode: CONTENT_PAGE.INTRODUCE_PAGE_STORY,
      },
      {
        content: value.customerContent,
        image: value.thumbnailCustomer,
        pageCode: CONTENT_PAGE.INTRODUCE_PAGE_CUSTOMER,
      },
    ];

    return configPageApis
      .updateConfigPageContentSlide({ listContent })
      .then(() => {
        successHelper(t("update_success"));
      })
      .catch((err) => {
        errorHelper(err);
      });
  };

  const { t } = useTranslation();
  const { TabPane } = Tabs;
  const [isUpdateThumbnail, setIsUpdateThumbnail] = useState(false);
  const { thumbnailIntroduce, thumbnailStory, thumbnailCustomer } = useWatch({
    control,
  });
  const refThumbnailIntroduce = useRef();
  const refThumbnailStory = useRef();
  const refThumbnailCustomer = useRef();

  const fetchListContentSlidePage = async () => {
    const contents = await configPageApis.getListConfigPageContent({
      pageCode: [
        CONTENT_PAGE.INTRODUCE_PAGE,
        CONTENT_PAGE.INTRODUCE_PAGE_CUSTOMER,
        CONTENT_PAGE.INTRODUCE_PAGE_STORY,
      ],
    });
    const introduceContent = contents?.find((cte) => cte.pageCode === CONTENT_PAGE.INTRODUCE_PAGE);
    const storyContent = contents?.find((cte) => cte.pageCode === CONTENT_PAGE.INTRODUCE_PAGE_STORY);
    const customerContent = contents?.find((cte) => cte.pageCode === CONTENT_PAGE.INTRODUCE_PAGE_CUSTOMER);

    setValue("introduceContent", introduceContent?.content);
    setValue("thumbnailIntroduce", introduceContent?.image );
    setValue("storyContent", storyContent?.content);
    setValue("thumbnailStory", storyContent?.image );
    setValue("customerContent", customerContent?.content);
    setValue("thumbnailCustomer", customerContent?.image );
  }

  useEffect(() => {
    fetchListContentSlidePage()
  }, [])

  const onchangeThumbnailIntroduce = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      new Compressor(files[0], {
        quality: 0.8,
        success: (compressedImg) => {
          // compressedResult has the compressed file.
          // Use the compressed file to upload the images to your server.
          onUploadThumbnail(compressedImg)
            .then((response) => {
              setValue("thumbnailIntroduce", response, {
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
  const onchangeThumbnailStory = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      new Compressor(files[0], {
        quality: 0.8,
        success: (compressedImg) => {
          // compressedResult has the compressed file.
          // Use the compressed file to upload the images to your server.
          onUploadThumbnail(compressedImg)
            .then((response) => {
              setValue("thumbnailStory", response, {
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

  const onchangeThumbnailCustomer = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      new Compressor(files[0], {
        quality: 0.8,
        success: (compressedImg) => {
          // compressedResult has the compressed file.
          // Use the compressed file to upload the images to your server.
          onUploadThumbnail(compressedImg)
            .then((response) => {
              setValue("thumbnailCustomer", response, {
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

  return (
    <>
      <form onSubmit={handleSubmit(submitUpdate)}>
        <PageHeader
          className="site-page-header-responsive"
          extra={[
            <Button
              icon={<CheckOutlined />}
              key="1"
              htmlType="submit"
              type="primary"
            >
              {t("update")}
            </Button>,
          ]}
        >
          <Card bordered={false} className="mb-3">
            <Tabs defaultActiveKey="1">
              <TabPane tab="Giới thiệu" key="1">
                <Row gutter={[24, 24]} align="top">
                  <Col xs={24} sm={24} md={17} xl={17}>
                    <div className="field mb-3">
                      <Controller
                        name="introduceContent"
                        control={control}
                        render={({ field }) => (
                          <Editor
                            value={getValues("introduceContent")}
                            tinymceScriptSrc={"/tinymce/tinymce.min.js"}
                            onEditorChange={(newText) =>
                              field.onChange(newText)
                            }
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
                                      tinymce.activeEditor.editorUpload
                                        .blobCache;
                                    const base64 = await onUploadImageContent(
                                      file
                                    );
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

                      {errors?.introduceContent?.message && (
                        <p className="text-error">
                          {errors?.introduceContent?.message}
                        </p>
                      )}
                    </div>
                  </Col>
                  <Col xs={24} sm={24} md={17} xl={7}>
                    <div className="field mb-3">
                      <div
                        className="thumbnail-upload"
                        style={{ width: "250px", marginTop: "80px" }}
                      >
                        <Image
                          className="img-thumbnail"
                          src={
                            thumbnailIntroduce ||
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
                            onClick={() =>
                              refThumbnailIntroduce.current.click()
                            }
                            className="button-camera"
                          >
                            {isUpdateThumbnail ? (
                              <Spin
                                indicator={
                                  <LoadingOutlined
                                    style={{ fontSize: 24 }}
                                    spin
                                  />
                                }
                              />
                            ) : (
                              <CameraOutlined />
                            )}
                            <input
                              ref={refThumbnailIntroduce}
                              type="file"
                              accept="image/*"
                              onChange={onchangeThumbnailIntroduce}
                              style={{ display: "none" }}
                            />
                          </button>
                        </Tooltip>
                      </div>
                      {errors?.thumbnail?.message && (
                        <p className="text-error">
                          {errors?.thumbnail?.message}
                        </p>
                      )}
                    </div>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="Câu chuyện" key="2">
                <Row gutter={[24, 24]} align="top">
                  <Col xs={24} sm={24} md={17} xl={17}>
                    <div className="field mb-3">
                      <Controller
                        name="storyContent"
                        control={control}
                        render={({ field }) => (
                          <Editor
                            value={getValues("storyContent")}
                            tinymceScriptSrc={"/tinymce/tinymce.min.js"}
                            onEditorChange={(newText) =>
                              field.onChange(newText)
                            }
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
                                      tinymce.activeEditor.editorUpload
                                        .blobCache;
                                    const base64 = await onUploadImageContent(
                                      file
                                    );
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

                      {errors?.storyContent?.message && (
                        <p className="text-error">
                          {errors?.storyContent?.message}
                        </p>
                      )}
                    </div>
                  </Col>
                  <Col xs={24} sm={24} md={17} xl={7}>
                    <div className="field mb-3">
                      <div
                        className="thumbnail-upload"
                        style={{ width: "250px", marginTop: "80px" }}
                      >
                        <Image
                          className="img-thumbnail"
                          src={
                            thumbnailStory ||
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
                            onClick={() => refThumbnailStory.current.click()}
                            className="button-camera"
                          >
                            {isUpdateThumbnail ? (
                              <Spin
                                indicator={
                                  <LoadingOutlined
                                    style={{ fontSize: 24 }}
                                    spin
                                  />
                                }
                              />
                            ) : (
                              <CameraOutlined />
                            )}
                            <input
                              ref={refThumbnailStory}
                              type="file"
                              accept="image/*"
                              onChange={onchangeThumbnailStory}
                              style={{ display: "none" }}
                            />
                          </button>
                        </Tooltip>
                      </div>
                      {errors?.thumbnail?.message && (
                        <p className="text-error">
                          {errors?.thumbnail?.message}
                        </p>
                      )}
                    </div>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="Khách hàng" key="3">
                <Row gutter={[24, 24]} align="top">
                  <Col xs={24} sm={24} md={17} xl={17}>
                    <div className="field mb-3">
                      <Controller
                        name="customerContent"
                        control={control}
                        render={({ field }) => (
                          <Editor
                            value={getValues("customerContent")}
                            tinymceScriptSrc={"/tinymce/tinymce.min.js"}
                            onEditorChange={(newText) =>
                              field.onChange(newText)
                            }
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
                                      tinymce.activeEditor.editorUpload
                                        .blobCache;
                                    const base64 = await onUploadImageContent(
                                      file
                                    );
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

                      {errors?.customerContent?.message && (
                        <p className="text-error">
                          {errors?.customerContent?.message}
                        </p>
                      )}
                    </div>
                  </Col>
                  <Col xs={24} sm={24} md={17} xl={7}>
                    <div className="field mb-3">
                      <div
                        className="thumbnail-upload"
                        style={{ width: "250px", marginTop: "80px" }}
                      >
                        <Image
                          className="img-thumbnail"
                          src={
                            thumbnailCustomer ||
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
                            onClick={() => refThumbnailCustomer.current.click()}
                            className="button-camera"
                          >
                            {isUpdateThumbnail ? (
                              <Spin
                                indicator={
                                  <LoadingOutlined
                                    style={{ fontSize: 24 }}
                                    spin
                                  />
                                }
                              />
                            ) : (
                              <CameraOutlined />
                            )}
                            <input
                              ref={refThumbnailCustomer}
                              type="file"
                              accept="image/*"
                              onChange={onchangeThumbnailCustomer}
                              style={{ display: "none" }}
                            />
                          </button>
                        </Tooltip>
                      </div>
                      {errors?.thumbnail?.message && (
                        <p className="text-error">
                          {errors?.thumbnail?.message}
                        </p>
                      )}
                    </div>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </Card>
        </PageHeader>
      </form>
    </>
  );
};

export default IntroducePage;