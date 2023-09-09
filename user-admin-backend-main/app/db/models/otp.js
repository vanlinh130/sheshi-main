import {DataTypes, Model} from 'sequelize';

export const OTP_STATUS = Object.freeze({
  ACTIVE: 1,
  DELETE: 0
});

export default class OTP extends Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement: true
        },
        key: {
          type: DataTypes.STRING
        },
        code: {
          type: DataTypes.STRING
        },
        status: {
          type: DataTypes.TINYINT(1),
          default: OTP_STATUS.ACTIVE
        },
        createdAt: {
          type: DataTypes.DATE
        },
        updatedAt: {
          type: DataTypes.DATE
        },
        deletedAt: {
          type: DataTypes.DATE
        }
      },
      {
        tableName: 'otp',
        modelName: 'otp',
        timestamps: true,
        paranoid: true,
        sequelize, ...opts
      }
    );
  }
}
