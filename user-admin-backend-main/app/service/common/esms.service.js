import parsePhoneNumber from 'libphonenumber-js';
import axios from 'axios';
import qs from 'querystring';

export class SmsService {
  constructor() {
    this.baseApiDomain = 'http://rest.esms.vn/MainService.svc/json';
    this.apis = {
      sendSms: `${this.baseApiDomain}/SendMultipleMessage_V4_get`,
    };

    this.info = {
      ApiKey: getEnv('ESMS_API_KEY'),
      SecretKey: getEnv('ESMS_SECRET_KEY'),
      SmsType: 2,
      BrandName: getEnv('ESMS_BRANCH_NAME'),
      VoiceBrandName: getEnv('ESMS_VOICE_BRANCH_NAME'),
      Hotline: getEnv('ESMS_HOTLINE'),
      IsUnicode: false,
    };
  }

  static getPhoneNumberInfo({ phone, phoneCode }) {
    const _phoneCode = phoneCode.indexOf('+') === 0 ? phoneCode : `+${phoneCode}`;
    const fullPhone = _phoneCode + phone;
    const phoneInfo = parsePhoneNumber(fullPhone, _phoneCode);
    return phoneInfo && phoneInfo.isValid() ? phoneInfo : null;
  }

  static isValid({ phone, phoneCode }) {
    return !!SmsService.getPhoneNumberInfo({ phone, phoneCode });
  }

  getRegisterSms(code) {
    return `Su dung ma OTP: ${code} de tiep tuc thuc hien thao tac tren DDF Exchange - ${this.info.BrandName}. To continue using DDF Exchange - ${this.info.BrandName}, enter the OTP code: ${code}.`;
  }

  getContentVoice(code) {
    return `Ma OTP cua ban la: ${code}`;
  }

  /**
   * @description Send sms
   * @param {String} phone
   * @param {String} phoneCode
   * @param {String} code
   * @param {Boolean} is_voice
   */
  async sendSms({ phone, phoneCode = '+84' }, code, isVoice = true) {
    try {
      const phoneInfo = SmsService.getPhoneNumberInfo({ phone, phoneCode });
      // const _phoneNumber = '0' + phoneNumber.slice(3); // parse from +84938... -> 0938
      const _phoneNumber = phoneInfo.number;
      console.log({
        'Phone': _phoneNumber,
        'Content': isVoice ? this.getContentVoice(code) : this.getRegisterSms(code),
        'ApiKey': this.info.ApiKey,
        'SecretKey': this.info.SecretKey,
        'IsUnicode': this.info.IsUnicode,
        'Brandname': isVoice ? this.info.VoiceBrandName : this.info.BrandName,
        'SmsType': this.info.SmsType,
        'CallbackUrl': '',
      });
      await axios.get(this.apis.sendSms + '?' + qs.stringify({
        'Phone': _phoneNumber,
        'Content': isVoice ? this.getContentVoice(code) : this.getRegisterSms(code),
        'ApiKey': this.info.ApiKey,
        'SecretKey': this.info.SecretKey,
        'IsUnicode': this.info.IsUnicode,
        'Brandname': isVoice ? this.info.VoiceBrandName : this.info.BrandName,
        'SmsType': this.info.SmsType,
        'CallbackUrl': '',
      }));
    } catch (error) {
      console.log('ERROR_SEND_SMS_SERVICE: ', error);
      throw error;
    }
  }
}

export const smsService = new SmsService();
