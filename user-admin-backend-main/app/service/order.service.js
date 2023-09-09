import BigNumber from 'bignumber.js';
import moment from "moment";
import axios from "axios";
import crypto from "crypto";
import querystring from "qs";
import { mailAwsService } from "./common/ses.service";
import { BONUS_TYPE, COMMISSION_TYPE, DELIVERY_METHOD_MAP, GLOBAL_STATUS, GLOBAL_SWITCH, MASTER_DATA_NAME, PAYMENT_METHOD_MAP, STATUS_ORDER } from '../constants/common.constant';
import { badRequest, FIELD_ERROR } from '../config/error';
import db from '../db/models';
import { ORDER_CODE, ORDER_STATUS } from '../db/models/order/order';
import { getNextOrderCode } from '../util/helper.util';

const numberWithCommas = (num) =>
  num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const { Op } = db.Sequelize;
const GUEST = 'GUEST'
const USER = 'USER'
const sortObject = (obj) => {
  const sorted = {};
  const str = [];
  let key;
  for (key in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  // eslint-disable-next-line no-plusplus
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
};

async function createOrderItem(product, orderId, userId, transaction) {
  const subProduct = await db.ProductDetail.findOne({
    where: {
      productId: product.product.id,
      unitId: product.unitId,
      capacityId: product.capacityId
    }
  })

  // Search product is exist
  const productDB = await db.Product.findOne({
    where: { id: product.product.id, status: GLOBAL_STATUS.ACTIVE },
    include: [
      {
        model: db.ProductInventory,
        as: 'productInventory',
        where: {
          subProductId: subProduct.id
        }
      },
      {
        model: db.ProductCategory,
        as: 'productCategory',
        where: { status: GLOBAL_STATUS.ACTIVE }
      }
    ]
  });
  if (!productDB) {
    throw badRequest(
      'get_product',
      FIELD_ERROR.PRODUCT_NOT_FOUND,
      'Product not found'
    );
  }

  if (productDB.productInventory.length === 0 || productDB.productInventory[0].quantity < product.quantity) {
    throw badRequest(
      'quantity_not_enough',
      FIELD_ERROR.QUANTITY_NOT_ENGOUGH,
      `Product ${productDB.name} quantity not enough`
    )
  }
  // Create order item
  await db.OrderItem.create(
    {
      orderId,
      userId,
      productId: product.product.id,
      subProductId: subProduct.id,
      quantity: product.quantity,
      price: product.price
    },
    {
      transaction
    }
  );
  // Decrease quantity of product
  await db.ProductInventory.decrement(
    {
      quantity: +product.quantity
    },
    {
      where: { productId: product.product.id, subProductId: subProduct.id },
      transaction
    }
  );
  return product.quantity * product.price;
}

function genarateProductHtmlTemplate(products) {
  let productHtml = "";
  for (const product of products) {
    productHtml += `
    <tr style="color:#000000">
      <td align="left" width="15"></td>
      <td align="left"
        style="font-family:Helvetica,'Arial',sans-serif;font-weight:normal">
        <span
          style="font-size:11px;line-height:18px">${product.quantity}x&nbsp;&nbsp;</span>
        <span style="font-size:11px;font-weight:bold">${product.product.name}</span>
      </td>
      <td align="left"
        style="font-family:Helvetica,'Arial',sans-serif;font-weight:normal">
        <span
          style="font-size:11px;line-height:18px">&nbsp;&nbsp;₫
          ${product.price}</span>
      </td>
      <td align="right" width="15"></td>
    </tr>`;
  }
  return productHtml
}

export async function sendMailComplete(body) {
  try {
    const subject = body.subject;
    const toEmails = body.toEmails;
    const params = body;
    const templateName = "order-success";
    params.listProduct = genarateProductHtmlTemplate(body.products)
    await mailAwsService.sendMail({ templateName, params, subject, toEmails });
    return true;
  } catch (e) {
    throw e;
  }
}

/**
 * Create new order
 * @param {*} order form
 * @returns
 */
export async function createOrder(createOrderForm) {
  const t = await db.sequelize.transaction();

  try {
    let commission = 0;
    let identification = GUEST;
    let totalBeforeFee = 0;
    const deliveryFee = createOrderForm.fee ? createOrderForm.fee : 0;

    const userInfo = await db.User.findOne({
      where: { id: createOrderForm.userId },
      include: [
        {
          model: db.CommissionLevel,
          as: "commissionLevel",
          include: [
            {
              model: db.CommissionConfig,
              as: "commissionConfig",
              where: { type: COMMISSION_TYPE.AUTOMATION }
            }
          ]
        }
      ]
    });

    // Create order detail
    const orderCode = await getNextOrderCode(db.Order);

    // Create payment detail
    const payment = await db.OrderPayment.create(
      {
        paymentMethod: createOrderForm.paymentMethod
      },
      {
        transaction: t
      }
    );

    const account = await db.User.findOne({
      where: {
        id: createOrderForm.userId
      },
      attributes: { exclude: ['password'] },
      include: [
        {
          model: db.UserInformation,
          as: 'userInformation'
        },
        {
          model: db.UserAddress,
          as: 'userAddress'
        }
      ]
    });

    // Get total
    for (const product of createOrderForm.listProduct) {
      const totalPriceOfItem = product.quantity * product.price
      totalBeforeFee += totalPriceOfItem;
    };

    if (userInfo?.commissionLevel) {
      commission =
        (totalBeforeFee * +userInfo.commissionLevel.commissionConfig?.percent) /
        100;
    }

    if (account) {
      identification = USER
    }

    const order = await db.Order.create(
      {
        paymentId: payment.id,
        orderCode: `${ORDER_CODE}${orderCode}`,
        userId: createOrderForm.userId,
        identification,
        shipId: createOrderForm.deliveryMethod,
        fullName: createOrderForm.fullName,
        email: createOrderForm.email,
        telephone: createOrderForm.telephone,
        address: createOrderForm.address,
        cityCode: createOrderForm.cityCode,
        districtCode: createOrderForm.districtCode,
        wardCode: createOrderForm.wardCode,
        note: createOrderForm.note,
        referralCode: createOrderForm.referralCode,
        orderDate: new Date(),
        commission: commission > 0 ? commission : null,
        totalBeforeFee,
        total: new BigNumber(totalBeforeFee)
          .plus(new BigNumber(deliveryFee))
          .minus(commission),
        orderStatus: ORDER_STATUS.WAITTING_CONFIRM
      },
      {
        transaction: t
      }
    );

    // Check create order detail
    if (!order) {
      throw badRequest(
        'create_order',
        FIELD_ERROR.CREATE_ORDER_FAILED,
        'Order not success'
      );
    }

    // Create order items
    for (const product of createOrderForm.listProduct) {
      await createOrderItem(
        product,
        order.id,
        createOrderForm.userId,
        t
      );
    };

    // Commit transaction
    await t.commit();
    console.log(payment)
    sendMailComplete({
      toEmails: createOrderForm.email,
      orderCode: `${ORDER_CODE}${orderCode}`,
      subject: `[SHESHI] Đơn hàng của bạn : ${ORDER_CODE}${orderCode}`,
      total: numberWithCommas(
        new BigNumber(totalBeforeFee)
          .plus(new BigNumber(deliveryFee))
          .minus(commission)
      ),
      fullName: order.fullName,
      datetime: new Date().toLocaleString(),
      address: order.address,
      city: createOrderForm.districtAndCity.city,
      district: createOrderForm.districtAndCity.district,
      ward: createOrderForm.districtAndCity.ward,
      telephone: order.telephone,
      payment: PAYMENT_METHOD_MAP.find(
        (e) => e.value === +payment.paymentMethod
      ).label,
      unitTransit: DELIVERY_METHOD_MAP.find((e) => e.value === +order.shipId)
        .label,
      note: order.note,
      fee: numberWithCommas(deliveryFee),
      totalBeforeFee: numberWithCommas(totalBeforeFee),
      commission: commission > 0 ? numberWithCommas(commission) : 0,
      products: createOrderForm.listProduct
    });
    return {
      order: order
    };
  } catch (e) {
    console.log('ERROR_CREATE_ORDER: ', e);
    if (t) await t.rollback();
    throw e;
  }
}

/**
 * Get list order of user
 * @param {*} user form
 * @param {*} orderCode form
 * @returns
 */
 export async function getOrderUser(user, orderCode = null) {
  try {
    if (!orderCode) {
      const listOrder = await db.Order.findAll({
        where: {
          userId: user.id
        },
        include: [
          {
            model: db.OrderItem,
            as: 'orderItem'
          },
          {
            model: db.OrderPayment,
            as: 'orderPayment'
          }
        ]
      });
      return listOrder;
    }
    const orderOfUser = await db.Order.findOne({
      where: {
        userId: user.id,
        orderCode
      },
      include: [
        {
          model: db.OrderItem,
          as: 'orderItem'
        },
        {
          model: db.OrderPayment,
          as: 'orderPayment'
        }
      ]
    });
    return orderOfUser;
  } catch(e) {
    console.log('ERROR_GET_ORDER_INFO: ', e);
    throw e;
  }
}

/**
 * Get list order of refs
 * @param {*} user form
 * @returns
 */
 export async function getOrderRef(user) {
  try {
    const refIds = [];
    const myReferrer = await db.UserReferral.findAll({
      where: {
        referrerId: user.id
      }
    });

    for (const referrer of myReferrer) {
      refIds.push(referrer.registerId)
    }

    return db.Order.findAll({
      where: {
        userId: { [Op.in]: refIds },
        orderStatus: STATUS_ORDER.DELIVERED
      }
    });
  } catch(e) {
    console.log('ERROR_GET_ORDER_INFO: ', e);
    throw e;
  }
}

/**
 * Get order by mail and code
 * @param {*} params form
 * @returns
 */
 export async function getOrderByMailAndCode(params) {
  const { email, orderCode } = params

  if ( !email && !orderCode ) {
    throw badRequest(
      'order_code_and_email_is_required',
      FIELD_ERROR.ORDER_CODE_AND_EMAIL_IS_REQUIRED,
      `Need input order code and email`
    )
  }

  const conditions = {};
  email && (conditions.email = email)
  orderCode && (conditions.orderCode = orderCode)
  try {
    const listOrder = await db.Order.findOne({
      where: conditions,
      include: [
        {
          model: db.OrderItem,
          as: 'orderItem',
          include: [
            {
              model: db.Product,
              as: 'product',
              include: [
                {
                  model: db.ProductImage,
                  as: 'productImage',
                  separate: true,
                  where: { isMain : GLOBAL_SWITCH.ON }
                }
              ]
            }
          ]
        },
        {
          model: db.OrderPayment,
          as: 'orderPayment'
        }
      ]
    });

    return listOrder;
  } catch(e) {
    console.log('ERROR_GET_ORDER_INFO: ', e);
    throw e;
  }
}

/**
 * Get list order
 * @param {*} user
 * @param {*} query
 */
 export async function getListOrder(query, { offset, limit, order }) {
  const { fullName, orderStatus } = query;
  const conditions = {};

  fullName && (conditions.fullName = { [Op.like]: `%${fullName.trim()}%` });
  orderStatus && (conditions.orderStatus = orderStatus);

  return db.Order.findAndCountAll({
    where: conditions,
    include: [
      {
        model: db.OrderItem,
        as: 'orderItem',
        separate: true
      },
      {
        model: db.OrderPayment,
        as: 'orderPayment'
      }
    ],
    offset,
    limit,
    order
  });
}

/**
 * Get list order
 * @param {*} user
 * @param {*} query
 */
 export async function getListOrderWithCondition(query) {
  const { status, startDate, endDate } = query
  const conditions = {}

  status && (conditions.orderStatus = +status);
  startDate && endDate &&
    (conditions.orderDate = {
      [Op.between]: [startDate, endDate]
    });

  return db.Order.findAll({
    where: conditions
  });
}


/**
 * Update status order
 * @param {*} user
 * @param {*} formUpdate
 * @returns
 */
 export async function updateStatusOrder(id, body) {
  const transaction = await db.sequelize.transaction();
  try {
    const order = await db.Order.findOne({
      where: {
        id
      }
    })
    if (!order) {
      throw badRequest(
        "get_order",
        FIELD_ERROR.ORDER_NOT_FOUND,
        "Order not found"
      );
    }

    if (body.status === ORDER_STATUS.DELIVERED && order.referralCode) {
      const user = await db.User.findOne({
        where: {
          userCode: order.referralCode
        }
      });
      const percentCommission = await db.MasterData.findOne({
        where: {
          idMaster: MASTER_DATA_NAME.PERCENT_REFERRAL
        }
      });

      await db.UserBonus.create(
        {
          userId: user.id,
          orderId: order.id,
          referralId: order.userId,
          type: BONUS_TYPE.RECEIVER,
          priceBonus: (order.totalBeforeFee * +percentCommission.name) / 100
        },
        transaction
      );
    }
    if (body.status === ORDER_STATUS.REJECT) {
      for (const product of body.productDetail) {
        await db.ProductInventory.increment(
          {
            quantity: +product.quantity
          },
          {
            where: {
              productId: product.productId,
              subProductId: product.subProductId
            }
          },
          transaction
        );
      }
    }

    await db.Order.update(
      { orderStatus: body.status },
      { where: { id }, transaction }
    );

    await transaction.commit();
    return true;
  } catch (e) {
    console.log('ERROR_UPDATE_STATUS_ORDER: ', e);
    if (transaction) await transaction.rollback();
    throw e;
  }
}

/**
 * Cancel order
 * @param {*} user
 * @param {*} formUpdate
 * @returns
 */
 export async function cancelOrder(id, body) {
  const transaction = await db.sequelize.transaction();
  try {
    const order = await db.Order.findOne({
      where: {
        id
      }
    })
    if (!order) {
      throw badRequest(
        "get_order",
        FIELD_ERROR.ORDER_NOT_FOUND,
        "Order not found"
      );
    }

    for (const product of body.productDetail) {
      await db.ProductInventory.increment(
        {
          quantity: +product.quantity
        },
        {
          where: {
            productId: product.productId,
            subProductId: product.subProductId
          }
        }
      );
    }

    await db.Order.update(
      { orderStatus: body.status },
      { where: { id }, transaction }
    );

    await transaction.commit();
    return true;
  } catch (e) {
    console.log('ERROR_UPDATE_STATUS_ORDER: ', e);
    if (transaction) await transaction.rollback();
    throw e;
  }
}

export async function getTotalPriceWithMonth (params) {
  const startTime = new Date(params.startTime)
  const endTime = new Date(params.endTime);

  const totalPriceOfUser = await db.Order.sum("totalBeforeFee", {
    where: {
      userId: params.userId,
      orderDate: { [Op.between]: [startTime, endTime] },
      orderStatus: ORDER_STATUS.DELIVERED
    }
  });
  return totalPriceOfUser;
}

export async function createPaymentVnpay(req) {
  const ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  const tmnCode = process.env.VNPAY_TMN_CODE;
  const secretKey = process.env.VNPAY_SECRECT_KEY;
  let vnpUrl = process.env.VNPAY_VNP_URL;
  const returnUrl = req.body.returnUrl;

  const date = new Date();
  const createDate = moment(date).format("YYYYMMDDHHmmss");
  const orderId = moment(date).format("HHmmss");
  const amount = req.body.amount;
  const bankCode = req.body.bankCode;

  const orderInfo = req.body.orderDescription;
  const orderType = req.body.orderType;
  let locale = req.body.language;
  if (locale === null || locale === "") {
    locale = "vn";
  }
  const currCode = "VND";
  let vnp_Params = {};
  vnp_Params.vnp_Version = "2.1.0";
  vnp_Params.vnp_Command = "pay";
  vnp_Params.vnp_TmnCode = tmnCode;
  // vnp_Params['vnp_Merchant'] = ''
  vnp_Params.vnp_Locale = locale;
  vnp_Params.vnp_CurrCode = currCode;
  vnp_Params.vnp_TxnRef = orderId;
  vnp_Params.vnp_OrderInfo = orderInfo;
  vnp_Params.vnp_OrderType = orderType;
  vnp_Params.vnp_Amount = amount * 100;
  vnp_Params.vnp_ReturnUrl = returnUrl;
  vnp_Params.vnp_IpAddr = ipAddr;
  vnp_Params.vnp_CreateDate = createDate;
  if (bankCode !== null && bankCode !== "") {
    vnp_Params.vnp_BankCode = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  const signData = querystring.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  vnp_Params.vnp_SecureHash = signed;
  vnpUrl += `?${querystring.stringify(vnp_Params, { encode: false })}`;

  return vnpUrl;
}

export async function createPaymentMomo(body) {
  try {
    const momo_Params = body;
    const momoUrl = process.env.MOMO_MOMO_URL;

    momo_Params.accessKey = process.env.MOMO_ACCESS_KEY;
    momo_Params.partnerCode = process.env.MOMO_PARTNER_CODE;
    momo_Params.requestId =
      process.env.MOMO_PARTNER_CODE + new Date().getTime();
    momo_Params.orderId = process.env.MOMO_PARTNER_CODE + new Date().getTime();
    const rawSignature = `accessKey=${momo_Params.accessKey}&amount=${momo_Params.amount}&extraData=${momo_Params.extraData}&ipnUrl=${momo_Params.ipnUrl}&orderId=${momo_Params.orderId}&orderInfo=${momo_Params.orderInfo}&partnerCode=${momo_Params.partnerCode}&redirectUrl=${momo_Params.redirectUrl}&requestId=${momo_Params.requestId}&requestType=${momo_Params.requestType}`;

    const signed = crypto
      .createHmac("sha256", process.env.MOMO_SECRECT_KEY)
      .update(Buffer.from(rawSignature, "utf-8"))
      .digest("hex");
    momo_Params.signature = signed;
    momo_Params.lang = "vi";

    const response = await axios.post(momoUrl, JSON.stringify(momo_Params), {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return response.data.payUrl;
  } catch (e) {
    throw e;
  }
}
export async function calculatorFeeGhtk(query) {
  try {
    const rs = await axios.post(
      "https://services.giaohangtietkiem.vn/services/shipment/fee",
      query,
      {
        headers: {
          token: query.token
        }
      }
    );
    return rs.data;
  } catch (e) {
    throw e;
  }
}