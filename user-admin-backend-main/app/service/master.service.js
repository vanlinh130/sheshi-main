import db from '../db/models';
import { badRequest, FIELD_ERROR } from '../config/error';
import { GLOBAL_STATUS } from '../constants/common.constant';

const { Op } = db.Sequelize;

/**
 * Get list mastrer
 * @param {*} query
 * @param {*} paging
 */
export async function getListMaster(query, { offset, limit, order }) {
  const { name, status, idMaster, nameMaster } = query;
  const conditions = {};

  status && ( conditions.status = status );
  idMaster && ( conditions.idMaster = idMaster );
  nameMaster && (conditions.nameMaster = { [Op.like]: `%${nameMaster.trim()}%` });
  name && (conditions.name = { [Op.like]: `%${name.trim()}%` });

  const masterList = await db.MasterData.findAndCountAll({
    where: conditions,
    offset,
    limit,
    order
  });

  return masterList;
}

/**
 * Get master father by idMaster
 * @param {*} query
 */
 export async function getMaster(query) {
  const { idMaster, nameMaster, id } = query;
  const conditions = {
    status: GLOBAL_STATUS.ACTIVE
  };

  idMaster && (conditions.idMaster = idMaster);
  nameMaster && (conditions.nameMaster = nameMaster);
  id && (conditions.id = id);

  const masterData = await db.MasterData.findAll({
    where: conditions
  });

  if (!masterData) {
    throw badRequest('get_master', FIELD_ERROR.MASTER_NOT_FOUND, 'Master not found');
  }

  return masterData;
}

/**
 * Create new Master
 * @param {*} body
 */
 export async function createMaster(body) {
  try {
    let idMaster;
    let id;

    // Check exists master
    const existMaster = await db.MasterData.findOne({
      where: { nameMaster: body.nameMaster }
    });

    if (existMaster) {
      // Set master id equals with current master
      idMaster = existMaster.idMaster;

      // Get lastest id of master
      const lasterIdOfMaster = await db.MasterData.findOne({
        where: { idMaster : existMaster.idMaster },
        order: [['id', 'DESC']],
        limit: 1
      });

      // Increasement id of master
      id = lasterIdOfMaster.id + 1;
    } else {
      // Get lastest id master
      const lasterIdMaster = await db.MasterData.findOne({
        order: [['idMaster', 'DESC']],
        limit: 1
      });

      // Check exist id master
      if (lasterIdMaster) {
        idMaster = lasterIdMaster.idMaster + 1;
      } else {
        // Case insert first record master data
        idMaster = 1;
      }
      id = 1;
    }

    const masterData = {
      ...body,
      id,
      idMaster
    }

    await db.MasterData.create(masterData);
    return true;
   } catch (e) {
     console.log("ERROR_CREATE_MASTER: ", e);
     throw e;
   }
}

/**
 * Update master
 * @param {*} body
 */
 export async function updateMaster(body) {
  try {
    const master = await db.MasterData.findOne({
      where: { idMaster: body.idMaster, nameMaster: body.nameMaster }
    })

    await db.MasterData.update(body, { where: { id: body.id, idMaster: body.idMaster } });
    if (!master) {
      await db.MasterData.update(
        { nameMaster: body.nameMaster },
        { where: { idMaster: body.idMaster } }
      );
    }

    return true;
  } catch (e) {
    console.log("ERROR_UPDATE_CATEGORY: ", e);
    throw e;
  }
}

/**
 * Delete master
 * @param {*} id
 */
 export async function deleteMaster(body) {
  try {
    await db.MasterData.destroy({
      where: { id: body.id, idMaster: body.idMaster }
    });
    return true;
  } catch (e) {
    console.log("ERROR_DELETE_MASTER_DATA: ", e);
    throw e;
  }
}