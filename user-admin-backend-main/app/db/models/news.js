import {DataTypes, Model} from 'sequelize';
import { GLOBAL_STATUS } from '../../constants/common.constant';

export default class News extends Model {
  static init(sequelize, opts) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        title: {
          type: DataTypes.STRING
        },
        nameNews: {
          type: DataTypes.STRING
        },
        description: {
          type: DataTypes.STRING
        },
        descriptionSEO: {
          type: DataTypes.STRING
        },
        slug: {
          type: DataTypes.STRING
        },
        category: {
          type: DataTypes.STRING
        },
        thumbnail: {
          type: DataTypes.TEXT
        },
        content: {
          type: DataTypes.TEXT
        },
        status: {
          type: DataTypes.TINYINT(1),
          defaultValue: GLOBAL_STATUS.ACTIVE
        },
        outstanding: {
          type: DataTypes.TINYINT(1),
          defaultValue: GLOBAL_STATUS.INACTIVE
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
        tableName: "news",
        modelName: "news",
        timestamps: true,
        sequelize,
        ...opts
      }
    );
  }
}
