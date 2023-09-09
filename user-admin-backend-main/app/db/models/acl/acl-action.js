import Sequelize from 'sequelize';

const { DataTypes } = Sequelize;
export const PERMISSION = {
  READ: 1,
  CREATE: 2,
  UPDATE: 3,
  DELETE: 4
};

export const ALL_PERMISSIONS = [
  PERMISSION.CREATE, PERMISSION.READ, PERMISSION.UPDATE, PERMISSION.DELETE
];

export default class ACLAction extends Sequelize.Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        moduleId: { type: DataTypes.INTEGER },
        name: { type: DataTypes.STRING(255) },
        description: { type: DataTypes.TEXT },
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
        tableName: 'acl_action',
        modelName: 'aclAction',
        timestamps: false,
        sequelize, ...opts
      }
    );
  }

  static associate(models) {
    this.belongsToMany(models.ACLGroupAction, {
      through: models.ACLGroupAction,
      foreignKey: 'actionId',
      otherKey: 'groupId'
    });
    this.belongsTo(models.ACLModule, { foreignKey: 'moduleId', as: 'modules' });
  }
}
