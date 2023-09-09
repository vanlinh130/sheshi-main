import { createSlice } from "@reduxjs/toolkit";

const items =
  localStorage.getItem("cartItems") !== null
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [];

const cartInfomation =
  localStorage.getItem("cartInfomation") !== null
    ? JSON.parse(localStorage.getItem("cartInfomation"))
    : null;

const initialState = {
  value: items,
  infomation: cartInfomation
};

export const cartItemsSlice = createSlice({
  name: "cartItems",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const newItem = action.payload;
      const duplicate = state.value.filter(
        (e) =>
          e.slug === newItem.slug &&
          e.capacityId === newItem.capacityId &&
          e.unitId === newItem.unitId
      );
      if (duplicate.length > 0) {
        state.value = state.value.filter(
          (e) =>
            e.slug !== newItem.slug ||
            e.capacityId !== newItem.capacityId ||
            e.unitId !== newItem.unitId
        );
        state.value = [
          ...state.value,
          {
            id: duplicate[0].id,
            slug: newItem.slug,
            capacityId: newItem.capacityId,
            unitId: newItem.unitId,
            price: newItem.price,
            quantity: newItem.quantity + duplicate[0].quantity,
            capacity: newItem.capacity,
            totalQuantity: newItem.totalQuantity
          },
        ];
      } else {
        state.value = [
          ...state.value,
          {
            ...action.payload,
            id:
              state.value.length > 0
                ? state.value[state.value.length - 1].id + 1
                : 1,
          },
        ];
      }
      localStorage.setItem(
        "cartItems",
        JSON.stringify(
          state.value.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
        )
      );
    },
    updateItem: (state, action) => {
      const newItem = action.payload;
      const item = state.value.filter(
        (e) =>
          e.slug === newItem.slug &&
          e.capacityId === newItem.capacityId &&
          e.unitId === newItem.unitId
      );
      if (item.length > 0) {
        state.value = state.value.filter(
          (e) =>
            e.slug !== newItem.slug ||
            e.capacityId !== newItem.capacityId ||
            e.unitId !== newItem.unitId
        );
        state.value = [
          ...state.value,
          {
            id: item[0].id,
            slug: newItem.slug,
            capacityId: newItem.capacityId,
            unitId: newItem.unitId,
            price: newItem.price,
            quantity: newItem.quantity,
            capacity: newItem.capacity,
            totalQuantity: newItem.totalQuantity
          },
        ];
      }
      localStorage.setItem(
        "cartItems",
        JSON.stringify(
          state.value.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
        )
      );
    },
    removeItem: (state, action) => {
      const item = action.payload;
      state.value = state.value.filter(
        (e) =>
          e.slug !== item.slug ||
          e.capacityId !== item.capacityId ||
          e.unitId !== item.unitId
      );
      localStorage.setItem(
        "cartItems",
        JSON.stringify(
          state.value.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
        )
      );
    },
    addInfomation: (state, action) => {
      const newInfomation = action.payload;
      state.infomation = newInfomation
      localStorage.setItem("cartInfomation", JSON.stringify(state.infomation));
    },
    clearSession: (state, action) => {
      state.infomation = null;
      state.value = [];
      localStorage.removeItem('cartItems');
      localStorage.removeItem('cartInfomation');
    },
  },
});

// Action creators are generated for each case reducer function
export const { addItem, removeItem, updateItem, addInfomation, clearSession } = cartItemsSlice.actions;

export default cartItemsSlice.reducer;
