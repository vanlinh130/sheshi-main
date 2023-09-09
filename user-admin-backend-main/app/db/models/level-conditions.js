import {DataTypes, Model} from 'sequelize';
import { GLOBAL_STATUS } from '../../constants/common.constant';

export default class LevelConditions extends Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        idLevel: {
          type: DataTypes.INTEGER,
          primaryKey: true
        },
        masterUnit: {
          type: DataTypes.INTEGER
        },
        value: {
          type: DataTypes.INTEGER
        },
        unit: {
          type: DataTypes.INTEGER
        },
        type: {
          type: DataTypes.INTEGER
        },
        amountMonth: {
          type: DataTypes.INTEGER
        },
        note: {
          type: DataTypes.STRING
        },
        status: {
          type: DataTypes.TINYINT(1),
          defaultValue: GLOBAL_STATUS.ACTIVE
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
        tableName: 'level_conditions',
        modelName: 'levelConditions',
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
