import express from 'express';
import {isAuthenticated} from '../../middleware/permission';
import {
  registerUserEmail,
  signIn,
  updatePassword,
  getAccountInfo
} from '../../service/user/auth.service';
import {
  loginValidator,
  registerUserValidator,
  resetPasswordValidator
} from '../../validator/auth.validator';
import { successResponse } from '../../util/response.util';

const auth = express.Router();

auth.get('/information', isAuthenticated(), (req, res, next) => {
  return getAccountInfo(req.user).then(resp => res.status(200).json(resp)).catch(next);
});

auth.post('/register-user-email', registerUserValidator, async (req, res, next) => {
  return registerUserEmail(req.body)
    .then(t => successResponse(res, t))
    .catch(next);
});

auth.post('/sign-in', loginValidator, async (req, res, next) => {
  return signIn(req.body).then(resp => res.status(200).json(resp)).catch(next);
});

auth.post('/forgot-password/reset', resetPasswordValidator, (req, res, next) => {
  return updatePassword(req.body).then(result => {
    res.status(200)
      .json(result);
  }).catch(next);
});

export function initWebAuthController(app) {
  app.use('/api/user/auth', auth);
}
