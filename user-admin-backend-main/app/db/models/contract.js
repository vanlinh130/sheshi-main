import {DataTypes, Model} from 'sequelize';
import { GLOBAL_STATUS } from '../../constants/common.constant';

export default class Contract extends Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        fullName: {
          type: DataTypes.STRING
        },
        email: {
          type: DataTypes.STRING
        },
        phoneNumber: {
          type: DataTypes.STRING
        },
        content: {
          type: DataTypes.TEXT
        },
        status: {
          type: DataTypes.TINYINT(1),
          defaultValue: GLOBAL_STATUS.ACTIVE
        },
        createdAt: {
          type: DataTypes.DATE
        },
        updatedAt: {
          type: DataTypes.DATE
        }
      },
      {
        tableName: "contract",
        modelName: "contract",
        timestamps: true,
        sequelize,
        ...opts
      }
    );
  }
}
