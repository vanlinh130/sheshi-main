import express from 'express';
import {
  signIn,
  updatePassword
} from '../../service/admin/auth.service';
import {
  loginValidator,
  resetPasswordValidator
} from '../../validator/auth.validator';
import { successResponse } from '../../util/response.util';

const auth = express.Router();

auth.post('/sign-in', loginValidator, async (req, res, next) => {
  return signIn(req.body)
    .then((t) => successResponse(res, t))
    .catch(next);
});

auth.post(
  '/forgot-password/reset',
  resetPasswordValidator,
  (req, res, next) => {
    return updatePassword(req.body)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

export function initWebAuthAdminController(app) {
  app.use('/api/admin/auth', auth);
}
