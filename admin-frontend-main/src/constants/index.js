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

export const STATUS_REQUEST = {
  UNAUTHORIZED: 401,
};

export const GLOBAL_STATUS = {
  INACTIVE: 0,
  ACTIVE: 1,
};

export const GLOBAL_FEATURED = {
  INACTIVE: 0,
  ACTIVE: 1,
};

export const USER_GENDER_TYPES = {
  MALE: 0,
  FEMALE: 1,
  OTHER: 2,
};

export const KYC_STATUS = {
  WAITING_VERIFY: 1,
  VERIFIED: 2,
  REJECTED: 3,
  NOT_UPLOAD: -1,
};

export const ACCOUNT_STATUS = {
  ACTIVATE: 1,
  INACTIVATE: 2,
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

export const MASTER_DATA = [
  {value: 1, nameMaster: "Tình trạng đơn hàng"},
  {value: 2, nameMaster: "Cấp bậc người dùng"},
  {value: 3, nameMaster: "Đơn vị sản phẩm"},
  {value: 4, nameMaster: "Dung tích sản phẩm"},
  {value: 5, nameMaster: "Phân quyền"},
  {value: 6, nameMaster: "Điều kiện tăng cấp bậc"},
  {value: 7, nameMaster: "Phần trăm cho người giới thiệu"},
  {value: 8, nameMaster: "Nhà sản xuất"},
];

export const MASTER_DATA_NAME = {
  STATUS_ORDER: 1,
  LEVEL_USER: 2,
  UNIT_PRODUCT: 3,
  CAPACITY_PRODUCT: 4,
  ROLE: 5,
  CONDITIONS_LEVEL: 6,
  PERCENT_REFERRAL: 7,
  ORIGIN: 8,
};

export const STATUS_ORDER = {
  CONFIRMING: 1,
  CONFIRMED: 2,
  SHIPPING: 3,
  DELIVERED: 4,
  REJECT: 5
};

export const ACTION = {
  READ: 'READ',
  CREATE: 'CREATE',
  DELETE: 'DELETE',
  UPDATE: 'UPDATE',
};

export const MODULE_MAP = [
  { id: 1, name: "Dashboard" },
  { id: 2, name: "Sản phẩm" },
  { id: 3, name: "Đơn hàng" },
  { id: 4, name: "Người dùng" },
  { id: 5, name: "Cấu hình" },
  { id: 6, name: "Liên hệ" },
  { id: 7, name: "Tin tức" },
];

export const MODULE = {
  DASHBOARD: 1,
  PRODUCT: 2,
  ORDER: 3,
  USER: 4,
  CONFIG: 5,
  CONTACT: 6,
  NEWS: 7,
};

export const ROLE = {
  ADMIN: 1,
  SALE: 2,
  USER: 3
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

export const CONDITIONS_OPTIONS_MAP = [
  { value: 1, label: "Doanh số" },
  { value: 2, label: "Giới thiệu" },
  { value: 3, label: "Đạt cấp" },
];

export const COMMISSION_TYPE_MAP = [
  { value: 1, label: "Hệ thống tự động" },
  { value: 2, label: "Tuỳ chỉnh" },
];

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
