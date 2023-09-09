import React, { useEffect, useState } from "react";
import Container from "@/components/container";
import productData from "@/apis/productApis";
import ProductCard from "@/components/product-card";
import { useLocation } from "react-router-dom";
import { GLOBAL_STATUS } from "@/constants";
const Search = () => {
  const [productList, setProductList] = useState([]);
  const getKeyword = useLocation().search;
  const keyword = getKeyword.replace("?keyword=", "");
  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, " ");
  };
  const keywordShow = decodeURI(escapeRegExp(keyword));

  const getProduct = async () => {
    const fetchProduct = await productData.getAllProducts({
      name: keywordShow,
      getMainImage: true,
      status: GLOBAL_STATUS.ACTIVE,
    });
    setProductList(fetchProduct.rows);
  };
  useEffect(() => {
    getProduct()
  }, []);

  return (
    <Container title="Tìm kiếm">
      <div className="search-page">
        <div className="container">
          <h3 className="title">Tìm kiếm</h3>
          {productList.length !== 0 && (
            <p className="subtext-result mb-4">
              Kết quả tìm kiếm cho <strong>"{keywordShow}"</strong>
            </p>
          )}
          {productList.length === 0 && (
            <p className="subtext-result mb-4">
              Không tìm thấy sản phẩm nào với tên{" "}
              <strong>"{keywordShow}"</strong>
            </p>
          )}
          <div className="row">
            {productList.length !== 0 &&
              productList.map((item, index) => (
                <ProductCard
                  class={"col-lg-3 col-sm-6 col-xs-6"}
                  key={index}
                  img01={item.productImage[0]?.image}
                  name={item.name}
                  price={Number(item.productDetail[0]?.price)}
                  priceDiscount={
                    item.discount
                      ? Number(
                        item.price -
                        (item.price * item.discount.discountPercent) / 100
                      )
                      : null
                  }
                  slug={item.productSlug}
                />
              ))}
          </div>
        </div>
      </div>
    </Container>
  );
};
export default Search;
