import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: null,
};

export const productModalSlice = createSlice({
  name: "productModal",
  initialState,
  reducers: {
    set: (state, action) => {
      document.body.style.overflow = "hidden"
      state.value = action.payload;
    },
    remove: (state) => {
      document.body.style.overflow = "scroll"
      state.value = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { set, remove } = productModalSlice.actions;

export default productModalSlice.reducer;
