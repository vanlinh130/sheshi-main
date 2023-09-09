import axiosClient from './axiosClient'

const configPageApis = {
  getListConfigPageContact: () => axiosClient.get("/api/config-page/contact"),
  getListConfigPageContent: (params) =>
    axiosClient.get("/api/config-page/content-page", { params }),
  getListConfigPageSlide: (params) =>
    axiosClient.get("/api/config-page/slide-page", { params }),
  updateConfigPageContact: (payload) =>
    axiosClient.put("/api/config-page/update-page-contact", payload),
  updateConfigPageContentSlide: (payload) =>
    axiosClient.put("/api/config-page/update-page-content-slide", payload),
};

export default configPageApis
