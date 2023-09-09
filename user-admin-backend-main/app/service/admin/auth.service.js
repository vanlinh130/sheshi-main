import db from '../../db/models';
import { badRequest, FIELD_ERROR } from '../../config/error';
import Jwt from '../common/jwt.service';
import { GLOBAL_STATUS, OTP_CODE_TYPE } from '../../constants/common.constant';
import { checkOtpCode, deleteOtpCode } from './otp.service';

/**
 * User login
 * @param {*} param0
 * @returns
 */
 export async function signIn({ email, password }) {
  const model = db.User;
  if (!email || email.length === 0 || !password || password.length === 0) {
    throw badRequest('credential', FIELD_ERROR.EMAIL_OR_PASSWORD_INVALID, 'Email or password invalid.');
  }
  const admin = await model.findOne({
    where: { email }
  });

  if (!admin) {
    throw badRequest('credential', FIELD_ERROR.USER_NOT_FOUND, 'User not found');
  }
  if (!model.comparePassword(password, admin.password)) {
    throw badRequest('credential', FIELD_ERROR.WRONG_PASSWORD, 'Password is wrong');
  }
  if (admin.status !== GLOBAL_STATUS.ACTIVE) {
    throw badRequest(
      "credential",
      FIELD_ERROR.ACCOUNT_NOT_ACTIVE,
      "User not active"
    );
  }

  const userJson = { ...admin.toJSON()};
  const token = Jwt.sign(userJson);

  await db.UserInformation.update({ lastLogin: new Date }, {
    where: {
      userId: admin.id
    }
  });

  return {
    token,
    user: userJson
  }
}

/**
 * Update password
 * @param {*} param
 * @returns
 */
export async function updatePassword({ email, otpCode, password, rePassword}) {
  // check otp code
  await checkOtpCode({ email, type: OTP_CODE_TYPE.FORGOT_PASSWORD, otpCode });

  const model = db.Admin;
  if (password !== rePassword) {
    throw badRequest('password', FIELD_ERROR.PASSWORD_NOT_MATCH, 'Password is not match with re password.');
  }

  const admin = await model.findOne({ where: { email } })

  if (!admin) {
    throw badRequest('update-password', FIELD_ERROR.ACCOUNT_NOT_FOUND, 'Email not found');
  }

  const passwordHash = model.hashPassword(password);
  await model.update({
    password: passwordHash
  }, {
    where: { email }
  });

  await deleteOtpCode({ email, type: OTP_CODE_TYPE.FORGOT_PASSWORD });

  return true;
}