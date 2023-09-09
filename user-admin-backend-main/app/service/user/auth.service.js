import db from '../../db/models';
import { badRequest, FIELD_ERROR } from '../../config/error';
import Jwt from '../common/jwt.service';
import { getNextUserCode } from '../../util/helper.util';
import { USER_STATUS, USER_CODE } from '../../db/models/user/user';
import { appLog } from '../../config/winston';
import { OTP_CODE_TYPE, ROLE } from '../../constants/common.constant';
import { checkOtpCode, deleteOtpCode, checkUserExisted } from './otp.service';

/**
 * Get user profile
 * @param {*} user
 * @returns
 */
 export async function getAccountInfo(user) {
  try {
    const accountInfo = await db.User.findOne({
      where: {
        id: user.id
      },
      attributes: { exclude: ['password'] },
      include: [
        {
          model: db.UserInformation,
          as: 'userInformation'
        },
        {
          model: db.UserAddress,
          as: 'userAddress'
        },
        {
          model: db.UserReferral,
          as: 'userReferral'
        }
      ]
    });

    if (!accountInfo) {
      throw badRequest('get_user_info', FIELD_ERROR.USER_NOT_FOUND, 'User not found');
    }
    if (accountInfo.status !== USER_STATUS.ACTIVE) {
      throw badRequest('get_user_info', FIELD_ERROR.USER_NOT_ACTIVE, 'User not active.');
    }

    return { ...accountInfo.toJSON()};
  } catch(e) {
    console.log('ERROR_GET_ACCOUNT_INFO: ', e);
    throw e;
  }
}

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
  const user = await model.findOne({
    where: { email }
  });

  if (!user) {
    throw badRequest('credential', FIELD_ERROR.USER_NOT_FOUND, 'User not found');
  }
  if (!model.comparePassword(password, user.password)) {
    throw badRequest('credential', FIELD_ERROR.WRONG_PASSWORD, 'Password is wrong');
  }
  if (user.status !== USER_STATUS.ACTIVE) {
    throw badRequest('credential', FIELD_ERROR.ACCOUNT_NOT_ACTIVE, 'User not active');
  }

  const userJson = { ...user.toJSON()};
  const token = Jwt.sign(userJson);

  await db.UserInformation.update({ lastLogin: new Date }, {
    where: {
      userId: user.id
    }
  });

  return {
    token,
    user: userJson
  }
}

/**
 * Function get genealogy path
 * @param {*} refCode
 * @returns
 */
async function getGenealogyPath(refId) {
  const userRef = await db.UserReferral.findOne({
    where: {
      registerId: refId
    },
    raw: true
  });

  if (userRef) {
    return userRef.genealogyPath;
  }
  return null;
}

/**
 * Register user using email
 * @param {*} registerForm
 * @param {*} origin
 * @returns
 */
export async function registerUserEmail(registerForm) {
  appLog.info(`${JSON.stringify(registerForm)}`);

  await checkUserExisted(registerForm.email, registerForm.phoneCode, registerForm.phoneNumber, registerForm.username);

  // check user referral
  let userRef;
  if (registerForm.referralCode) {
    const refType = registerForm.referralCode.trim().replace(/\d+/g,'');
    if (![USER_CODE].includes(refType)) {
      throw badRequest('register-user-email', FIELD_ERROR.REFERRAL_CODE_INVALID, 'Referral code invalid');
    }
    userRef = await db.User.findOne({
      where: {
        userCode: registerForm.referralCode
      }
    });

    if (!userRef) {
      throw badRequest('register-user-email', FIELD_ERROR.REFERRER_NOT_EXIST_OR_NOT_ACTIVE_EMAIL, 'Referrer does not exist or has not activated email')
    }
  }

  const passwordHash = db.User.hashPassword(registerForm.password);
  const t = await db.sequelize.transaction();

  try {
    const referrerCode = registerForm.referralCode && registerForm.referralCode.trim();
    const userCode = await getNextUserCode(db.User);
    const newUser = await db.User.create({
        userCode: `${USER_CODE}${userCode}`,
        email: registerForm.email,
        username: registerForm.username,
        password: passwordHash,
        status: USER_STATUS.ACTIVE,
        level: 0,
        role: ROLE.USER,
        userInformation: {
          fullName: registerForm.fullName
        }
      },
      {
        include: [
          {
            model: db.UserInformation,
            as: 'userInformation'
          }
        ],
        transaction: t
      }
    );

    if (userRef) {
      const genealogyPath = await getGenealogyPath(userRef.id);

      await db.UserReferral.create({
        registerCode: `${USER_CODE}${userCode}`,
        registerId: newUser.id,
        referrerCode,
        referrerId: userRef.id,
        genealogyPath: genealogyPath ? `${genealogyPath}.${newUser.id}` : `${userRef.id}.${newUser.id}`
      }, {
        transaction: t
      })
    }

    await t.commit();

    return true;
  } catch (e) {
    appLog.error('ERROR_REGISTER_USER_EMAIL: ', e);
    if (t) await t.rollback();
    throw e;
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

  if (password !== rePassword) {
    throw badRequest('password', FIELD_ERROR.PASSWORD_NOT_MATCH, 'Password is not match with re password.');
  }

  const user = await db.User.findOne({ where: { email } })

  if (!user) {
    throw badRequest('update-password', FIELD_ERROR.ACCOUNT_NOT_FOUND, 'Email not found');
  }

  const model = db.User;

  const passwordHash = model.hashPassword(password);
  await model.update({
    password: passwordHash
  }, {
    where: { email }
  });

  await deleteOtpCode({ email, type: OTP_CODE_TYPE.FORGOT_PASSWORD });

  return true;
}