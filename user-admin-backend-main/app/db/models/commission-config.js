import {DataTypes, Model} from 'sequelize';

export default class CommissionConfig extends Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        commissionName: {
          type: DataTypes.STRING,
          allowNull: false
        },
        percent: {
          type: DataTypes.INTEGER
        },
        conditions: {
          type: DataTypes.STRING
        },
        type: {
          type: DataTypes.INTEGER
        },
        note: {
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
        tableName: "commission_config",
        modelName: "commissionConfig",
        timestamps: true,
        sequelize,
        ...opts
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'createdById', as: 'userCreate' });
    this.belongsTo(models.User, { foreignKey: 'updatedById', as: 'userUpdate' });
  }
}
