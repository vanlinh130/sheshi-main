import db from '../db/models';
import { badRequest, FIELD_ERROR } from '../config/error';
import { GLOBAL_STATUS, GLOBAL_SWITCH } from '../constants/common.constant';

const { Op } = db.Sequelize;

/**
 * Get list product
 * @param {*} query
 * @param {*} paging
 */
export async function getListProduct(query, { offset, limit, order }) {
  const {
    name,
    status,
    outstanding,
    originId,
    branchId,
    capacityId,
    colorId,
    discount,
    getMainImage,
    unitId,
    price,
    categoryId
  } = query;
  const conditions = {};

  status && (conditions.status = status);
  outstanding && (conditions.outstanding = outstanding);
  originId && (conditions.originId = originId);
  branchId && (conditions.branchId = branchId);
  colorId && (conditions.colorId = colorId);
  capacityId && (conditions.capacityId = capacityId);
  categoryId && (conditions.categoryId = categoryId);
  unitId && (conditions.unitId = unitId);
  price && (conditions.price = { [Op.lt]: price });
  name && (conditions.name = { [Op.like]: `%${name.trim()}%` });

  const products = await db.Product.findAndCountAll({
    where: conditions,
    include: [
      {
        model: db.ProductCategory,
        as: 'productCategory',
        where: { status: GLOBAL_STATUS.ACTIVE }
      },
      {
        model: db.ProductImage,
        as: 'productImage',
        separate: true,
        where: {
          isMain: getMainImage
            ? GLOBAL_SWITCH.ON
            : [GLOBAL_SWITCH.ON, GLOBAL_SWITCH.OFF]
        }
      },
      {
        model: db.ProductInventory,
        as: 'productInventory',
        separate: true
      },
      {
        model: db.ProductDetail,
        as: 'productDetail',
        separate: true
      },
      {
        model: db.Discount,
        as: 'discount',
        required: !!discount,
        where: { status: GLOBAL_STATUS.ACTIVE }
      }
    ],
    offset,
    limit,
    order
  });

  return products;
}

/**
 * Get detail product
 * @param {*} id
 */
 export async function getDetailProduct(id) {
  const products = await db.Product.findOne({
    where: { id },
    include: [
      {
        model: db.ProductCategory,
        as: "productCategory",
        where: { status: GLOBAL_STATUS.ACTIVE }
      },
      {
        model: db.ProductImage,
        as: "productImage"
      },
      {
        model: db.ProductInventory,
        as: "productInventory"
      },
      {
        model: db.ProductDetail,
        as: "productDetail"
      },
      {
        model: db.Discount,
        as: "discount"
      }
    ],
    order: [
      ['productDetail', 'id', 'ASC']
    ]
  });

  if (!products) {
    throw badRequest('get_product', FIELD_ERROR.PRODUCT_NOT_FOUND, 'Product not found');
  }

  return products;
}

/**
 * Get product detail
 * @param {*} id
 */
 export async function getCapacityProduct(body) {
  const products = await db.ProductDetail.findOne({
    where: body
  });

  return products;
}

/**
 * Get product by slug
 * @param {*} query
 */
 export async function getProductBySlug(query) {
  const { productSlug, getMainImage } = query;
  const conditions = {
    status: GLOBAL_STATUS.ACTIVE
  };

  productSlug && (conditions.productSlug = productSlug);

  const products = await db.Product.findOne({
    where: conditions,
    include: [
      {
        model: db.ProductCategory,
        as: 'productCategory',
        where: { status: GLOBAL_STATUS.ACTIVE }
      },
      {
        model: db.ProductInventory,
        as: 'productInventory'
      },
      {
        model: db.Discount,
        as: 'discount',
        required: false,
        where: { status: GLOBAL_STATUS.ACTIVE }
      },
      {
        model: db.ProductDetail,
        as: 'productDetail',
        separate: true
      },
      {
        model: db.ProductImage,
        as: 'productImage',
        separate: true,
        where: {
          isMain: getMainImage
            ? GLOBAL_SWITCH.ON
            : [GLOBAL_SWITCH.ON, GLOBAL_SWITCH.OFF]
        }
      }
    ]
  });

  if (!products) {
    throw badRequest('get_product', FIELD_ERROR.PRODUCT_NOT_FOUND, 'Product not found');
  }

  return products;
}

