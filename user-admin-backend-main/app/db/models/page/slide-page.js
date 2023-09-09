import {DataTypes, Model} from 'sequelize';

export default class SlidePage extends Model {
  static init(sequelize, opts) {
    return super.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        title: {
          type: DataTypes.STRING()
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
        tableName: 'slide_page',
        modelName: 'slidePage',
        timestamps: true,
        sequelize, ...opts
      }
    );
  }
}
