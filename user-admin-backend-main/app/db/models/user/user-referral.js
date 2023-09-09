import {DataTypes, Model} from 'sequelize';

export default class UserReferral extends Model {
  static init(sequelize, opts) {
    return super.init({
        registerId: {
          primaryKey: true,
          type: DataTypes.BIGINT
        },
        registerCode: {
          type: DataTypes.STRING
        },
        referrerId: {
          type: DataTypes.BIGINT
        },
        referrerCode: {
          type: DataTypes.STRING
        },
        genealogyPath: {
          type: DataTypes.TEXT
        },
        createdAt: {
          type: DataTypes.DATE
        }
      },
      {
        tableName: 'user_referral',
        modelName: 'userReferral',
        timestamps: false,
        sequelize, ...opts
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'registerId', as: 'register' });
  }
}
