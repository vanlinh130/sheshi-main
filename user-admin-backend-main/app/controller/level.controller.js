import express from 'express';
import { successResponse } from '../util/response.util';
import { isAuthenticated } from '../middleware/permission';
import { MODULE } from '../constants/common.constant';
import { createLevelConditions, getListLevelConditions, updateLevelConditions } from "../service/level-conditions.service";
import { createLevelConditionsValidator } from '../validator/level-conditions.validator';

const levelConditions = express.Router();

levelConditions.get(
  '/',
  (req, res, next) => {
    return getListLevelConditions(req.query)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

levelConditions.post(
  '/new-level-conditions',
  isAuthenticated([MODULE.CONFIG]),
  [createLevelConditionsValidator],
  (req, res, next) => {
    return createLevelConditions(req.body)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

levelConditions.put(
  "/update-level-conditions",
  isAuthenticated([MODULE.CONFIG]),
  [createLevelConditionsValidator],
  (req, res, next) => {
    return updateLevelConditions(req.body)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

export function initWebLevelConditionsController(app) {
  app.use("/api/level-conditions", levelConditions);
}
