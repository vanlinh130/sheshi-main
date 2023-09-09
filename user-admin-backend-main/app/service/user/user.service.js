import db from '../../db/models';
import { getAccountInfo } from './auth.service';
import { checkUserExisted } from './otp.service';
import { ADDRESS_DEFAULT } from '../../db/models/user/user-address';
import { badRequest, FIELD_ERROR } from '../../config/error';
import { USER_STATUS } from '../../db/models/user/user';
import { BONUS_TYPE } from '../../constants/common.constant';

const { Op } = db.Sequelize;

/**
 * Update user profile
 * @param {*} user
 * @param {*} formUpdate
 * @returns
 */
export async function updateUserProfile(user, formUpdate) {
  const profile = await getAccountInfo(user, false);
  const transaction = await db.sequelize.transaction();
  try {
    if (!formUpdate.avatar) {
      await checkUserExisted(
        formUpdate.email,
        formUpdate.phoneCode,
        formUpdate.phoneNumber,
        formUpdate.username,
        { id: { [Op.not]: user.id } }
      );
    }

    const dataUserUpdate = {
      phoneCode: formUpdate.phoneCode,
      phoneNumber: formUpdate.phoneNumber,
      username: formUpdate.username,
      address: formUpdate.address
    };

    const dataUserInfoUpdate = {
      fullName: formUpdate.fullName,
      address: formUpdate.address,
      cityCode: formUpdate.cityCode,
      districtCode: formUpdate.districtCode,
      wardCode: formUpdate.wardCode,
      avatar: formUpdate.avatar
    };

    await Promise.all([
      db.User.update(dataUserUpdate, {
        where: { id: profile.id },
        transaction
      }),
      db.UserInformation.update(dataUserInfoUpdate, {
        where: { userId: profile.id },
        transaction
      })
    ]);

    await transaction.commit();
    return true;
  } catch (e) {
    console.log('ERROR_UPDATE_USER_PROFILE: ', e);
    if (transaction) await transaction.rollback();
    throw e;
  }
}

/**
 * Update user profile
 * @param {*} user
 * @param {*} formUpdate
 * @returns
 */
export async function updateLevelUser(formUpdate) {
  try {
    await db.User.update(formUpdate, {
      where: { id: formUpdate.id }
    })
    return true;
  } catch (e) {
    console.log('ERROR_UPDATE_USER_PROFILE: ', e);
    throw e;
  }
}

export async function registerUserAddress(user, registerForm) {
  let isDefault = ADDRESS_DEFAULT.NOT_DEFAULT;

  const addressExisted = await db.UserAddress.findOne({
    where: { userId: user.id }
  });

  if (!addressExisted) {
    isDefault = ADDRESS_DEFAULT.DEFAULT;
  }

  try {
    await db.UserAddress.create({
      userId: user.id,
      address: registerForm.address,
      cityCode: registerForm.cityCode,
      districtCode: registerForm.districtCode,
      wardCode: registerForm.wardCode,
      telephone: registerForm.telephone,
      default: isDefault
    });
    return true;
  } catch (e) {
    console.log('ERROR_UPDATE_USER_PROFILE: ', e);
    throw e;
  }
}

export async function updateUserAddress(id, user, updateForm) {
  const userAddress = await db.UserAddress.findOne({
    where: { id: user.id }
  })
  if (!userAddress) {
    throw badRequest('get_address_info', FIELD_ERROR.ADDRESS_NOT_FOUND, 'Address not found');
  }

  try {
    await db.UserAddress.update(updateForm, { where: { id } });
    return true;
  } catch (e) {
    console.log('ERROR_UPDATE_USER_PROFILE: ', e);
    throw e;
  }
}

export async function setDefaultAddress(id, user) {
  const transaction = await db.sequelize.transaction();
  const userAddress = db.UserAddress.findOne({
    where: { id }
  })
  if (!userAddress) {
    throw badRequest('get_address_info', FIELD_ERROR.ADDRESS_NOT_FOUND, 'Address not found');
  }
  try {
    await Promise.all([
      db.UserAddress.update(
        { default: ADDRESS_DEFAULT.NOT_DEFAULT },
        {
          where: { userId: user.id },
          transaction
        }
      ),
      db.UserAddress.update(
        { default: ADDRESS_DEFAULT.DEFAULT },
        {
          where: { id },
          transaction
        }
      )
    ]);

    await transaction.commit();
    return true;
  } catch (e) {
    console.log('ERROR_UPDATE_USER_PROFILE: ', e);
    if (transaction) await transaction.rollback();
    throw e;
  }
}

