import express from 'express';
import { pagingParse } from '../middleware/paging.middleware';
import { changeStatusProduct, changeStatusProductCategory, createCategory, createProduct, deleteCategory, deleteProduct, getCapacityProduct, getCategoryWithPaging, getDetailCategory, getDetailProduct, getListCategory, getListProduct, getProductBySlug, updateCategory, updateProduct } from '../service/product.service';
import { successResponse } from '../util/response.util';
import { changeStatusProductValidator, createCategoryValidator, createProductValidator, updateCategoryValidator, updateProductValidator } from '../validator/product.validator';
import { isAuthenticated } from '../middleware/permission';
import { MODULE } from '../constants/common.constant';

const product = express.Router();

/**
 * ================ CONTORLLER PRODUCT ====================
 */
product.get(
  '/',
  [pagingParse({ column: 'id', dir: 'desc' })],
  (req, res, next) => {
    return getListProduct(req.query, req.paging)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

product.get(
  '/detail-product/:id',
  (req, res, next) => {
    return getDetailProduct(req.params.id)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

product.post(
  '/new-product',
  isAuthenticated([MODULE.PRODUCT]),
  [createProductValidator],
  (req, res, next) => {
    return createProduct(req.body)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

product.put(
  '/update-product',
  isAuthenticated([MODULE.PRODUCT]),
  [updateProductValidator],
  (req, res, next) => {
    return updateProduct(req.body)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

product.put(
  '/change-status-product',
  [changeStatusProductValidator],
  (req, res, next) => {
    return changeStatusProduct(req.body)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);
product.get(
  '/get-by-slug',
  (req, res, next) => {
    return getProductBySlug(req.query)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

product.get(
  '/get-capacity-product',
  (req, res, next) => {
    return getCapacityProduct(req.query)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

product.delete(
  '/delete-product/:id',
  isAuthenticated([MODULE.PRODUCT]),
  (req, res, next) => {
    return deleteProduct(req.params.id)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

/**
 * ================ CONTORLLER CATEGORY ====================
 */
product.get(
  "/get-list-category",
  (req, res, next) => {
    return getListCategory()
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

product.get(
  "/get-list-category-with-paging",
  [pagingParse({ column: "id", dir: "desc" })],
  (req, res, next) => {
    return getCategoryWithPaging(req.query, req.paging)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

product.post(
  "/new-category",
  isAuthenticated([MODULE.PRODUCT]),
  [createCategoryValidator],
  (req, res, next) => {
    return createCategory(req.body)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

product.put(
  '/update-category',
  isAuthenticated([MODULE.PRODUCT]),
  [updateCategoryValidator],
  (req, res, next) => {
    return updateCategory(req.body)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

product.delete(
  '/delete-category/:id',
  isAuthenticated([MODULE.PRODUCT]),
  (req, res, next) => {
    return deleteCategory(req.params.id)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

product.get(
  '/detail-category/:id',
  async (req, res, next) => {
    return getDetailCategory(req.params.id)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

product.put(
  '/change-status-product-category',
  [changeStatusProductValidator],
  (req, res, next) => {
    return changeStatusProductCategory(req.body)
      .then((t) => successResponse(res, t))
      .catch(next);
  }
);

export function initWebProductController(app) {
  app.use('/api/product', product);
}
