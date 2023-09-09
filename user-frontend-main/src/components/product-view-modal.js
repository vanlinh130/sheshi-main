import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProductViewCom from "@/components/product-view-com";
import Button from "@/components/button";
import { remove } from "@/store/slices/productModalSlice";
import productsApis from "@/apis/productApis";

const ProductViewModal = () => {
  const productSlug = useSelector((state) => state.productModal.value);
  const dispatch = useDispatch();

  const [product, setProduct] = useState([]);

  const getProduct = async() => {
    if (productSlug) {
      const params = {
        productSlug: productSlug,
      };

      const result = await productsApis.getProducts(params);
      setProduct(result);
    }
  }
  useEffect(() => {
    getProduct()
  }, [productSlug]);

  return (
    <div
      className={`product-view__modal ${product.length === 0 ? "" : "active"}`}
    >
      <div className="product-view__modal__content">
        {product.length !== 0 && <ProductViewCom product={product} />}
        <div className="product-view__modal__content__close">
          <Button onClick={() => dispatch(remove())}>
            <i className="bi bi-x-lg"></i>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductViewModal;