/**
 * Register product
 * @param {*} product form
 * @returns
 */
 export async function createProduct(createProductForm) {
  const t = await db.sequelize.transaction();
  let subProductId = 0;

  try {
    if (createProductForm.productSlug) {
      const slugExist = await db.Product.findOne({where: {
        productSlug: createProductForm.productSlug
      }})

      // Check create order detail
      if (slugExist) {
        throw badRequest(
          'check_slug',
          FIELD_ERROR.SLUG_IS_EXISTS,
          'Slug is exists'
        );
      }
    }

    // Create order detail
    const product = await db.Product.create(createProductForm, {
      transaction: t
    });

    // Check create order detail
    if (!product) {
      throw badRequest(
        'create_product',
        FIELD_ERROR.CREATE_PRODUCT_FAILED,
        'Create product not success'
      );
    }

    // Create detail product
    for (const subProduct of createProductForm.productDetail) {
      await db.ProductDetail.create({
        id: subProductId,
        ...subProduct,
        productId: product.id
      }, {
        transaction: t
      });

      await db.ProductInventory.create(
        {
          productId: product.id,
          subProductId,
          quantity: subProduct.quantity
        },
        {
          transaction: t
        }
      );
      subProductId += 1;
    }

    // Create main image
    await db.ProductImage.create(
      {
        productId: product.id,
        image: createProductForm.mainImage,
        isMain: GLOBAL_SWITCH.ON,
        status: GLOBAL_STATUS.ACTIVE
      },
      {
        transaction: t
      }
    );

    // Create sub-image
    for (const subImage of createProductForm.subImage) {
          // Create main image
      await db.ProductImage.create(
        {
          productId: product.id,
          image: subImage.url,
          isMain: GLOBAL_SWITCH.OFF,
          status: GLOBAL_STATUS.ACTIVE
        },
        {
          transaction: t
        }
      );
    };

    // Commit transaction
    await t.commit();

    return true;
  } catch (e) {
    console.log('ERROR_CREATE_PRODUCT: ', e);
    if (t) await t.rollback();
    throw e;
  }
}

/**
 * Change status product
 * @param {*} body form
 * @returns
 */
 export async function changeStatusProduct(body) {
   try {
     await db.Product.update(
       { status: body.status },
       { where: { id: body.id } }
     );
     return true;
   } catch (e) {
     console.log("ERROR_UPDATE_STATUS: ", e);
     throw e;
   }
 }

/**
 * Change status product
 * @param {*} body form
 * @returns
 */
 export async function changeStatusProductCategory(body) {
  try {
    await db.ProductCategory.update(
      { status: body.status },
      { where: { id: body.id } }
    );
    return true;
  } catch (e) {
    console.log("ERROR_UPDATE_STATUS: ", e);
    throw e;
  }
}

/**
 * Update product
 * @param {*} updateProductForm form
 * @returns
 */
 export async function updateProduct(updateProductForm) {
  const t = await db.sequelize.transaction();
  let subProductId = 0;

  try {
    if (updateProductForm.productSlug) {
      const slugExist = await db.Product.findOne({
        where: {
          productSlug: updateProductForm.productSlug,
          id: { [Op.not]: updateProductForm.id }
        }
      });
      // Check create order detail
      if (slugExist) {
        throw badRequest(
          "check_slug",
          FIELD_ERROR.SLUG_IS_EXISTS,
          "Slug is exists"
        );
      }
    }

    // Create order detail
    await db.Product.update(updateProductForm, {
      where: { id: updateProductForm.id },
      transaction: t
    });

    // Delete old product inventory & detail
    await db.ProductInventory.destroy({
      where: {
        productId: updateProductForm.id
      },
      transaction: t
    });

    await db.ProductDetail.destroy({
      where: {
        productId: updateProductForm.id
      },
      transaction: t
    });

    // Create new detail product
    for (const subProduct of updateProductForm.productDetail) {
      await db.ProductDetail.create({
        ...subProduct,
        id: subProductId,
        productId: updateProductForm.id
      }, {
        transaction: t
      });

      await db.ProductInventory.create(
        {
          productId: updateProductForm.id,
          subProductId,
          quantity: subProduct.quantity
        },
        {
          transaction: t
        }
      );
      subProductId += 1;
    }

    // Delete old main image
    await db.ProductImage.destroy({
      where: {
        productId: updateProductForm.id
      }
    });
    // Create main image
    await db.ProductImage.create(
      {
        productId: updateProductForm.id,
        image: updateProductForm.mainImage,
        isMain: GLOBAL_SWITCH.ON,
        status: GLOBAL_STATUS.ACTIVE
      },
      {
        transaction: t
      }
    );

    // Create sub-image
    for (const subImage of updateProductForm.subImage) {
          // Create main image
      await db.ProductImage.create(
        {
          productId: updateProductForm.id,
          image: subImage.url,
          isMain: GLOBAL_SWITCH.OFF,
          status: GLOBAL_STATUS.ACTIVE
        },
        {
          transaction: t
        }
      );
    };

    // Commit transaction
    await t.commit();

    return true;
  } catch (e) {
    console.log('ERROR_UPDATE_PRODUCT: ', e);
    if (t) await t.rollback();
    throw e;
  }
}

