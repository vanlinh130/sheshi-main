import randomstring from 'randomstring';
import _ from 'lodash';

import { OTP_CODE_LENGTH } from '../constants/common.constant';

/**
 * Function generate otp code
 * @returns
 */
 export function generateVerifyCode() {
  return randomstring.generate({
    length: OTP_CODE_LENGTH,
    charset: 'numeric',
    readable: true
  }).toString();
}

/**
 * Function create User code
 * @param {*} model
 * @param {*} length
 * @returns
 */
 export async function getNextUserCode(model, length = 6) {
  const lastRecord = await model.findAll({
    order: [['id', 'DESC']],
    limit: 1,
    plain: true,
    raw: true,
    paranoid: false
  });
  let code;
  if (lastRecord) {
    code = +lastRecord.userCode.match(/\d+/g,'')[0];
  }

  let next = _.toString((_.toNumber(code || 0) + 1));
  if (next.length < length) {
    next = _.padStart(_.toString(next), length, '0');
  }
  return next;
}

/**
 * Function create User code
 * @param {*} model
 * @param {*} length
 * @returns
 */
 export async function getNextOrderCode(model, length = 6) {
  const lastRecord = await model.findAll({
    order: [['id', 'DESC']],
    limit: 1,
    plain: true,
    raw: true,
    paranoid: false
  });
  let code;
  if (lastRecord) {
    code = +lastRecord.orderCode.match(/\d+/g,'')[0];
  }

  let next = _.toString((_.toNumber(code || 0) + 1));
  if (next.length < length) {
    next = _.padStart(_.toString(next), length, '0');
  }
  return next;
}
