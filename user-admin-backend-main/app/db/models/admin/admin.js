import {DataTypes, Model} from 'sequelize';
import bcrypt from 'bcrypt';

const saltRounds = 10;
export const ADMIN_STATUS = Object.freeze({
  ACTIVE: 1,
  BLOCKED: 0
});

export default class Admin extends Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: DataTypes.STRING
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false
        },
        status: {
          type: DataTypes.TINYINT(1),
          defaultValue: ADMIN_STATUS.ACTIVE
        },
        createdAt: {
          type: DataTypes.DATE
        },
        updatedAt: {
          type: DataTypes.DATE
        },
        deletedAt: {
          type: DataTypes.DATE
        }
      },
      {
        tableName: 'admin',
        modelName: 'admin',
        timestamps: true,
        paranoid: true,
        sequelize, ...opts
      }
    );
  }

  static hashPassword(password) {
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
  }

  static comparePassword(password, hash) {
    return bcrypt.compareSync(password, hash);
  }

  toJSON() {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
  }
}
