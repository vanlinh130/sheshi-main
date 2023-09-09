import passport from 'passport';
import db from '../db/models';
import { FIELD_ERROR, HTTP_ERROR } from '../config/error';
import { GLOBAL_STATUS } from '../constants/common.constant';

export const passportJWT = () =>
  passport.authenticate('jwt', { session: false });

export function isAuthenticated(moduleId = []) {
  return [
    passportJWT(),
    async (req, res, next) => {
      if (req.isAuthenticated() && req.user) {
        const account = await db.User.findOne({
          where: {
            id: req.user.id,
            email: req.user.email
          }
        });
        if (!account) {
          return res.status(HTTP_ERROR.NOT_AUTHENTICATE).json({
            code: FIELD_ERROR.ACCOUNT_NOT_FOUND.message,
            message: "Account not found"
          });
        }
        if (account.status !== GLOBAL_STATUS.ACTIVE) {
          return res.status(HTTP_ERROR.ACCESS_DENIED).json({
            code: FIELD_ERROR.ACCOUNT_NOT_ACTIVE.message,
            message: "Account not active"
          });
        }
        const groupAccount = await db.ACLGroupAction.findAll({
          where: {
            groupId: account.role
          },
          include: [
            {
              model: db.ACLAction,
              as: "actions",
              required: false
            }
          ]
        });
        let checkAuthenticate = false
        if (moduleId.length === 0) {
          checkAuthenticate = true;
        }
        for (const group of groupAccount) {
          for (const id of moduleId) {
            if (group.actions.moduleId === id) {
              checkAuthenticate = true;
              break;
            }
          }
        }
        if (!checkAuthenticate) {
          return res.status(HTTP_ERROR.NOT_AUTHENTICATE).json({
            code: FIELD_ERROR.ACCOUNT_NOT_FOUND.message,
            message: "Not authenticate to access"
          });
        }
        return next();
      }
      return res.status(HTTP_ERROR.NOT_AUTHENTICATE).json({
        code: FIELD_ERROR.NOT_AUTHENTICATE.message,
        message: "Not Authenticated."
      });
    }
  ];
}
