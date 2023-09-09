import express from 'express';
import { pagingParse } from '../middleware/paging.middleware';
import { successResponse } from '../util/response.util';
import { isAuthenticated } from '../middleware/permission';
import { createMaster, deleteMaster, getListMaster, getMaster, updateMaster } from '../service/master.service';
import { createMasterValidator, deleteMasterValidator, updateMasterValidator } from '../validator/master.validator';
import { MODULE } from '../constants/common.constant';

const master = express.Router();

master.get(
  '/',
  [pagingParse({ column: 'id', dir: 'desc' })],
  (req, res, next) => {
    return getListMaster(req.query, req.paging)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

master.get(
  "/get-master",
  (req, res, next) => {
    return getMaster(req.query)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

master.post(
  '/new-master',
  isAuthenticated([MODULE.CONFIG]),
  [createMasterValidator],
  (req, res, next) => {
    return createMaster(req.body)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

master.put(
  '/update-master',
  isAuthenticated([MODULE.CONFIG]),
  [updateMasterValidator],
  (req, res, next) => {
    return updateMaster(req.body)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

master.delete(
  '/delete-master',
  isAuthenticated([MODULE.CONFIG]),
  [deleteMasterValidator],
  (req, res, next) => {
    return deleteMaster(req.body)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

export function initWebMasterController(app) {
  app.use("/api/master", master);
}
