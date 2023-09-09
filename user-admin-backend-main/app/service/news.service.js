import { GLOBAL_STATUS } from '../constants/common.constant';
import db from '../db/models';

const { Op } = db.Sequelize;

/**
 * Get list News
 * @param {*} query
 * @param {*} paging
 */
export async function getListNews(query, { offset, limit, order }) {
  const { search, isAdmin } = query;
  const conditions = {};

  !isAdmin && (conditions.status = GLOBAL_STATUS.ACTIVE);
  if (search) {
    conditions[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { nameNews: { [Op.like]: `%${search}%` } }
    ];
  }

  return db.News.findAndCountAll({
    where: conditions,
    offset,
    limit,
    order
  });
}

export async function getDetailNews(id) {
  return db.News.findOne({
    where: { id }
  });
}
export async function getDetailNewsBySlug(slug) {
  return db.News.findOne({
    where: { slug }
  });
}

/**
 * Create new News
 * @param {*} body
 */
 export async function createNews(body) {

  try {
    await db.News.create(body);
    return true;
  } catch (e) {
    console.log("ERROR_CREATE_NEWS: ", e);
    throw e;
  }
}

/**
 * Update News
 * @param {*} body
 */
 export async function updateNews(body) {
  try {
    await db.News.update(body, {
      where: { id: body.id }
    });
    return true;
  } catch (e) {
    console.log("ERROR_UPDATE_NEWS: ", e);
    throw e;
  }
}