import db from '../db/models';

/**
 * Get list mastrer
 * @param {*} query
 * @param {*} paging
 */
export async function getListCommission(query) {
  const { id, commissionName, type } = query;
  const conditions = {};

  commissionName && ( conditions.commissionName = commissionName );
  id && ( conditions.id = id );
  type && ( conditions.type = type );

  const masterList = await db.CommissionConfig.findAll({
    where: conditions
  });

  return masterList;
}

/**
 * Get list mastrer
 * @param {*} query
 * @param {*} paging
 */
 export async function getListCommissionLevel(query) {
  const { idLevel, type } = query;
  const conditions = {};
  const conditionsConfig = {};

  idLevel && ( conditions.idLevel = idLevel );
  type && ( conditionsConfig.type = type );

  const masterList = await db.CommissionLevel.findAll({
    where: conditions,

    include: [
      {
        model: db.CommissionConfig,
        as: "commissionConfig",
        where: conditionsConfig
      }
    ]
  });

  return masterList;
}

/**
 * Create new Master
 * @param {*} body
 */
 export async function createCommission(body) {
  try {
    await db.CommissionConfig.create(body);
    return true;
   } catch (e) {
     console.log("ERROR_CREATE_COMMISSION: ", e);
     throw e;
   }
}

/**
 * Create new Master
 * @param {*} body
 */
 export async function createCommissionLevel(body) {
  try {

    await db.CommissionLevel.destroy(
      {
        where: { idLevel: body.idLevel }
      },
    );
    for (const idCommission of body.idCommissions) {
      await db.CommissionLevel.create({
        idCommission: idCommission,
        idLevel: body.idLevel
      });
    }

    return true;
   } catch (e) {
     console.log("ERROR_CREATE_COMMISSION_LEVEL: ", e);
     throw e;
   }
}

/**
 * Update master
 * @param {*} body
 */
 export async function updateCommission(body) {
  try {
    await db.CommissionConfig.update(body, {
      where: {
        id: body.id
      }
    });

    return true;
  } catch (e) {
    console.log("ERROR_UPDATE_COMMISSION: ", e);
    throw e;
  }
}
