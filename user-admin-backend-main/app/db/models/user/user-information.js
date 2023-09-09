import {DataTypes, Model} from 'sequelize';

export default class UserInformation extends Model {
  static init(sequelize, opts) {
    return super.init({
        userId: {
          primaryKey: true,
          type: DataTypes.INTEGER
        },
        fullName: {
          type: DataTypes.STRING
        },
        address: {
          type: DataTypes.STRING
        },
        cityCode: {
          type: DataTypes.INTEGER
        },
        districtCode: {
          type: DataTypes.INTEGER
        },
        wardCode: {
          type: DataTypes.INTEGER
        },
        avatar: {
          type: DataTypes.TEXT
        },
        lastLogin: {
          type: DataTypes.DATE
        },
        createdAt: {
          type: DataTypes.DATE
        },
        updatedAt: {
          type: DataTypes.DATE
        }
      },
      {
        tableName: 'user_information',
        modelName: 'userInformation',
        timestamps: true,
        sequelize, ...opts
      }
    );
  }
}
