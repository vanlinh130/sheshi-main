import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { set } from "@/store/slices/productModalSlice";
import Button from "@/components/button";
import numberWithCommas from "@/utils/number-with-commas";

const ProductCard = (props) => {
  const dispatch = useDispatch();

  return (
    <div className={props.class}>
      <div className="product-card">
        <div className="product-card__image">
          {/*<span className="ribbons"><span className="newness ribbon">Mới</span></span>
          <span className="ribbons"><span className="onsale ribbon">Khuyến mãi</span></span>
          <span className="ribbons"><span className="featured ribbon">Hết hàng</span></span>
          <span className="ribbons"><span className="out-of-stock ribbon">Hết hàng</span></span> */}
          <Link to={`/san-pham/${props.slug}`}>
            <img src={props.img01} alt={props.name} />
          </Link>
          <div className="product-card__btn">
            <Button onClick={() => dispatch(set(props.slug))}>
              <i className="bi bi-bag-plus"></i>
            </Button>
          </div>
        </div>
        <h3 className="product-card__name text-break text-break-ellipsis-two-lines">
          <Link to={`/san-pham/${props.slug}`}>{props.name}</Link>
        </h3>
        <div className="product-card__price">
          {props.priceDiscount
            ? numberWithCommas(props.priceDiscount)
            : numberWithCommas(props.price)}
          {props.priceDiscount && (
            <span className="product-card__price__old">
              <del>{numberWithCommas(props.price)}</del>
            </span>
          )}
          đ
        </div>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  img01: PropTypes.string,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  priceDiscount: PropTypes.number,
  slug: PropTypes.string.isRequired,
};

export default ProductCard;
