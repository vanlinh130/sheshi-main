import {DataTypes, Model} from 'sequelize';

export const ADDRESS_DEFAULT = Object.freeze({
  DEFAULT: 1,
  NOT_DEFAULT: 0
});

export default class UserAddress extends Model {
  static init(sequelize, opts) {
    return super.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        address: {
          type: DataTypes.STRING()
        },
        userId: {
          type: DataTypes.INTEGER(),
          allowNull: false
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
        telephone: {
          type: DataTypes.STRING()
        },
        default: {
          type: DataTypes.TINYINT(1)
        },
        createdAt: {
          type: DataTypes.DATE
        },
        updatedAt: {
          type: DataTypes.DATE
        }
      },
      {
        tableName: 'user_address',
        modelName: 'userAddress',
        timestamps: true,
        sequelize, ...opts
      }
    );
  }
}
