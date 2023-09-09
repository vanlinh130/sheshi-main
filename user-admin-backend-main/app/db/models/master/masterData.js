import {DataTypes, Model} from 'sequelize';
import { GLOBAL_STATUS } from '../../../constants/common.constant';

export default class MasterData extends Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true
        },
        idMaster: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        nameMaster: {
          type: DataTypes.STRING,
          allowNull: false
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false
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
        tableName: 'master_data',
        modelName: 'masterData',
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
