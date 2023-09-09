import {DataTypes, Model} from 'sequelize';

export default class CommissionUser extends Model {
  static init(sequelize, opts) {
    return super.init(
      {
        idUser: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false
        },
        idCommission: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false
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
        tableName: "commission_level",
        modelName: "commissionLevel",
        timestamps: true,
        sequelize,
        ...opts
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'createdById', as: 'userCreate' });
    this.belongsTo(models.User, { foreignKey: 'updatedById', as: 'userUpdate' });
    this.belongsTo(models.CommissionConfig, { foreignKey: 'idCommission', as: 'commissionConfig' });
  }
}
