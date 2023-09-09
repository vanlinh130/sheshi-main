import fs from 'fs';
import AWS from 'aws-sdk';
import path from 'path';
import nodemailer from "nodemailer";
import {} from 'dotenv/config';

let configSES = {
  region: process.env.SES_REGION,
  accessKeyId: process.env.SES_ACCESS_KEY_ID,
  secretAccessKey: process.env.SES_SECRET_ACCESS_KEY
}

if (process.env.NODE_ENV === 'local') {
  configSES = {
    ...configSES
  }
}

class SesService {
  getDataAWS() {
    AWS.config.update(configSES);
  }

  async buildTemplate(templateName, params) {
    try {
      const templatePath = path.join(
        __dirname,
        `../../template/email/${templateName}.html`
      );

      let emailMessage = await fs.readFileSync(templatePath, "utf-8");

      if (params) {
        Object.keys(params).forEach((key) => {
          const value = params[key];
          emailMessage = emailMessage.replaceAll(`{{ ${key} }}`, value);
        });
      }

      return emailMessage;
    } catch (error) {
      throw error;
    }
  }

  async sendMail({ templateName, params, subject, toEmails }) {
    try {
      const content = await this.buildTemplate(templateName, params);
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD
        }
      });
      const mailOptions = {
        from: "sheshi.noreply <noreply@sheshi.com>",
        replyTo: 'noreply@sheshi.com',
        to: toEmails,
        subject: subject,
        html: content
      };

      // eslint-disable-next-line func-names
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log(`Email sent: ${info.response}`);
        }
      });
      return true;
    } catch (e) {
      throw e;
    }
  }

  // async sendMail({ toEmails, ccEmails = [], bccEmails = [], subject, templateName, params }) {
  //   try {
  //     this.getDataAWS();
  //     const SES = new AWS.SES();

  //     /** Build template from file html */
  //     const content = await this.buildTemplate(templateName, params);

  //     /** Define sendEmailRequest send email */
  //     const sendEmailRequest = {
  //       Destination: {
  //         CcAddresses: ccEmails,
  //         BccAddresses: bccEmails,
  //         ToAddresses: toEmails
  //       },
  //       Message: {
  //         Body: {
  //           Html: {
  //             Charset: "UTF-8",
  //             Data: content
  //           }
  //         },
  //         Subject: {
  //           Charset: 'UTF-8',
  //           Data: subject
  //         }
  //       },
  //       Source: process.env.SES_SENDER
  //     };

  //     console.log(`<------Sending email to ${toEmails.join(', ')}------>`)
  //     return SES.sendEmail(sendEmailRequest).promise();
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async send({ toEmails, subject, content }) {
    try {
      this.getDataAWS();
      const SES = new AWS.SES();
      /** Define sendEmailRequest send email */
      const sendEmailRequest = {
        Destination: {
          ToAddresses: toEmails
        },
        Message: {
          Body: {
            Html: {
              Charset: "UTF-8",
              Data: content
            }
          },
          Subject: {
            Charset: "UTF-8",
            Data: subject
          }
        },
        Source: process.env.SES_SENDER
      };
      return SES.sendEmail(sendEmailRequest).promise();
    } catch (error) {
      throw error;
    }
  }
}

export const mailAwsService = new SesService();
