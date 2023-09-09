import { STORAGE_KEY } from "@/constants/storage-key";
import LocalStorage from "@/utils/storage";
import { createSlice } from "@reduxjs/toolkit";

const accountSlice = createSlice({
  name: "account",
  initialState: {
    token: LocalStorage.get(STORAGE_KEY.TOKEN) || "",
    info: LocalStorage.get(STORAGE_KEY.INFO) || null,
  },
  reducers: {
    setInfoLogin(state, action) {
      const { token, info } = action.payload;
      state.token = token;
      state.info = info;
    },
    logout(state) {
      state.token = "";
      state.info = null;
    },
    setToken(state, action) {
      const token = action.payload;
      state.token = token;
    },
    setProfileAuth(state, action) {
      const info = action.payload;
      state.info = info;
    },
    clearInfo(state) {
      state.token = "";
      state.info = null;
    },
  },
});

const { actions, reducer } = accountSlice;

export const { clearInfo, setInfoLogin, logout, setToken, setProfileAuth } =
  actions;

export default reducer;
