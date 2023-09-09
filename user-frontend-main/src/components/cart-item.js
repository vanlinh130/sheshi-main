import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { updateItem, removeItem } from "@/store/slices/cartItemsSlide";
import numberWithCommas from "@/utils/number-with-commas";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const CartItem = (props) => {
  const dispatch = useDispatch();

  const itemRef = useRef(null);

  const [item, setItem] = useState(props.item);
  const [quantity, setQuantity] = useState(+props.item.quantity);

  useEffect(() => {
    setItem(props.item);
    setQuantity(props.item.quantity);
  }, [props.item]);

  const checkQuantity = (quantityInput) => {
    if (quantityInput > item.totalQuantity) {
      setQuantity(item.totalQuantity)
      dispatch(updateItem({ ...item, quantity: item.totalQuantity }));
      toast.error(
        `Sản phẩm ${
          item.product.name + " " + item.capacity
        } hiện tại không đủ, chỉ còn ${item.totalQuantity} sản phẩm trong kho`,
        { position: toast.POSITION.TOP_CENTER }
      );
      return false
    }
    return true
  }
  const updateQuantity = (opt) => {
    if (opt === "+") {
      if (!checkQuantity(+quantity + 1)) return;
      if (+quantity === 999) return
      dispatch(updateItem({ ...item, quantity: quantity + 1 }));
    }
    if (opt === "-") {
      dispatch(
        updateItem({ ...item, quantity: quantity - 1 === 0 ? 1 : quantity - 1 })
      );
    }
  };

  const removeCartItem = () => {
    dispatch(removeItem(item));
  };

  return (
    <div className="cart__item" ref={itemRef}>
      <div className="cart__item__image">
        <img src={item.product.productImage[0].image} alt="" />
      </div>
      <div className="cart__item__info">
        <div className="cart__item__info__name">
          <Link to={`/san-pham/${item.slug}`}>
            {`${item.product.name}`} - {item.capacity}
          </Link>
        </div>
        <div className="cart__item__info__price">
          {numberWithCommas(item.price)}đ
        </div>
        <div className="cart__item__info__quantity">
          <div className="product__info__item__quantity">
            <div
              className="product__info__item__quantity__btn"
              onClick={() => updateQuantity("-")}
            >
              -
            </div>
            <input
              value={quantity}
              onChange={(e) => {
                if (!+e.target.value) return;
                if (!checkQuantity(+e.target.value)) return;
                setQuantity(+e.target.value);
                dispatch(updateItem({ ...item, quantity: +e.target.value }));
              }}
              className="product__info__item__quantity__input inputnumber"
              maxLength={3}
            />
            <div
              className="product__info__item__quantity__btn"
              onClick={() => updateQuantity("+")}
            >
              +
            </div>
          </div>
        </div>
        <div className="cart__item__del">
          <i
            className="bi bi-x-circle-fill"
            onClick={() => removeCartItem()}
          ></i>
        </div>
      </div>
    </div>
  );
};

CartItem.propTypes = {
  item: PropTypes.object,
};

export default CartItem;
