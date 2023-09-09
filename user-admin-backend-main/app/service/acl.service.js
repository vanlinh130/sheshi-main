import { badRequest, FIELD_ERROR } from '../config/error';
import db from '../db/models';

// const { Op } = db.Sequelize;

export async function getListAcl(query) {
  const { groupId } = query;

  const conditions = {}

  groupId && (conditions.groupId = groupId);

  return db.ACLGroupAction.findAll({
    where: conditions,
    include: [
      {
        model: db.ACLAction,
        as: "actions",
        include: [
          {
            model: db.ACLModule,
            as: "modules"
          }
        ]
      }
    ]
  });
}
export async function getAclActionWithModuleId(moduleId) {
  return db.ACLAction.findAll({
    where: { moduleId }
  });
}

export async function deleteRoleModule(body) {
  try {
    const { actionsId, groupId } = body;
    db.ACLGroupAction.destroy({ where: { actionId: actionsId, groupId } });
    return true;
  } catch (e) {
    console.log("ERROR_DELETE_ROLE_MODULE: ", e);
    throw e;
  }
}
export async function createRoleModule(body) {
  try {
    const { actionsId, groupId } = body;
    for (const action of actionsId) {
      const checkExist = await db.ACLGroupAction.findOne({
        where: {
          actionId: action,
          groupId
        }
      });
      console.log(checkExist)
      if (checkExist) {
        throw badRequest('create_module', FIELD_ERROR.EXIST_GROUP_ROLE, 'Action of role is exists');
      }
      await db.ACLGroupAction.create({
        actionId: action,
        groupId
      });
    }
    return true;
  } catch (e) {
    console.log(e.err);
    throw e;
  }
}