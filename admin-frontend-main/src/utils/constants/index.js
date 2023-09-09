import MainIcon from "@/resources/images/logo/logo-small.png";

const COIN_SYSTEM = {
  NORMAL: MainIcon,
  CODE: "DDF",
};

export const MODE_THEME = {
  LIGHT: "light",
  DARK: "dark",
};

const FROM_TIME = "YYYY/MM/DD HH:mm:ss";

const OPTION_MONTH = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const ADMIN_TYPES = {
  SUPER_ADMIN: 0,
  MERCHANT_PIC: 1,
};

const COINS = {
  DDF: "DDF",
  BNB: "BNB",
  BTC: "BTC",
  ETH: "ETH",
  TRX: "TRX",
  USDT: "USDT",
  XRP: "XRP",
  XLM: "XLM",
  C98: "C98",
  AXS: "AXS",
  ADA: "ADA",
  DOT: "DOT",
  OKB: "OKB",
  DAI: "DAI",
  UNI: "UNI",
  DEAL_FM: "DEAL_FM",
  CPNB: "CPNB",
  VNDT: "VNDT",
};

const RANK = ["NONE", "BEGINNER", "SILVER", "GOLD", "RUBY", "DIAMOND", "CROWN"];

const RANK_IMG = {
  1: "/assets/images/beginer.png",
  2: "/assets/images/silver.png",
  3: "/assets/images/gold.png",
  4: "/assets/images/ruby.png",
  5: "/assets/images/diamond.png",
  6: "/assets/images/crown.png",
};

const KYC_STATUS = {
  NOT_VERIFIED: 0,
  WAITING: 1,
  APPROVE: 2,
  REJECT: 3,
  KYC_KEYCLOAK: 4,
};

const DEPOSIT_REQUEST_STATUS = {
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2,
  CANCELED: 3,
};

const OPTION_KYC = [
  { name: "not-verify", value: 0 },
  { name: "waiting", value: 1 },
  { name: "verified", value: 2 },
  { name: "reject", value: 3 },
];

const OTP_CODE = 6;

const TIME_OTP = 30;

const MASTER_DATA_KEYS = {
  DRAFT_KEY: "DRAFT_KEY",
};

const FAQ_TYPES = {
  GENERAL: 0,
  PAYMENT: 1,
  WITHDRAW: 2,
  OTHER: 3,
};

const OTP_TYPES = {
  ADMIN_WALLET: "ADMIN_WALLET",
};

const INTERNAL_WALLET_TYPE = {
  CASH: 1,
  CONSUMER: 2,
  STOCK: 3,
};

const CRYPTO_WALLET_TYPE = {
  DDFM: 1,
  ETH: 2,
  TRX: 3,
  BTC: 4,
  XRP: 5,
  BNB: 6,
  USDT: 7,
};

const TRANSACTION_TYPES = {
  DEPOSIT: 1,
  WITHDRAW: 2,
  STAKING: 3,
  TRANSFER: 4,
  RECEIVE: 5,
  SEND_TO_ADMIN: 6,
};

const USER_GENDER_TYPES = {
  MALE: 0,
  FEMALE: 1,
  OTHER: 2,
};

const WALLET_TYPES = {
  CASH: 1,
  CONSUMER: 2,
  STOCK: 3,
};

var regex = /(&nbsp;|<([^>]+)>)/gi;

var regexUrl = /\s/g;

const TYPE_ADMIN = 2;

const ADMIN_WALLET_TYPE = {
  DEPOSIT: 1,
  WITHDRAW: 2,
};

const ADMIN_TRANSACTION_TYPE = {
  TRANSFER_FEE: 0,
  WITHDRAW: 1,
};

const WALLET_TYPE = {
  DDF: 0,
  VNDT: 1,
  DEAL_FM: 2,
  CPNB: 3,
  BNB: 4,
  USDT: 5,
};
const INTERNAL_WALLET_CODE = {
  VNDT: "DDF/VNDT",
  USDT: "DDF/USDT",
  BNB: "DDF/BNB",
  DEAL_FM: "DEAL_FM/DDF",
};

const STATUS = {
  PENDING: 1,
  APPROVED: 2,
  REJECTED: 3,
};

const AGE = {
  MIN: 0,
  MAX: 9999,
};

const PASSWORD_LENGTH = {
  MIN: 6,
  MAX: 30,
};

const SYSTEM_TYPE = {
  TRADE_BONUS: 1,
  REF_BONUS: 2,
};

export {
  COIN_SYSTEM,
  FROM_TIME,
  OPTION_MONTH,
  RANK,
  RANK_IMG,
  KYC_STATUS,
  OPTION_KYC,
  OTP_CODE,
  TIME_OTP,
  DEPOSIT_REQUEST_STATUS,
  ADMIN_TYPES,
  COINS,
  MASTER_DATA_KEYS,
  FAQ_TYPES,
  OTP_TYPES,
  TRANSACTION_TYPES,
  USER_GENDER_TYPES,
  WALLET_TYPES,
  INTERNAL_WALLET_TYPE,
  CRYPTO_WALLET_TYPE,
  regex,
  regexUrl,
  TYPE_ADMIN,
  ADMIN_WALLET_TYPE,
  ADMIN_TRANSACTION_TYPE,
  WALLET_TYPE,
  INTERNAL_WALLET_CODE,
  STATUS,
  AGE,
  PASSWORD_LENGTH,
  SYSTEM_TYPE,
};
