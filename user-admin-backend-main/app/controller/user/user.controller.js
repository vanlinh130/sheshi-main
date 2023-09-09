import express from 'express';
import { MODULE } from '../../constants/common.constant';
import { pagingParse } from '../../middleware/paging.middleware';
import { isAuthenticated } from '../../middleware/permission';
import {
  deleteUserAddress,
  geMyBonus,
  getListBonus,
  getListReferalUser,
  getListUser,
  getMyReferrer,
  getTopUserReferrer,
  getTotalBonus,
  getUserByUserCode,
  getUserDetail,
  registerUserAddress,
  setDefaultAddress,
  updateLevelUser,
  updateTypeUser,
  updateUserAddress,
  updateUserProfile,
  withdrawBonusUser
} from "../../service/user/user.service";
import { successResponse } from '../../util/response.util';
import {
  updateUserProfileValidator,
  registUserAddressValidator,
  setLevelUserValidator,
  withdrawBonusValidator,
  updateTypeValidator
} from '../../validator/user.validator';

const user = express.Router();

user.put(
  '/:id',
  [isAuthenticated(), updateUserProfileValidator],
  (req, res, next) => {
    return updateUserProfile(req.user, req.body)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

user.put(
  '/set-level-user/level',
  [setLevelUserValidator],
  (req, res, next) => {
    return updateLevelUser(req.body)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

user.post(
  '/register-user-address',
  [isAuthenticated(), registUserAddressValidator],
  async (req, res, next) => {
    return registerUserAddress(req.user, req.body)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

user.put(
  '/update-user-address/:id',
  [isAuthenticated(), registUserAddressValidator],
  async (req, res, next) => {
    return updateUserAddress(req.params.id, req.user, req.body)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

user.put(
  '/set-default-address/:id',
  [isAuthenticated()],
  async (req, res, next) => {
    return setDefaultAddress(req.params.id, req.user)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

user.delete(
  '/delete-address/:id',
  [isAuthenticated()],
  async (req, res, next) => {
    return deleteUserAddress(req.params.id)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

user.get(
  '/',
  [pagingParse({ column: 'id', dir: 'desc' })],
  [isAuthenticated([MODULE.USER, MODULE.DASHBOARD])],
  (req, res, next) => {
    return getListUser(req.query, req.paging)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

user.get(
  '/top-user-referrer',
  [isAuthenticated([MODULE.USER, MODULE.DASHBOARD])],
  (req, res, next) => {
    return getTopUserReferrer()
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

user.get(
  '/user-with-user-code',
  (req, res, next) => {
    return getUserByUserCode(req.query)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

user.get('/detail/:userId',
 isAuthenticated([MODULE.USER]),
 (req, res, next) => {
  return getUserDetail(req.params.userId)
    .then((t) => successResponse(res, t))
    .catch(next);
});

user.get('/my-referrer/:id', (req, res, next) => {
  return getMyReferrer(req.params.id)
    .then((t) => successResponse(res, t))
    .catch(next);
});

user.get('/count-referrer-with-level', (req, res, next) => {
  return getListReferalUser(req.query)
    .then((t) => successResponse(res, t))
    .catch(next);
});

user.get('/count-total-bonus', (req, res, next) => {
  return getTotalBonus(req.query)
    .then((t) => successResponse(res, t))
    .catch(next);
});
user.get('/list-bonus', (req, res, next) => {
  return getListBonus(req.query)
    .then((t) => successResponse(res, t))
    .catch(next);
});
user.get("/my-bonus", [isAuthenticated()], (req, res, next) => {
  return geMyBonus(req.user)
    .then((t) => successResponse(res, t))
    .catch(next);
});
user.post(
  "/withdraw-bonus",
  [isAuthenticated([MODULE.CONFIG]), withdrawBonusValidator],
  (req, res, next) => {
    return withdrawBonusUser(req.body)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);
user.put(
  "/update-type-bonus/:id",
  [isAuthenticated([MODULE.CONFIG]), updateTypeValidator],
  (req, res, next) => {
    console.log(req);
    return updateTypeUser(req.params.id, req.body)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);
export function initWebUserController(app) {
  app.use('/api/user/user-info', user);
}
