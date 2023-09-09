import {DataTypes, Model} from 'sequelize';

export const PAYMENT_TYPE = Object.freeze({
  PAYMENT_OFFLINE: 0,
  PAYMENT_ONLINE: 1
});
export default class OrderPayment extends Model {
  static init(sequelize, opts) {
    return super.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        paymentMethod: {
          type: DataTypes.INTEGER,
          defaultValue: PAYMENT_TYPE.PAYMENT_OFFLINE
        },
        createdById: {
          type: DataTypes.INTEGER
        },
        updatedById: {
          type: DataTypes.INTEGER
        },
        createdAt: {
          type: DataTypes.DATE
        },
        updatedAt: {
          type: DataTypes.DATE
        }
      },
      {
        tableName: 'order_payment',
        modelName: 'orderPayment',
        timestamps: true,
        sequelize, ...opts
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'createdById', as: 'userCreate' });
    this.belongsTo(models.User, { foreignKey: 'updatedById', as: 'userUpdate' });
  }
}
