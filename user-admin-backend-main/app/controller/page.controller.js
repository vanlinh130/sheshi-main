import express from 'express';
import { successResponse } from '../util/response.util';
import { isAuthenticated } from '../middleware/permission';
import { updateContactPageValidator, updateContentSlidePageValidator } from '../validator/page.validator';
import { getContactPage, getContentPage, getSlidePage, updateContactPage, updateContentSlidePage } from '../service/page.service';
import { MODULE } from '../constants/common.constant';

const page = express.Router();

page.get(
  '/contact',
  (req, res, next) => {
    return getContactPage(req.query, req.paging)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

page.get(
  '/slide-page',
  (req, res, next) => {
    return getSlidePage(req.query)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

page.get(
  '/content-page',
  (req, res, next) => {
    return getContentPage(req.query)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

page.put(
  "/update-page-contact",
  isAuthenticated([MODULE.CONFIG]),
  [updateContactPageValidator],
  (req, res, next) => {
    return updateContactPage(req.body)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

page.put(
  "/update-page-content-slide",
  isAuthenticated([MODULE.CONFIG]),
  [updateContentSlidePageValidator],
  (req, res, next) => {
    return updateContentSlidePage(req.body)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

export function initWebPageController(app) {
  app.use("/api/config-page", page);
}
