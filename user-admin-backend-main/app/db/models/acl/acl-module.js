import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class ACLModule extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {type: DataTypes.STRING(255)},
        description: {type: DataTypes.TEXT},
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
        tableName: 'acl_module',
        modelName: 'aclModule',
        timestamps: false,
        ...opts,
        sequelize
      }
    );
  }

  static associate(models) {
    this.hasMany(models.ACLAction, {foreignKey: 'moduleId', as: 'permissions'});
  }
}
