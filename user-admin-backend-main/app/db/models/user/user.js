import {DataTypes, Model} from 'sequelize';
import bcrypt from 'bcrypt';

const saltRounds = 10;
export const USER_CODE = 'SS';
export const USER_STATUS = Object.freeze({
  ACTIVE: 1,
  BLOCKED: 0
});

export default class User extends Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        userCode: {
          type: DataTypes.STRING(20),
          allowNull: false,
          unique: true
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false
        },
        username: {
          type: DataTypes.STRING
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false
        },
        phoneCode: {
          type: DataTypes.INTEGER(6).UNSIGNED
        },
        phoneNumber: {
          type: DataTypes.STRING
        },
        level: {
          type: DataTypes.TINYINT(1)
        },
        role: {
          type: DataTypes.INTEGER
        },
        status: {
          type: DataTypes.TINYINT(1),
          defaultValue: USER_STATUS.ACTIVE
        },
        createdAt: {
          type: DataTypes.DATE
        },
        updatedAt: {
          type: DataTypes.DATE
        }
      },
      {
        tableName: 'user',
        modelName: 'user',
        timestamps: true,
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

  static associate(models) {
    this.hasOne(models.UserInformation, {
      foreignKey: "userId",
      as: "userInformation"
    });
    this.hasOne(models.UserAddress, {
      foreignKey: "userId",
      as: "userAddress"
    });
    this.hasOne(models.CommissionLevel, {
      sourceKey: "level",
      foreignKey: "idLevel",
      as: "commissionLevel"
    });
    this.hasOne(models.UserReferral, {
      foreignKey: "registerId",
      as: "userReferral"
    });
    this.hasMany(models.UserReferral, {
      foreignKey: "referrerId",
      as: "userReferrer"
    });
    this.hasMany(models.UserBonus, {
      foreignKey: "userId",
      as: "userBonus"
    });
  }

  toJSON() {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
  }
}
