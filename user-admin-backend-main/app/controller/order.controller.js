import express from 'express';
import { isAuthenticated } from '../middleware/permission';
import { calculatorFeeGhtk, cancelOrder, createOrder, createPaymentMomo, createPaymentVnpay, getListOrder, getListOrderWithCondition, getOrderByMailAndCode, getOrderRef, getOrderUser, getTotalPriceWithMonth, sendMailComplete, updateStatusOrder } from '../service/order.service';
import { successResponse } from '../util/response.util';
import { newOrderValidator, updateStatusOrderValidator } from '../validator/order.validator';
import { pagingParse } from '../middleware/paging.middleware';
import { MODULE } from '../constants/common.constant';

const order = express.Router();

order.post(
  '/new-order',
  [newOrderValidator],
  async (req, res, next) => {
    return createOrder(req.body)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);
order.get(
  '/my-order',
  [isAuthenticated()],
  async (req, res, next) => {
    return getOrderUser(req.user)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);
order.get(
  '/refs-order',
  [isAuthenticated()],
  async (req, res, next) => {
    return getOrderRef(req.user)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);
order.get(
  '/my-order/:orderCode',
  [isAuthenticated()],
  async (req, res, next) => {
    return getOrderUser(req.user, req.params.orderCode)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);
order.get(
  '/search-order',
  async (req, res, next) => {
    return getOrderByMailAndCode(req.query)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);
order.get(
  '/total-price-with-month',
  async (req, res, next) => {
    return getTotalPriceWithMonth(req.query)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

order.get(
  '/list-order',
  [pagingParse({ column: 'id', dir: 'desc' })],
  [isAuthenticated([MODULE.ORDER])],
  (req, res, next) => {
    return getListOrder(req.query, req.paging)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);
order.get(
  "/list-order-with-conditions",
  [isAuthenticated([MODULE.ORDER, MODULE.DASHBOARD])],
  (req, res, next) => {
    return getListOrderWithCondition(req.query)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

order.put(
  "/update-order/:id",
  [updateStatusOrderValidator],
  (req, res, next) => {
    return updateStatusOrder(req.params.id, req.body)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);
order.put(
  '/cancel-order/:id',
  [updateStatusOrderValidator],
  (req, res, next) => {
    return cancelOrder(req.params.id, req.body)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);
order.post("/create_payment_vnpay", async (req, res, next) => {
  return createPaymentVnpay(req)
    .then((t) => successResponse(res, t))
    .catch(next);
});
order.post("/send_mail", async (req, res, next) => {
  return sendMailComplete(req.body)
    .then((t) => successResponse(res, t))
    .catch(next);
});
order.post("/create_payment_momo", async (req, res, next) => {
  return createPaymentMomo(req.body)
    .then((t) => successResponse(res, t))
    .catch(next);
});
order.get("/calculator-fee-ghtk", async (req, res, next) => {
  return calculatorFeeGhtk(req.query)
    .then((t) => successResponse(res, t))
    .catch(next);
});

export function initWebOrderController(app) {
  app.use("/api/order", order);
}
