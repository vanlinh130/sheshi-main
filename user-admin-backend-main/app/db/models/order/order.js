import { DataTypes, Model } from 'sequelize';

export const ORDER_STATUS = Object.freeze({
  WAITTING_CONFIRM: 1,
  CONFIRMED: 2,
  SHIPPING: 3,
  DELIVERED: 4,
  REJECT: 5
});

export const ORDER_CODE = 'SHESHI';

export default class Order extends Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        paymentId: {
          type: DataTypes.INTEGER
        },
        shipId: {
          type: DataTypes.INTEGER
        },
        userId: {
          type: DataTypes.INTEGER
        },
        fullName: {
          type: DataTypes.STRING
        },
        identification: {
          type: DataTypes.STRING
        },
        orderCode: {
          type: DataTypes.STRING
        },
        total: {
          type: DataTypes.DECIMAL
        },
        commission: {
          type: DataTypes.DECIMAL
        },
        totalBeforeFee: {
          type: DataTypes.DECIMAL
        },
        email: {
          type: DataTypes.STRING
        },
        telephone: {
          type: DataTypes.STRING
        },
        from: {
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
        note: {
          type: DataTypes.STRING
        },
        orderDate: {
          type: DataTypes.DATE
        },
        orderStatus: {
          type: DataTypes.TINYINT(1)
        },
        referralCode: {
          type: DataTypes.STRING
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
        tableName: 'order',
        modelName: 'order',
        timestamps: true,
        sequelize,
        ...opts
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.OrderPayment, { foreignKey: 'paymentId',  as: 'orderPayment' });
    this.hasMany(models.OrderItem, { foreignKey: 'orderId', as: 'orderItem' })
    this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    this.belongsTo(models.User, { foreignKey: 'createdById', as: 'userCreate' });
    this.belongsTo(models.User, { foreignKey: 'updatedById', as: 'userUpdate' });
  }
}
