export const HTTP_ERROR = Object.freeze({
  ACCESS_DENIED: 403,
  NOT_FOUND: 404,
  TIME_OUT: 402,
  BAD_REQUEST: 400,
  NOT_AUTHENTICATE: 401,
  INTERNAL_SERVER_ERROR: 500
});

const SYSTEM_ERROR = Object.freeze(['EACCES', 'EPERM']);

export function isSystemError(err) {
  return err && err.code && SYSTEM_ERROR.indexOf(err.code) >= 0;
}

export class HttpError extends Error {
  constructor(code, message, info) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.code = code;
    this.info = info;
  }
}

export class FieldError {
  constructor(name, code, message) {
    this.name = name;
    this.code = code;
    this.message = message;
  }
}

export class FormError extends HttpError {
  constructor(_errors, status, msg) {
    super(status, msg);
    this.errors = _errors;
  }
}

export const FIELD_ERROR = {
  INVALID: {
    code: 1,
    message: 'INVALID'
  },
  EMAIL_NOT_ACTIVE: {
    code: 2,
    message: 'EMAIL_NOT_ACTIVE'
  },
  USER_NOT_ACTIVE: {
    code: 3,
    message: 'USER_NOT_ACTIVE'
  },
  WRONG_PASSWORD: {
    code: 4,
    message: 'WRONG_PASSWORD'
  },
  USER_NOT_FOUND: {
    code: 5,
    message: 'USER_NOT_FOUND'
  },
  EMAIL_INVALID: {
    code: 6,
    message: 'EMAIL_INVALID'
  },
  EMAIL_NOT_ALLOW_REGISTER: {
    code: 7,
    message: 'EMAIL_NOT_ALLOW_REGISTER'
  },
  INVALID_TOKEN: {
    code: 8,
    message: 'INVALID_TOKEN'
  },
  EMAIL_NOT_FOUND: {
    code: 9,
    message: 'EMAIL_NOT_FOUND'
  },
  EMAIL_EXISTED: {
    code: 10,
    message: 'EMAIL_EXISTED'
  },
  PASSWORD_NOT_MATCH: {
    code: 12,
    message: 'PASSWORD_NOT_MATCH'
  },
  SIGNED_URL_FAILED: {
    code: 13,
    message: 'SIGNED_URL_FAILED'
  },
  UPLOAD_FAILED: {
    code: 14,
    message: 'UPLOAD_FAILED'
  },
  USER_NAME_IS_EXITED: {
    code: 15,
    message: 'USER_NAME_IS_EXITED'
  },
  CURRENT_PASSWORD_NOT_MATCH: {
    code: 16,
    message: 'CURRENT_PASSWORD_NOT_MATCH'
  },
  CURRENT_EMAIL_NOT_MATCH: {
    code: 17,
    message: 'CURRENT_EMAIL_NOT_MATCH'
  },
  CONFIRM_EMAIL_NOT_MATCH: {
    code: 18,
    message: 'CONFIRM_EMAIL_NOT_MATCH'
  },
  NEW_EMAIL_SAME_OLD_EMAIL: {
    code: 19,
    message: 'NEW_EMAIL_SAME_OLD_EMAIL'
  },
  USERNAME_IS_A_REQUIRED_FIELD: {
    code: 20,
    message: 'USERNAME_IS_A_REQUIRED_FIELD'
  },
  USER_NOT_ACTIVE_KYC: {
    code: 21,
    message: 'USER_NOT_ACTIVE_KYC'
  },
  EXISTED: {
    code: 22,
    message: 'EXISTED'
  },
  MERCHANT_NOT_FOUND: {
    code: 23,
    message: 'MERCHANT_NOT_FOUND'
  },
  MERCHANT_NOT_ACTIVE: {
    code: 24,
    message: 'MERCHANT_NOT_ACTIVE'
  },
  OTP_CODE_EXPIRED: {
    code: 25,
    message: 'OTP_CODE_EXPIRED'
  },
  OTP_CODE_INVALID: {
    code: 26,
    message: 'OTP_CODE_INVALID'
  },
  PHONE_OR_EMAIL_IS_REQUIRED: {
    code: 27,
    message: 'PHONE_OR_EMAIL_IS_REQUIRED'
  },
  MERCHANT_NAME_IS_EXISTED: {
    code: 28,
    message: 'MERCHANT_NAME_IS_EXISTED'
  },
  REFERRAL_CODE_INVALID: {
    code: 29,
    message: 'REFERRAL_CODE_INVALID'
  },
  REFERRER_NOT_EXIST_OR_NOT_ACTIVE_EMAIL: {
    code: 30,
    message: 'REFERRER_NOT_EXIST_OR_NOT_ACTIVE_EMAIL'
  },
  EMAIL_OR_PASSWORD_INVALID: {
    code: 31,
    message: 'EMAIL_OR_PASSWORD_INVALID'
  },
  PASSWORD_INVALID: {
    code: 32,
    message: 'PASSWORD_INVALID'
  },
  ACCOUNT_NOT_ACTIVE: {
    code: 33,
    message: 'ACCOUNT_NOT_ACTIVE'
  },
  ACCOUNT_NOT_FOUND: {
    code: 34,
    message: 'ACCOUNT_NOT_FOUND'
  },
  PLEASE_TRY_AGAIN_NEXT_TIME: {
    code: 35,
    message: 'PLEASE_TRY_AGAIN_NEXT_TIME'
  },
  EMAIL_IS_USED: {
    code: 36,
    message: 'EMAIL_IS_USED'
  },
  PHONE_NUMBER_IS_USED: {
    code: 37,
    message: 'PHONE_NUMBER_IS_USED'
  },
  ACCOUNT_HAS_BEEN_VERIFIED: {
    code: 38,
    message: 'ACCOUNT_HAS_BEEN_VERIFIED'
  },
  ACCOUNT_WAITING_FOR_VERIFICATION: {
    code: 39,
    message: 'ACCOUNT_WAITING_FOR_VERIFICATION'
  },
  REFERRER_ACCOUNT_NOT_VERIFIED: {
    code: 40,
    message: 'REFERRER_ACCOUNT_NOT_VERIFIED'
  },
  CANNOT_REQUEST_USER_MERCHANT: {
    code: 41,
    message: 'CANNOT_REQUEST_USER_MERCHANT'
  },
  ACCOUNT_HAS_NOT_BEEN_VERIFIED_KYC: {
    code: 42,
    message: 'ACCOUNT_HAS_NOT_BEEN_VERIFIED_KYC'
  },
  ADDRESS_NOT_FOUND: {
    code: 43,
    message: 'ADDRESS_NOT_FOUND'
  },
  CREATE_ORDER_FAILED: {
    code: 44,
    message: 'CREATE_ORDER_DETAIL_FAILED'
  },
  PRODUCT_NOT_FOUND: {
    code: 45,
    message: 'PRODUCT_NOT_FOUND'
  },
  QUANTITY_NOT_ENGOUGH: {
    code: 46,
    message: 'QUANTITY_NOT_ENGOUGH'
  },
  ORDER_CODE_AND_EMAIL_IS_REQUIRED: {
    code: 47,
    message: 'ORDER_CODE_AND_EMAIL_IS_REQUIRED'
  },
  ADMIN_NOT_FOUND: {
    code: 48,
    message: 'USER_NOT_FOUND'
  },
  ORDER_NOT_FOUND: {
    code: 49,
    message: 'ORDER_NOT_FOUND'
  },
  CREATE_PRODUCT_FAILED: {
    code: 50,
    message: 'CREATE_PRODUCT_FAILED'
  },
  SLUG_IS_EXISTS: {
    code: 51,
    message: 'SLUG_IS_EXISTS'
  },
  MASTER_NOT_FOUND: {
    code: 52,
    message: 'MASTER_NOT_FOUND'
  },
  EXIST_GROUP_ROLE: {
    code: 53,
    message: 'EXIST_GROUP_ROLE'
  },
  EXIST_COMMMISSION: {
    code: 54,
    message: 'EXIST_COMMMISSION'
  },
  EXIST_LEVEL_CONDITIONS: {
    code: 55,
    message: 'EXIST_LEVEL_CONDITIONS'
  },
  NOT_ENOUGH_BONUS_WITHDRAW: {
    code: 56,
    message: 'NOT_ENOUGH_BONUS_WITHDRAW'
  },
  BAD_REQUEST: {
    code: 400,
    message: 'BAD_REQUEST'
  },
  NOT_AUTHENTICATE: {
    code: 401,
    message: 'NOT_AUTHENTICATE'
  },
  FORBIDDEN_ERROR: {
    code: 403,
    message: 'FORBIDDEN_ERROR'
  },
  RESOURCE_NOT_FOUND: {
    code: 404,
    message: 'RESOURCE_NOT_FOUND'
  },
  INTERNAL_SERVER_ERROR: {
    code: 500,
    message: 'INTERNAL_SERVER_ERROR'
  },
  SERVICE_UNAVAILABLE: {
    code: 503,
    message: 'SERVICE_UNAVAILABLE'
  }
};

export function badRequest(name, code, message) {
  return new FormError({ name, code, message }, FIELD_ERROR.BAD_REQUEST.code, FIELD_ERROR.BAD_REQUEST.message);
}

export function notFoundRequest(name, code, message) {
  return new FormError({ name, code, message }, FIELD_ERROR.BAD_REQUEST.code, FIELD_ERROR.BAD_REQUEST.message);
}
