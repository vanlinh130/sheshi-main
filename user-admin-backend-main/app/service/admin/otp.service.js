import db from '../../db/models';
import { OTP_CODE_TYPE } from "../../constants/common.constant";
import { generateVerifyCode } from "../../util/helper.util";
import { mailAwsService } from "../common/ses.service";
import { badRequest, FIELD_ERROR } from "../../config/error";
import { OTP_STATUS } from '../../db/models/otp';
import { ADMIN_STATUS } from '../../db/models/admin/admin';

/**
 * Check user and merchant not exist
 * @param {*} email
 * @param {*} phoneCode
 * @param {*} phoneNumber
 */
async function checkAdminNotExist(email) {
    if (email) {
        // check User
        const user = await db.Admin.findOne({ where: { email, status: ADMIN_STATUS.ACTIVE }});
        if (!user) {
            throw badRequest('send-email-otp', FIELD_ERROR.ACCOUNT_NOT_FOUND, 'Email not found');
        }
    }
}

/**
 * Send otp code
 * @param {*} param0
 * @returns
 */
export async function sendOtpCode({ email, phoneCode, phoneNumber, type }) {
  try {
      const phone = `+${phoneCode}${phoneNumber}`;
      const key = `${type}_${(email && email.trim()) || phone}`;

      const getKey = await db.OTP.findOne({
        where: {
          key: key,
          status: OTP_STATUS.ACTIVE
        }
      });

      if (getKey) {
        await db.OTP.update({status: OTP_STATUS.DELETE, deletedAt: new Date()}, {
          where: {
            key: key
          }
        });
      }

      let subject;
      switch(type) {
          case OTP_CODE_TYPE.FORGOT_PASSWORD: {
              subject = 'Reset password';
              await checkAdminNotExist(email);
              break;
          }
          default:
              subject = 'Verify email';
      }

      const code = generateVerifyCode();
      await db.OTP.create({
        key,
        code,
        status: OTP_STATUS.ACTIVE
      });

      if (email) {
          const toEmails = [email];
          const params = { code };
          const templateName = 'otp-code-template';
          await mailAwsService.sendMail({ toEmails, subject, templateName, params });
      }

      return true;
  } catch (e) {
      console.log('EVENT_ERROR_SEND_OTP: ', e);
      throw e;
  }
}

/**
 * Check otp code
 * @param {*} param0
 * @returns
 */
export async function checkOtpCode({ email, phone, type, otpCode }) {
    const key = `${type}_${email || phone}`;

    const getOtpCode = await db.OTP.findOne({
      where: {
        key,
        status: OTP_STATUS.ACTIVE
      }
    });

    if (!getOtpCode) {
      throw badRequest('check-otp-code', FIELD_ERROR.OTP_CODE_EXPIRED, 'OTP code expired');
    }
    if (otpCode !== getOtpCode.code) {
        throw badRequest('check-otp-code', FIELD_ERROR.OTP_CODE_INVALID, 'OTP code invalid');
    }

    return getOtpCode.code;
}

/**
 * Delete otp code
 * @param {*} param0
 */
export async function deleteOtpCode({ email, phone, type }) {
    const key = `${type}_${email || phone}`;
    await db.OTP.update({status: OTP_STATUS.DELETE, deletedAt: new Date()}, {
      where: {
        key: key
      }
    });
}