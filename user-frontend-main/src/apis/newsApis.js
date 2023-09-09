import axiosClient from './axiosClient'

const newsApis = {
  getNews: (params) => axiosClient.get("/api/news/", { params }),
  getDetailNews: (slug) => axiosClient.get(`/api/news/getNewsBySlug/${slug}`),
};

export default newsApis
