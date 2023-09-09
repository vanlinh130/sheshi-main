import commonApis from "@/apis/commonApis";
import configPageApis from "@/apis/configPageApis";
import { SLIDE_PAGE } from "@/constants";
import errorHelper from "@/utils/error-helper";
import successHelper from "@/utils/success-helper";
import yup from "@/utils/yup";
import { CameraOutlined, CheckOutlined, LoadingOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { Editor } from "@tinymce/tinymce-react";
import { Button, Card, Col, Image, Input, Modal, PageHeader, Row, Spin, Tabs, Tooltip, Upload } from "antd";
import Compressor from "compressorjs";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

const schema = yup.object({
  processContent: yup.string(),
  overviewContent: yup.string()
});

const REMOVED = "removed"
const HomePage = () => {
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

  const { t } = useTranslation();
  const { TabPane } = Tabs;
  const [errorUploadFileMain, setErrorUploadFileMain] = useState();
  const [fileListMainPc, setFileListMainPc] = useState([]);
  const [fileListMainSmp, setFileListMainSmp] = useState([]);
  const [fileListAdvert, setFileListAdvert] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [compressedFile, setCompressedFile] = useState(null);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  };
  const handleCancel = () => setPreviewVisible(false);

  const handleChangeMainPc = ({ file: newFile }) => {
    if (newFile.status === REMOVED) {
      setFileListMainPc(fileListMainPc.filter((file) => file.uid !== newFile.uid))
      return
    }
    new Compressor(newFile.originFileObj, {
      quality: 1, // 0.6 can also be used, but its not recommended to go below.
      success: (compressedResult) => {
        // compressedResult has the compressed file.
        // Use the compressed file to upload the images to your server.
        setCompressedFile({ file: compressedResult, type: 1 });
      },
    });
  }

  const handleChangeMainSmp = ({ file: newFile }) => {
    if (newFile.status === REMOVED) {
      setFileListMainSmp(fileListMainSmp.filter((file) => file.uid !== newFile.uid))
      return
    }
    new Compressor(newFile.originFileObj, {
      quality: 1, // 0.6 can also be used, but its not recommended to go below.
      success: (compressedResult) => {
        // compressedResult has the compressed file.
        // Use the compressed file to upload the images to your server.
        setCompressedFile({ file: compressedResult, type: 2 });
      },
    });
  }

  const handleChangeAdvert = ({ file: newFile }) => {
    if (newFile.status === REMOVED) {
      setFileListAdvert(fileListAdvert.filter((file) => file.uid !== newFile.uid))
      return
    }
    new Compressor(newFile.originFileObj, {
      quality: 0.8, // 0.6 can also be used, but its not recommended to go below.
      success: (compressedResult) => {
        // compressedResult has the compressed file.
        // Use the compressed file to upload the images to your server.
        setCompressedFile({ file: compressedResult, type: 3 });
      },
    });
  }

  const changeListImage = async (compressedFile) => {
    setErrorUploadFileMain();
    if (!compressedFile) return null;
    const { file, type } = compressedFile;
    if (!file) return null;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);
    return commonApis
      .preUploadFile(formData)
      .then(async (response) => {
        type === 1 &&
          setFileListMainPc([...fileListMainPc, { url: response }]);
        type === 2 &&
          setFileListMainSmp([...fileListMainSmp, { url: response }]);
        type === 3 &&
          setFileListAdvert([...fileListAdvert, { url: response }]);
      })
      .catch((err) => {
        errorHelper(err);
      });
  };

  useEffect(() => {
    changeListImage(compressedFile)
  }, [compressedFile])

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

  const fetchListContentSlidePage = async () => {
    const images = await configPageApis.getListConfigPageSlide({pageCode :[
      SLIDE_PAGE.HOME_PAGE_ADVERTMENT,
      SLIDE_PAGE.HOME_PAGE_MAIN_PC,
      SLIDE_PAGE.HOME_PAGE_MAIN_SMARTPHONE,
    ]});

    setValue(
      "advertment",
      images?.find((img) => img.pageCode === SLIDE_PAGE.HOME_PAGE_ADVERTMENT)
        ?.title
    );

    setFileListAdvert(
      images.filter((imgs) => imgs.pageCode === SLIDE_PAGE.HOME_PAGE_ADVERTMENT).map((img) => ({
        ...img,
        url: img.image,
      }))
    );
    setFileListMainPc(
      images
        .filter((imgs) => imgs.pageCode === SLIDE_PAGE.HOME_PAGE_MAIN_PC)
        .map((img) => ({
          ...img,
          url: img.image,
        }))
    );
    setFileListMainSmp(
      images
        .filter(
          (imgs) => imgs.pageCode === SLIDE_PAGE.HOME_PAGE_MAIN_SMARTPHONE
        )
        .map((img) => ({
          ...img,
          url: img.image,
        }))
    );
  }

  useEffect(() => {
    fetchListContentSlidePage()
  }, [])

  const submitUpdate = async (value) => {
    if (fileListMainPc.length === 0 || fileListMainSmp.length === 0) {
      setErrorUploadFileMain("Cần nhập ít nhất 1 hình ảnh");
      return;
    }
    if (fileListMainPc.length !== fileListMainSmp.length) {
      setErrorUploadFileMain("Số lượng hình ảnh trên pc phải bằng smartphone");
      return;
    }
    setErrorUploadFileMain()
    const listImageMainPc = fileListMainPc.map((e) => ({
      title: null,
      image: e.url,
      pageCode: SLIDE_PAGE.HOME_PAGE_MAIN_PC,
    }));
    const listImageMainSmp = fileListMainSmp.map((e) => ({
      title: null,
      image: e.url,
      pageCode: SLIDE_PAGE.HOME_PAGE_MAIN_SMARTPHONE,
    }));
    const listImageAdvert = value.advertment
      ? fileListAdvert.map((e) => ({
          title: value.advertment,
          image: e.url,
          pageCode: SLIDE_PAGE.HOME_PAGE_ADVERTMENT,
        }))
      : [];
    const listImage = listImageMainPc.concat(listImageMainSmp).concat(listImageAdvert);
    return configPageApis
      .updateConfigPageContentSlide({ listImage })
      .then(() => {
        successHelper(t("update_success"));
      })
      .catch((err) => {
        errorHelper(err);
      });
  };

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
          <Card bordered={false} className="mb-3" title="Slide chính">
            <Col xs={24} sm={24} md={24} xl={24}>
              <Tabs defaultActiveKey="1">
                <TabPane tab="Hình ảnh trên PC" key="1">
                  <Upload
                    style={{ width: "100px" }}
                    // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-card"
                    type="file"
                    accept="image/*"
                    fileList={fileListMainPc}
                    onPreview={handlePreview}
                    onChange={handleChangeMainPc}
                  >
                    {fileListMainPc.length >= 8 ? null : uploadButton}
                  </Upload>
                  <Modal
                    visible={previewVisible}
                    footer={null}
                    onCancel={handleCancel}
                  >
                    <img
                      alt="example"
                      style={{
                        width: "100%",
                      }}
                      src={previewImage}
                    />
                  </Modal>
                </TabPane>
                <TabPane tab="Hình ảnh trên Smartphone" key="2">
                  <Upload
                    style={{ width: "100px" }}
                    // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-card"
                    type="file"
                    accept="image/*"
                    fileList={fileListMainSmp}
                    onPreview={handlePreview}
                    onChange={handleChangeMainSmp}
                  >
                    {fileListMainSmp.length >= 8 ? null : uploadButton}
                  </Upload>
                  <Modal
                    visible={previewVisible}
                    footer={null}
                    onCancel={handleCancel}
                  >
                    <img
                      alt="example"
                      style={{
                        width: "100%",
                      }}
                      src={previewImage}
                    />
                  </Modal>
                </TabPane>
              </Tabs>
              {errorUploadFileMain && (
                <p className="text-error">{errorUploadFileMain}</p>
              )}
            </Col>
          </Card>
          <Card bordered={false} className="mb-3" title="Slide quảng cáo">
            <Col xs={24} sm={24} md={24} xl={24}>
              <div className="field mb-3">
                <label>Tên quảng cáo</label>
                <Controller
                  name="advertment"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      maxLength={255}
                      status={errors?.advertment?.message}
                      placeholder={t("Tên quảng cáo")}
                    />
                  )}
                />
                {errors?.advertment?.message && (
                  <p className="text-error">{errors?.advertment?.message}</p>
                )}
              </div>
              <Upload
                style={{ width: "100px" }}
                // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture-card"
                type="file"
                accept="image/*"
                fileList={fileListAdvert}
                onPreview={handlePreview}
                onChange={handleChangeAdvert}
              >
                {fileListAdvert.length >= 8 ? null : uploadButton}
              </Upload>
              <Modal
                visible={previewVisible}
                footer={null}
                onCancel={handleCancel}
              >
                <img
                  alt="example"
                  style={{
                    width: "100%",
                  }}
                  src={previewImage}
                />
              </Modal>
              <Modal
                visible={previewVisible}
                footer={null}
                onCancel={handleCancel}
              >
                <img
                  alt="example"
                  style={{
                    width: "100%",
                  }}
                  src={previewImage}
                />
              </Modal>
            </Col>
          </Card>
        </PageHeader>
      </form>
    </>
  );
};

export default HomePage;