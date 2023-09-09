import {DataTypes, Model} from 'sequelize';

export default class ProductDetail extends Model {
  static init(sequelize, opts) {
    return super.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true
        },
        productId: {
          primaryKey: true,
          type: DataTypes.INTEGER
        },
        unitId: {
          type: DataTypes.INTEGER
        },
        capacityId: {
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
        tableName: 'product_detail',
        modelName: 'productDetail',
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
