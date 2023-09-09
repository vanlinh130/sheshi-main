import {DataTypes, Model} from 'sequelize';

export default class ContentPage extends Model {
  static init(sequelize, opts) {
    return super.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        content: {
          type: DataTypes.TEXT()
        },
        image: {
          type: DataTypes.TEXT()
        },
        pageCode: {
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
        tableName: 'content_page',
        modelName: 'contentPage',
        timestamps: true,
        sequelize, ...opts
      }
    );
  }
}
