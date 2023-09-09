import Sequelize from 'sequelize';

const {DataTypes} = Sequelize;

export default class ACLGroup extends Sequelize.Model {
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
        tableName: 'acl_group',
        modelName: 'aclGroup',
        timestamps: false,
        sequelize, ...opts
      }
    );
  }

  static associate(models) {
    this.belongsToMany(models.ACLAction, {
      through: models.ACLGroupAction,
      foreignKey: 'groupId',
      otherKey: 'actionId',
      as: 'permissions'
    });
  }
}
