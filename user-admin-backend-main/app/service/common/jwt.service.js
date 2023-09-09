import jwt from 'jsonwebtoken';
import {} from 'dotenv/config';

class JsonWebToken {
  /**
   * sign new jwt
   * @param data
   * @param key
   * @param expiresIn
   * @returns {undefined|*|number|PromiseLike<ArrayBuffer>}
   */
  sign (data, key = process.env.JWT_SECRET, expiresIn = process.env.JWT_EXPIRED) {
    return jwt.sign(data, key, { expiresIn });
  }

  /**
   * verify json web token
   * @param token
   * @param key
   * @returns {{data: object, success: boolean }}
   */
  verify (token, key = process.env.JWT_SECRET) {
    let data = null;
    let success = true;
    try {
      data = jwt.verify(token, key);
    } catch (e) {
      success = false;
    }
    return { success, data };
  }

  /**
   * decrypt jwt to get payload
   * @param token
   * @returns {null|{payload, signature, header}|Promise<void>|string}
   */
  decrypt (token) {
    return jwt.decode(token);
  }
}

module.exports = new JsonWebToken();
