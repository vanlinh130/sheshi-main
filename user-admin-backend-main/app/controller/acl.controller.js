import express from 'express';
import { createRoleModule, deleteRoleModule, getAclActionWithModuleId, getListAcl } from '../service/acl.service';
import { successResponse } from '../util/response.util';
import { isAuthenticated } from '../middleware/permission';
import { MODULE } from '../constants/common.constant';
import { createRoleModuleValidator, deleteRoleModuleValidator } from '../validator/acl.validator';

const acl = express.Router();

acl.get("/", (req, res, next) => {
  return getListAcl(req.query)
    .then((t) => successResponse(res, t))
    .catch(next);
});

acl.get("/get-acl-with-module/:moduleId", (req, res, next) => {
  return getAclActionWithModuleId(req.params.moduleId)
    .then((t) => successResponse(res, t))
    .catch(next);
});

acl.put(
  "/delete-role-module",
  [isAuthenticated([MODULE.CONFIG]), deleteRoleModuleValidator],
  async (req, res, next) => {
    return deleteRoleModule(req.body)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

acl.post(
  "/create-role-module",
  [isAuthenticated([MODULE.CONFIG]), createRoleModuleValidator],
  async (req, res, next) => {
    return createRoleModule(req.body)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);
export function initAclController(app) {
  app.use('/api/acl', acl );
}