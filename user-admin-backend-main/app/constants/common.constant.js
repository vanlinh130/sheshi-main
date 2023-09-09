module.exports.FILE_TYPES = [
    'image/jpeg',
    'image/gif',
    'image/png',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv', 'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/pdf'
];

module.exports.VALIDATOR_TYPE = Object.freeze({
  BODY: 'body',
  PARAMS: 'params',
  QUERY: 'query'
});

module.exports.ACTIVE_MAIL_EXPIRED = 60; // 60 minutes

module.exports.CHANGE_MAIL_EXPIRED = 60; // 60 minutes

module.exports.RESET_PASSWORD_EXPIRED = 30; // 30 minutes

module.exports.S3_FOLDERS = {
  DEFAULT: 'files'
};

module.exports.DATE_FORMAT = 'YYYY-MM-DD HH:mm:ssZ';

module.exports.OTP_CODE_LENGTH = 6;

module.exports.VERIFY_EMAIL_EXPIRED = 60; // 60 SECONDS

module.exports.OTP_CODE_EXPIRED = 60; // 60 seconds

module.exports.MIN_LENGTH_PHONE = 9;

module.exports.MAX_LENGTH_PHONE = 20;

export const OTP_CODE_TYPE = {
  REGISTER_EMAIL: 'register_email',
  REGISTER_PHONE: 'register_phone',
  FORGOT_PASSWORD: 'forgot_password'
}

export const GLOBAL_STATUS = {
  INACTIVE: 0,
  ACTIVE: 1
};

export const GLOBAL_SWITCH = {
  OFF: 0,
  ON: 1
};

export const STATUS_ORDER = {
  CONFIRMING: 1,
  CONFIRMED: 2,
  SHIPPING: 3,
  DELIVERED: 4,
  PENDING: 5
};

export const CONTACT_PAGE = {
  CONTRACT: 1,
  ADDRESS_FOOTER: 2
};

export const MODULE = {
  DASHBOARD: 1,
  PRODUCT: 2,
  ORDER: 3,
  USER: 4,
  CONFIG: 5,
  CONTACT: 6,
  NEWS: 7
};

export const CONTENT_PAGE = {
  INTRODUCE_PAGE: 1,
  INTRODUCE_PAGE_STORY: 2,
  INTRODUCE_PAGE_CUSTOMER: 3,
  SCHOOL_PAGE_OVERVIEW: 4,
  SCHOOL_PAGE_PROCESS: 5
};

export const SLIDE_PAGE = {
  HOME_PAGE_MAIN_PC: 1,
  HOME_PAGE_MAIN_SMARTPHONE: 2,
  HOME_PAGE_ADVERTMENT: 3,
  SCHOOL_PAGE: 4
};

export const ROLE = {
  ADMIN: 1,
  SALE: 2,
  USER: 3
};

export const MASTER_DATA_NAME = {
  STATUS_ORDER: 1,
  LEVEL_USER: 2,
  UNIT_PRODUCT: 3,
  CAPACITY_PRODUCT: 4,
  ROLE: 5,
  CONDITIONS_LEVEL: 6,
  PERCENT_REFERRAL: 7
};

export const COMMISSION_TYPE = {
  AUTOMATION: 1,
  MANUAL: 2
};

export const BONUS_TYPE = {
  RECEIVER: 1,
  WITHDRAW: 2,
  REQUEST: 3,
  REJECT: 4
};

export const DELIVERY_METHOD_MAP = [
  { value: 1, label: "Giao hàng nhanh" },
  { value: 2, label: "Giao hàng tiết kiệm" }
];

export const PAYMENT_METHOD_MAP = [
  { value: 0, label: "Thanh toán bằng tiền mặt" },
  { value: 1, label: "Thanh toán bằng Momo" },
  { value: 2, label: "Thanh toán bằng VNPay" }
];
