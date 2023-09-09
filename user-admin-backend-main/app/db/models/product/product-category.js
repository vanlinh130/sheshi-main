import {DataTypes, Model} from 'sequelize';

export default class ProductCategory extends Model {
  static init(sequelize, opts) {
    return super.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: DataTypes.STRING
        },
        categorySlug: {
          type: DataTypes.STRING,
          unique: true
        },
        image: {
          type: DataTypes.TEXT
        },
        description: {
          type: DataTypes.TEXT
        },
        note: {
          type: DataTypes.TEXT
        },
        status: {
          type: DataTypes.TINYINT(1)
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
        tableName: 'product_category',
        modelName: 'productCategory',
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
