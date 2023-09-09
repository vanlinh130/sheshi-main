import {DataTypes, Model} from 'sequelize';
import { GLOBAL_STATUS } from '../../../constants/common.constant';

export default class Product extends Model {
  static init(sequelize, opts) {
    return super.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        categoryId: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        discountId: {
          type: DataTypes.INTEGER
        },
        productSlug: {
          type: DataTypes.STRING,
          unique: true
        },
        name: {
          type: DataTypes.STRING
        },
        nameVi: {
          type: DataTypes.STRING
        },
        acronym: {
          type: DataTypes.STRING
        },
        typeProduct: {
          type: DataTypes.STRING
        },
        purposeUse: {
          type: DataTypes.TEXT
        },
        unitId: {
          type: DataTypes.INTEGER
        },
        branchId: {
          type: DataTypes.INTEGER
        },
        description: {
          type: DataTypes.TEXT
        },
        element: {
          type: DataTypes.TEXT
        },
        uses: {
          type: DataTypes.TEXT
        },
        guide: {
          type: DataTypes.TEXT
        },
        price: {
          type: DataTypes.DECIMAL
        },
        outstanding: {
          type: DataTypes.TINYINT(1)
        },
        originId: {
          type: DataTypes.INTEGER
        },
        capacityId: {
          type: DataTypes.INTEGER
        },
        expiry: {
          type: DataTypes.STRING
        },
        colorId: {
          type: DataTypes.INTEGER
        },
        status: {
          type: DataTypes.TINYINT(1),
          defaultValue: GLOBAL_STATUS.ACTIVE
        },
        policy: {
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
        tableName: 'product',
        modelName: 'product',
        timestamps: true,
        sequelize, ...opts
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Discount, { foreignKey: 'discountId', as: 'discount' });
    this.belongsTo(models.ProductCategory, { foreignKey: 'categoryId', as: 'productCategory' });
    this.hasMany(models.ProductImage, { foreignKey: 'productId', as: 'productImage' });
    this.hasMany(models.ProductDetail, { foreignKey: 'productId', as: 'productDetail' });
    this.hasMany(models.ProductInventory, { foreignKey: 'productId', as: 'productInventory' });
    this.belongsTo(models.User, { foreignKey: 'createdById', as: 'userCreate' });
    this.belongsTo(models.User, { foreignKey: 'updatedById', as: 'userUpdate' });
  }
}