/**
 * Delete product
 * @param {*} body
 */
 export async function deleteProduct(id) {
  try {
    await db.Product.destroy({ where: { id } });
    await db.ProductImage.destroy({ where: { productId: id } });
    await db.ProductInventory.destroy({ where: { productId: id } });
    await db.ProductDetail.destroy({ where: { productId: id } });
    return true;
  } catch (e) {
    console.log("ERROR_DELETE_PRODUCT: ", e);
    throw e;
  }
}
// ================ CONTORLER CATEGORY ====================
/**
 * Get list category for combobox
 */
 export async function getListCategory() {
  const listProductCategory = await db.ProductCategory.findAll({
    where: { status: GLOBAL_STATUS.ACTIVE }
  });

  return listProductCategory;
}

/**
 * Get list category for paging
 * @param {*} query
 * @param {*} paging
 */
 export async function getCategoryWithPaging(query, { offset, limit, order }) {
  const { name, status } = query;
  const conditions = {};

  name && (conditions.name = { [Op.like]: `%${name.trim()}%` });
  status && (conditions.status = status);

  const listProductCategory = await db.ProductCategory.findAndCountAll({
    where: conditions,
    offset,
    limit,
    order
  });

  return listProductCategory;
}

/**
 * Get detail category
 * @param {*} id
 */
 export async function getDetailCategory(id) {
  const productCategory = await db.ProductCategory.findOne({
    where: { id }
  });

  if (!productCategory) {
    throw badRequest('get_product', FIELD_ERROR.PRODUCT_NOT_FOUND, 'Product not found');
  }

  return productCategory;
}

/**
 * Create new category
 * @param {*} body
 */
 export async function createCategory(body) {
  try {
    const category = {
      ...body,
      status: GLOBAL_STATUS.ACTIVE
    };

    if (category.categorySlug) {
       const slugExist = await db.ProductCategory.findOne({
         where: {
           categorySlug: body.categorySlug
         }
       });

       // Check create order detail
       if (slugExist) {
         throw badRequest(
           "check_slug",
           FIELD_ERROR.SLUG_IS_EXISTS,
           "Slug is exists"
         );
       }
     }

     await db.ProductCategory.create(category);
     return true;
   } catch (e) {
     console.log("ERROR_CREATE_CATEGORY: ", e);
     throw e;
   }
}

/**
 * Update category
 * @param {*} body
 */
 export async function updateCategory(body) {
  try {
    const category = {
      ...body
    };

    if (category.categorySlug) {
      const slugExist = await db.ProductCategory.findOne({
        where: {
          categorySlug: category.categorySlug,
          id: { [Op.not]: category.id }
        }
      });

      // Check create order detail
      if (slugExist) {
        throw badRequest(
          'check_slug',
          FIELD_ERROR.SLUG_IS_EXISTS,
          'Slug is exists'
        );
      }
    }

    await db.ProductCategory.update(category, { where: { id: body.id } });
    return true;
  } catch (e) {
    console.log("ERROR_UPDATE_CATEGORY: ", e);
    throw e;
  }
}

/**
 * Update category
 * @param {*} body
 */
 export async function deleteCategory(id) {
  try {
    await db.ProductCategory.destroy({ where: { id } });
    return true;
  } catch (e) {
    console.log("ERROR_DELETE_CATEGORY: ", e);
    throw e;
  }
}