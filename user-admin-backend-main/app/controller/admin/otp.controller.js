import express from 'express';
import { sendOtpCode } from '../../service/admin/otp.service';

import { sendOtpValidator } from '../../validator/otp.validator';

const otp = express.Router();

otp.post('/send', [
    sendOtpValidator
], (req, res, next) => {
    return sendOtpCode(req.body).then(result => {
      res.status(200).json(result);
    }).catch(next);
  });

export function initOtpAdminController(app) {
  app.use('/api/admin/otp', otp );
}