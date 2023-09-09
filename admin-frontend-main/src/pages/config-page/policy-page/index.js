import commonApis from "@/apis/commonApis";
import configPageApis from "@/apis/configPageApis";
import { CONTENT_PAGE } from "@/constants";
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
  guideContent: yup.string().required(),
  returnContent: yup.string().required(),
  deliverContent: yup.string().required(),
  securityContent: yup.string().required(),
});

const PolicyPage = () => {
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
        content: value.guideContent,
        pageCode: CONTENT_PAGE.POLICY_PAGE_GUIDE,
      },
      {
        content: value.returnContent,
        pageCode: CONTENT_PAGE.POLICY_PAGE_RETURN,
      },
      {
        content: value.deliverContent,
        pageCode: CONTENT_PAGE.POLICY_PAGE_DELIVER,
      },
      {
        content: value.securityContent,
        pageCode: CONTENT_PAGE.POLICY_PAGE_SECURITY,
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

  const fetchListContentSlidePage = async () => {
    const contents = await configPageApis.getListConfigPageContent({
      pageCode: [
        CONTENT_PAGE.POLICY_PAGE_GUIDE,
        CONTENT_PAGE.POLICY_PAGE_RETURN,
        CONTENT_PAGE.POLICY_PAGE_DELIVER,
        CONTENT_PAGE.POLICY_PAGE_SECURITY,
      ],
    });
    const guidePolicy = contents?.find((cte) => cte.pageCode === CONTENT_PAGE.POLICY_PAGE_GUIDE);
    const returnPolicy = contents?.find((cte) => cte.pageCode === CONTENT_PAGE.POLICY_PAGE_RETURN);
    const deliverPolicy = contents?.find((cte) => cte.pageCode === CONTENT_PAGE.POLICY_PAGE_DELIVER);
    const securityPolicy = contents?.find((cte) => cte.pageCode === CONTENT_PAGE.POLICY_PAGE_SECURITY);
    setValue("guideContent", guidePolicy?.content);
    setValue("returnContent", returnPolicy?.content);
    setValue("deliverContent", deliverPolicy?.content);
    setValue("securityContent", securityPolicy?.content);
  }

  useEffect(() => {
    fetchListContentSlidePage()
  }, [])

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
              <TabPane tab="Hướng dẫn mua hàng" key="1">
                <Row gutter={[24, 24]} align="top">
                  <Col xs={24} sm={24} md={24} xl={24}>
                    <div className="field mb-3">
                      <Controller
                        name="guideContent"
                        control={control}
                        render={({ field }) => (
                          <Editor
                            value={getValues("guideContent")}
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
                </Row>
              </TabPane>
              <TabPane tab="Chính sách đổi trả" key="2">
                <Row gutter={[24, 24]} align="top">
                  <Col xs={24} sm={24} md={24} xl={24}>
                    <div className="field mb-3">
                      <Controller
                        name="returnContent"
                        control={control}
                        render={({ field }) => (
                          <Editor
                            value={getValues("returnContent")}
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
                </Row>
              </TabPane>
              <TabPane tab="Chính sách giao hàng" key="3">
                <Row gutter={[24, 24]} align="top">
                  <Col xs={24} sm={24} md={24} xl={24}>
                    <div className="field mb-3">
                      <Controller
                        name="deliverContent"
                        control={control}
                        render={({ field }) => (
                          <Editor
                            value={getValues("deliverContent")}
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
                </Row>
              </TabPane>
              <TabPane tab="Chính sách bảo mật" key="4">
                <Row gutter={[24, 24]} align="top">
                  <Col xs={24} sm={24} md={24} xl={24}>
                    <div className="field mb-3">
                      <Controller
                        name="securityContent"
                        control={control}
                        render={({ field }) => (
                          <Editor
                            value={getValues("securityContent")}
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
                </Row>
              </TabPane>
            </Tabs>
          </Card>
        </PageHeader>
      </form>
    </>
  );
};

export default PolicyPage;