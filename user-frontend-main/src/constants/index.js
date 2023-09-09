export const TYPE_TRADE = {
  BUY: 1,
  SeLL: 2,
};

export const OTP_CODE_TYPE = {
  REGISTER_EMAIL: "register_email",
  REGISTER_PHONE: "register_phone",
  FORGOT_PASSWORD: "forgot_password",
};

export const MODE_THEME = {
  LIGHT: "light",
  DARK: "dark",
};

export const PATHS_LOCAL = {
  CITIES: "/locations/cities.json",
  DISTRICTS: "/locations/districts",
  WARDS: "/locations/wards",
  LOCATION: "/locations/location.json",
};

export const LOGIN_TYPE = {
  USER: 1,
  MERCHANT: 2,
};

export const STATUS_REQUEST = {
  UNAUTHORIZED: 401,
};

export const ROLE = {
  USER: 1, // Uxxxxx
  USER_MERCHANT: 2, // UMxxxxx,
  MERCHANT: 3, // Mxxxx
};

export const KYC_STATUS = {
  WAITING_VERIFY: 1,
  VERIFIED: 2,
  REJECTED: 3,
};

export const REQUEST_UM_STATUS = {
  NONE: -1,
  WAITING_CONFIRM: 1,
  VERIFIED: 2,
  REJECTED: 3,
};

export const IMAGE_TYPE = {
  SUB: 0,
  MAIN: 1
};

export const GLOBAL_STATUS = {
  INACTIVE: 0,
  ACTIVE: 1,
};

export const MASTER_DATA_NAME = {
  STATUS_ORDER: 1,
  LEVEL_USER: 2,
  UNIT_PRODUCT: 3,
  CAPACITY_PRODUCT: 4,
  ROLE: 5,
  CONDITIONS_LEVEL: 6,
  PERCENT_REFERRAL: 7,
};

export const STATUS_ORDER = {
  WAITTING_CONFIRM: 1,
  CONFIRMED: 2,
  SHIPPING: 3,
  DELIVERED: 4,
  REJECT: 5,
};

export const CONTACT_PAGE = {
  CONTRACT: 1,
  ADDRESS_FOOTER: 2
};

export const CONTENT_PAGE = {
  INTRODUCE_PAGE: 1,
  INTRODUCE_PAGE_STORY: 2,
  INTRODUCE_PAGE_CUSTOMER: 3,
  SCHOOL_PAGE_OVERVIEW: 4,
  SCHOOL_PAGE_PROCESS: 5,
  POLICY_PAGE_GUIDE: 6,
  POLICY_PAGE_RETURN: 7,
  POLICY_PAGE_DELIVER: 8,
  POLICY_PAGE_SECURITY: 9,
};

export const SLIDE_PAGE = {
  HOME_PAGE_MAIN_PC: 1,
  HOME_PAGE_MAIN_SMARTPHONE: 2,
  HOME_PAGE_ADVERTMENT: 3,
  SCHOOL_PAGE: 4
};

export const COMMISSION_TYPE = {
  AUTOMATION: 1,
  MANUAL: 2,
};

export const BONUS_TYPE = {
  RECEIVER: 1,
  WITHDRAW: 2,
  REQUEST: 3,
  REJECT: 4
};

export const BONUS_TYPE_MAP = [
  { value: 1, label: "Nhận hoa hồng" },
  { value: 2, label: "Rút hoa hồng" },
  { value: 3, label: "Yêu cầu rút" },
  { value: 4, label: "Yêu cầu bị từ chối" },
];

export const DELIVERY_METHOD_MAP = [
  { value: 1, label: "Giao hàng nhanh" },
  { value: 2, label: "Giao hàng tiết kiệm" },
];

export const PAYMENT_METHOD_MAP = [
  { value: 0, label: "Thanh toán bằng tiền mặt" },
  { value: 1, label: "Thanh toán bằng Momo" },
  { value: 2, label: "Thanh toán bằng VNPay" },
];

export const TOKEN_API = {
  GIAO_HANG_TIET_KIEM: "A947Fb917eF4D78C188DAa2CdBa2354a0f6FF570",
  GIAO_HANG_NHANH: "92565b32-00d1-11ed-8636-7617f3863de9",
};

