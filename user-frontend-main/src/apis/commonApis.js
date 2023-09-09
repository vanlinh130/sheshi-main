import axiosClient from "./axiosClient";

const commonApis = {
  preUploadFile: (formData) =>
    axiosClient.post(`/api/common/create-presigned-url`, formData),
  uploadFile: ({ urlUpload, file }) => {
    return fetch(urlUpload, {
      method: "PUT",
      body: file,
    });
  },
};

export default commonApis;
