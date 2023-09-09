import accountSlice from "./accountSlice";
import commonSlice from "./commonSlice";
import cartItemsReducer from "./cartItemsSlide";
import productModalReducer from "./productModalSlice";

export const rootReducer = () => ({
  account: accountSlice,
  common: commonSlice,
  cartItems: cartItemsReducer,
  productModal: productModalReducer,
});
