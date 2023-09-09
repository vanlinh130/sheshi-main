import {DataTypes, Model} from 'sequelize';

export default class UserBonus extends Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        referralId: {
          type: DataTypes.INTEGER
        },
        orderId: {
          type: DataTypes.INTEGER
        },
        priceBonus: {
          type: DataTypes.DECIMAL(10),
          allowNull: false
        },
        type: {
          type: DataTypes.INTEGER,
          allowNull: false
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
        tableName: 'user_bonus',
        modelName: 'userBonus',
        timestamps: true,
        sequelize, ...opts
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Order, {
      foreignKey: "orderId",
      as: "order"
    });
  }
}