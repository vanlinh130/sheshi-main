import {DataTypes, Model} from 'sequelize';

export default class ContactPage extends Model {
  static init(sequelize, opts) {
    return super.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        telephone: {
          type: DataTypes.STRING()
        },
        address: {
          type: DataTypes.STRING()
        },
        email: {
          type: DataTypes.STRING()
        },
        timeWorking: {
          type: DataTypes.STRING()
        },
        businessLicense: {
          type: DataTypes.STRING()
        },
        type: {
          type: DataTypes.TINYINT(1)
        },
        createdAt: {
          type: DataTypes.DATE
        },
        updatedAt: {
          type: DataTypes.DATE
        }
      },
      {
        tableName: 'contact_page',
        modelName: 'contactPage',
        timestamps: true,
        sequelize, ...opts
      }
    );
  }
}
