import axiosClient from './axiosClient'

const newsApis = {
  getNews: (params) => axiosClient.get("/api/news/", { params }),
  getDetailNews: (id) => axiosClient.get(`/api/news/news/${id}`),
  updateNews: (payload) => axiosClient.put("/api/news/update-news", payload),
  createNews: (payload) => axiosClient.post("/api/news/create-news", payload),
};

export default newsApis
