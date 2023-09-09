import { badRequest, FIELD_ERROR } from '../config/error';
import db from '../db/models';

/**
 * Get list mastrer
 * @param {*} query
 * @param {*} paging
 */
export async function getListLevelConditions(query) {
  const { idLevel } = query;
  const conditions = {};

  idLevel && ( conditions.idLevel = idLevel );

  const levelConditionsList = await db.LevelConditions.findAll({
    where: conditions
  });

  return levelConditionsList;
}

/**
 * Create new Master
 * @param {*} body
 */
 export async function createLevelConditions(body) {
  try {
    const checkExist = await db.LevelConditions.findOne({
      where: {
        idLevel: body.idLevel,
        type: body.type
      }
    });
    if (checkExist) {
      throw badRequest(
        "create_level_conditions",
        FIELD_ERROR.EXIST_LEVEL_CONDITIONS,
        "Level conditions is exist"
      );
    }
    await db.LevelConditions.create(body);
    return true;
   } catch (e) {
     console.log("ERROR_CREATE_LEVEL_CONDITIONS: ", e);
     throw e;
   }
}

/**
 * Update master
 * @param {*} body
 */
 export async function updateLevelConditions(body) {
  try {
    await db.LevelConditions.destroy({
      where: {
        idLevel: body.idLevel
      }
    });
    await db.LevelConditions.create(body);

    return true;
  } catch (e) {
    console.log("ERROR_UPDATE_LEVEL_CONDITIONS: ", e);
    throw e;
  }
}
