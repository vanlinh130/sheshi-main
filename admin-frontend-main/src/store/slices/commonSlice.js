import { MODE_THEME } from "@/constants";
import { STORAGE_KEY } from "@/constants/storage-key";
import LocalStorage from "@/utils/storage";
import { createSlice } from "@reduxjs/toolkit";

const commonSlice = createSlice({
  name: "common",
  initialState: {
    theme: LocalStorage.get(STORAGE_KEY.THEME) || "light",
  },
  reducers: {
    changeTheme(state, action) {
      const newTheme = action.payload;
      state.theme = newTheme;
    },
  },
});

const { actions, reducer } = commonSlice;

export const { changeTheme } = actions;

export default reducer;
