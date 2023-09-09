import express from 'express';
import { successResponse } from '../util/response.util';
import { isAuthenticated } from '../middleware/permission';
import { MODULE } from '../constants/common.constant';
import { createCommission, createCommissionLevel, getListCommission, getListCommissionLevel, updateCommission } from '../service/commission.service';
import { createCommissionLevelValidator, createCommissionValidator, updateCommissionValidator } from "../validator/commission.validator";

const commission = express.Router();

commission.get(
  '/',
  (req, res, next) => {
    return getListCommission(req.query)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);
commission.get("/get-commission-level", (req, res, next) => {
  return getListCommissionLevel(req.query)
    .then((t) => successResponse(res, t))
    .catch(next);
});

commission.post(
  "/new-commission",
  isAuthenticated([MODULE.CONFIG]),
  [createCommissionValidator],
  (req, res, next) => {
    return createCommission(req.body)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

commission.post(
  "/new-commission-level",
  isAuthenticated([MODULE.CONFIG]),
  [createCommissionLevelValidator],
  (req, res, next) => {
    return createCommissionLevel(req.body)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

commission.put(
  "/update-commission",
  isAuthenticated([MODULE.CONFIG]),
  [updateCommissionValidator],
  (req, res, next) => {
    return updateCommission(req.body)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

export function initWebCommissionController(app) {
  app.use("/api/commission", commission);
}