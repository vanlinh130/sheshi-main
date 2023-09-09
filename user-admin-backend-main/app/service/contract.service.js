import db from '../db/models';

const { Op } = db.Sequelize;

/**
 * Get list contract
 * @param {*} query
 * @param {*} paging
 */
export async function getListContract(query, { offset, limit, order }) {
  const { email, fullName, phoneNumber } = query;
  const conditions = {};

  email && (conditions.email = { [Op.like]: `%${email.trim()}%` });
  fullName && (conditions.fullName = { [Op.like]: `%${fullName.trim()}%` });
  phoneNumber && (conditions.phoneNumber = { [Op.like]: `%${phoneNumber.trim()}%` });

  return db.Contract.findAndCountAll({
    where: conditions,
    offset,
    limit,
    order
  });
}

/**
 * Create new contract
 * @param {*} body
 */
 export async function createContract(body) {

  try {
    await db.Contract.create(body);
    return true;
  } catch (e) {
    console.log("ERROR_CREATE_CONTRACT: ", e);
    throw e;
  }
}

/**
 * Update contract
 * @param {*} body
 */
 export async function updateContract(body) {
  try {
    await db.Contract.update(body, {
      where: { id: body.id }
    });
    return true;
  } catch (e) {
    console.log("ERROR_UPDATE_CONTRACT: ", e);
    throw e;
  }
}