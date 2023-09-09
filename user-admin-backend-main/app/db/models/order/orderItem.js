import {DataTypes, Model} from 'sequelize';

export default class OrderItem extends Model {
  static init(sequelize, opts) {
    return super.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        orderId: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        productId: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        subProductId: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        userId: {
          type: DataTypes.INTEGER
        },
        quantity: {
          type: DataTypes.INTEGER
        },
        price: {
          type: DataTypes.DECIMAL
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
        tableName: 'order_item',
        modelName: 'orderItem',
        timestamps: true,
        sequelize, ...opts
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
    this.belongsTo(models.User, { foreignKey: 'createdById', as: 'userCreate' });
    this.belongsTo(models.User, { foreignKey: 'updatedById', as: 'userUpdate' });
  }
}
