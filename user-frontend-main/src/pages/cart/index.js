import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Container from "@/components/container";
import CartItem from "@/components/cart-item";
import Button from "@/components/button";
import CartEmpty from "@/components/cart-empty";
import TopNavCart from "@/components/top-nav-cart";
import { getCartItemsInfo } from "@/apis/productApis";
import numberWithCommas from "@/utils/number-with-commas";

const Cart = () => {
  const cartItems = useSelector((state) => state.cartItems.value);

  const [cartProducts, setCartProducts] = useState();

  const [totalProducts, setTotalProducts] = useState(0);

  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    getCartInfo()
    setTotalPrice(
      cartItems.reduce(
        (total, item) => total + Number(item.quantity) * Number(item.price),
        0
      )
    );
    setTotalProducts(
      cartItems.reduce((total, item) => total + Number(item.quantity), 0)
    );
  }, [cartItems]);

  const getCartInfo = async () => {
    const cartItemInfo = await getCartItemsInfo(cartItems)
    setCartProducts(cartItemInfo);
  }

  return (
    <Container title="Giỏ hàng">
      <div className="cart-page">
        <div className="container">
          {cartProducts && cartProducts.length === 0 && <CartEmpty />}

          {cartProducts && cartProducts.length !== 0 && (
            <>
              <TopNavCart />
              <div className="tab-content">
                <div role="tabpanel" className="tab-pane active show">
                  <div className="cart-section-1">
                    <div className="cart">
                      <div className="cart__list">
                        {cartProducts.map((item, index) => (
                          <CartItem item={item} key={index} />
                        ))}
                      </div>

                      <div className="cart__info">
                        <div className="cart__info__txt">
                          <p>
                            Bạn đang có {totalProducts} sản phẩm trong giỏ hàng
                          </p>
                          <div className="cart__info__txt__price">
                            <span>Thành tiền:</span>{" "}
                            <span>{numberWithCommas(Number(totalPrice))}đ</span>
                          </div>
                        </div>
                        <div className="cart__info__btn">
                          <Link to="/san-pham">
                            <Button
                              className="btn-outline-primary"
                              size="block"
                            >
                              Tiếp tục mua hàng
                            </Button>
                          </Link>
                          <Link to="/payment-confirm">
                            <Button className="btn-primary" size="block">
                              Đặt hàng
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Container>
  );
};

export default Cart;
