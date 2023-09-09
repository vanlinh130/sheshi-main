import express from 'express';
import { pagingParse } from '../middleware/paging.middleware';
import { successResponse } from '../util/response.util';
import { isAuthenticated } from '../middleware/permission';
import { createContract, getListContract, updateContract } from '../service/contract.service';
import { createContractValidator, updateContractValidator } from '../validator/contract.validator';
import { MODULE } from '../constants/common.constant';

const contract = express.Router();

contract.get(
  '/',
  [pagingParse({ column: 'id', dir: 'desc' })],
  (req, res, next) => {
    return getListContract(req.query, req.paging)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

contract.post(
  '/new-contract',
  [createContractValidator],
  (req, res, next) => {
    return createContract(req.body)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

contract.put(
  '/update-contract',
  isAuthenticated([MODULE.CONTACT]),
  [updateContractValidator],
  (req, res, next) => {
    return updateContract(req.body)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

export function initWebContractController(app) {
  app.use("/api/contract", contract);
}
