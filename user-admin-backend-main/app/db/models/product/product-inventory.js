import {DataTypes, Model} from 'sequelize';

export default class ProductInventory extends Model {
  static init(sequelize, opts) {
    return super.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        productId: {
          primaryKey: true,
          type: DataTypes.INTEGER
        },
        subProductId: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        quantity: {
          type: DataTypes.INTEGER.UNSIGNED
        },
        cityCode: {
          type: DataTypes.INTEGER
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
        tableName: 'product_inventory',
        modelName: 'productInventory',
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