export async function deleteUserAddress(id) {
  try {
    const userAddress = await db.UserAddress.findByPk(id);
    if (!userAddress) {
      throw badRequest(
        'bonusWallet',
        FIELD_ERROR.BONUS_WALLET_NOT_FOUND,
        'Bonus wallet not found'
      );
    }

    await userAddress.destroy();

    return true;
  } catch (e) {
    console.log('ERROR_UPDATE_USER_PROFILE: ', e);
    throw e;
  }
}

export async function getListUser(query, { order, offset, limit }) {
  const { search, level, role } = query;

  const conditions = {
    status: USER_STATUS.ACTIVE
  };

  if (search) {
    conditions[Op.or] = [
      { email: { [Op.like]: `%${search}%` } },
      { username: { [Op.like]: `%${search}%` } },
      { userCode: { [Op.like]: `%${search}%` } },
      { phoneNumber: { [Op.like]: `%${search}%` } },
      { '$userInformation.fullName$': { [Op.like]: `%${search}%` } }
    ];
  }

  level && (conditions.level = level);
  role && (conditions.role = role);

  const result = await db.User.findAndCountAll({
    where: conditions,
    include: [
      {
        model: db.UserInformation,
        as: "userInformation"
      },
      {
        model: db.UserReferral,
        as: "userReferral"
      },
      {
        model: db.UserReferral,
        as: "userReferrer"
      },
      {
        model: db.UserBonus,
        as: "userBonus",
        separate: true,
        include: [
          {
            model: db.Order,
            as: "order"
          }
        ]
      }
    ],
    order,
    limit,
    offset
  });

  return result;
}

export async function getTopUserReferrer() {
  const result = await db.User.findAll({
    include: [
      {
        model: db.UserInformation,
        as: "userInformation"
      },
      {
        model: db.UserReferral,
        as: "userReferrer",
        required: true
      }
    ]
  });
  const sorted_userReferrer = result.sort((one, other) => {
    return other.userReferrer.length - one.userReferrer.length;
  });
  return sorted_userReferrer;
}

/**
 * Get user information
 * @param {*} userId
 */
export async function getUserDetail(userId) {
  const user = await db.User.findByPk(userId, {
    include: [
      {
        model: db.UserInformation,
        as: 'userInformation'
      }
    ]
  });

  return user;
}

/**
 * Get user information
 * @param {*} userId
 */
 export async function getMyReferrer(id) {

  const myReferrer = await db.UserReferral.findAll({
    where: {
      referrerId: id
    },
    include: [
      {
        model: db.User,
        as: 'register',
        include: [
          {
            model: db.UserInformation,
            as: 'userInformation'
          }
        ]
      }
    ]
  });

  return myReferrer;
}

export async function getListReferalUser (params) {
  const listUserReferal = await db.UserReferral.count({
    where: {
      referrerId: params.userId
    },
    include: [
      {
        model: db.User,
        as: 'register',
        where: {
          level: params.level
        }
      }
    ]
  });
  return listUserReferal;
}

export async function getTotalBonus (params) {
  let totalBonus = 0
  const receiverBonus = await db.UserBonus.sum("priceBonus", {
    where: {
      userId: params.userId,
      type: BONUS_TYPE.RECEIVER
    }
  });
  const withdrawBonus = await db.UserBonus.sum("priceBonus", {
    where: {
      userId: params.userId,
      type: BONUS_TYPE.WITHDRAW
    }
  });
  const requestBonus = await db.UserBonus.sum("priceBonus", {
    where: {
      userId: params.userId,
      type: BONUS_TYPE.REQUEST
    }
  });
  totalBonus = receiverBonus - withdrawBonus - requestBonus;
  return totalBonus;
}

export async function getListBonus (params) {
  const { userId } = params;
  const conditions = []

  userId && (conditions.userId = userId);

  const listBonusOfUser = await db.UserBonus.findAll({
    where: conditions
  });
  return listBonusOfUser;
}

export async function geMyBonus (user) {

  const listBonusOfUser = await db.UserBonus.findAll({
    where: {
      userId: user.id
    },
    include: [
      {
        model: db.Order,
        as: 'order',
        include: [
          {
            model: db.User,
            as: 'user'
          }
        ]
      }
    ]
  });
  return listBonusOfUser;
}

export async function getUserByUserCode (params) {
  return db.User.findOne({
    where: {
      userCode: params.userCode
    }
  });
}

export async function withdrawBonusUser(body) {
  const total = await getTotalBonus({ userId: body.userId });
  if (body.priceBonus > total) {
    throw badRequest(
      "withdraw",
      FIELD_ERROR.NOT_ENOUGH_BONUS_WITHDRAW,
      "Not enough bonus withdraw"
    );
  }

  await db.UserBonus.create(body);
  return true;
}

export async function updateTypeUser(id, body) {
  console.log(body)
  await db.UserBonus.update(
    {
      type: body.type
    },
    {
      where: {
        id
      }
    }
  );
  return true;
}