import express from 'express';
import { pagingParse } from '../middleware/paging.middleware';
import { successResponse } from '../util/response.util';
import { createNews, getDetailNews, getDetailNewsBySlug, getListNews, updateNews } from '../service/news.service';
import { createNewsValidator, updateNewsValidator } from '../validator/news.validator';

const news = express.Router();

news.get(
  '/',
  [pagingParse({ column: 'id', dir: 'desc' })],
  (req, res, next) => {
    return getListNews(req.query, req.paging)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

news.get("/news/:id", (req, res, next) => {
  return getDetailNews(req.params.id)
    .then((t) => successResponse(res, t))
    .catch(next);
});

news.get("/getNewsBySlug/:slug", (req, res, next) => {
  return getDetailNewsBySlug(req.params.slug)
    .then((t) => successResponse(res, t))
    .catch(next);
});

news.post(
  '/create-news',
  [createNewsValidator],
  (req, res, next) => {
    return createNews(req.body)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

news.put(
  '/update-news',
  [updateNewsValidator],
  (req, res, next) => {
    return updateNews(req.body)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

export function initWebNewsController(app) {
  app.use("/api/news", news);
}
