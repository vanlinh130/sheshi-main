import AWS from 'aws-sdk';
import {} from 'dotenv/config';
import { v4 as uuidv4 } from 'uuid';
import { FIELD_ERROR } from '../../config/error';
import { S3_FOLDERS } from '../../constants/common.constant';

let s3Config = {
  signatureVersion: 'v4',
  region: process.env.S3_REGION
};

if (process.env.NODE_ENV === 'local') {
  s3Config = {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    signatureVersion: 'v4',
    region: process.env.S3_REGION
  };
}

const s3 = new AWS.S3(s3Config);

const { S3_BUCKET, S3_ENDPOINT } = process.env;

class S3Service {
  /**
   * uploadFileToS3
   *
   * @param file
   * @param ACL
   * @param bucket
   * @param folderName
   * @returns {Promise}
   */
  async uploadFileToS3 ({ file, ACL, bucket = S3_BUCKET, folderName = S3_FOLDERS.DEFAULT }) {
    const params = { Bucket: bucket };
    ACL && (params.ACL = ACL);

    // eslint-disable-next-line consistent-return
    return new Promise(async (resolve) => {
      try {
        const contentType = (file.hapi && file.hapi.headers && file.hapi.headers['content-type']) || '';
        const realName = (file.hapi && file.hapi.filename) || '';

        const time = new Date().getTime();
        const extension = contentType.split('/').pop();
        const filenameOrigin = `${uuidv4()}-${time}.${extension}`;

        const fileName = `${folderName}/${filenameOrigin}`;
        const fileContent = file._data;

        params.Key = fileName;
        params.ContentType = contentType;
        params.ContentDisposition = `inline; filename=${encodeURIComponent(realName)}`;
        params.Body = fileContent;

        s3.putObject(params, (err) => {
          if (err)
            return resolve({
              message: FIELD_ERROR.UPLOAD_FAILED.message,
              code: FIELD_ERROR.UPLOAD_FAILED.code,
              error: err
            });
          const urlS3 = `https://${bucket}.s3.amazonaws.com/${params.Key}`;
          return resolve(urlS3);
        });
      } catch (err1) {
        return resolve({
          message: FIELD_ERROR.UPLOAD_FAILED.message,
          code: FIELD_ERROR.UPLOAD_FAILED.code,
          error: err1
        });
      }
    });
  };

  /**
   * removeFileS3
   *
   * @param {String} bucket
   * @param {String} fileName
   * @returns
   */
  async removeFileS3 ({ bucket = S3_BUCKET, fileName }) {
    const params = {
      Bucket: bucket,
      Key: fileName
    };

    const data = await s3.deleteObject(params);

    return data;
  };

  /**
   * removeArrayFileS3
   *
   * @param {String} bucket
   * @param {String} arrayFile
   * @returns
   */
  async removeArrayFileS3 ({ bucket = S3_BUCKET, arrayFile }) {
    return Promise.all(arrayFile.map((fileName) => this.removeFileS3({ bucket, fileName })));
  };

  /**
   * getSignedUrl
   *
   * @param {String} bucket
   * @param {String} fileName
   * @param {String} realName
   * @param {String} contentType
   * @return {Promise}
   */
  async getSignedUrl ({ fileName, contentType, bucket = S3_BUCKET, folder = S3_FOLDERS.DEFAULT }) {
    // eslint-disable-next-line consistent-return
    return new Promise((resolve) => {
      if (!fileName) {
        return resolve({
          message: FIELD_ERROR.SIGNED_URL_FAILED.message,
          code: FIELD_ERROR.SIGNED_URL_FAILED.code,
          error: 'FILE_NAME_NOT_FOUND'
        });
      }

      const type = fileName.split(".").pop();
      const location = `${folder}/${fileName.replace(/[^a-zA-Z]/g, "")}_${uuidv4()}.${type}`;
      const params = {
        Bucket: bucket,
        Key: location,
        ContentType: contentType,
        Expires: 120,
        ACL: 'public-read'
        // ContentDisposition: `inline; filename=${encodeURIComponent(realName)}`
      };

      s3.getSignedUrl('putObject', params, (err, data) => {
        if (err)
          return resolve({
            message: FIELD_ERROR.SIGNED_URL_FAILED.message,
            code: FIELD_ERROR.SIGNED_URL_FAILED.code,
            error: err
          });

        return resolve({
          urlUpload: data,
          urlEndpoint: `${S3_ENDPOINT}/${location}`
        });
      });
    });
  }
}

export const s3Service = new S3Service();
