import React from "react";
import accountApis from "@/apis/accountApis";
import errorHelper from "@/utils/error-helper";
import { MODE_THEME } from "@/constants";
import { STORAGE_KEY } from "@/constants/storage-key";
import LocalStorage from "@/utils/storage";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, Zoom } from "react-toastify";
import { setProfileAuth } from "@/store/slices/accountSlice";

const Init = ({ children }) => {
  const { theme } = useSelector((state) => state.common);
  const { token } = useSelector((state) => state.account);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    switch (theme) {
      case MODE_THEME.DARK:
        document.documentElement.setAttribute("data-theme", "dark");
        LocalStorage.set(STORAGE_KEY.THEME, MODE_THEME.DARK);
        break;
      case MODE_THEME.LIGHT:
      default:
        document.documentElement.setAttribute("data-theme", "light");
        LocalStorage.set(STORAGE_KEY.THEME, MODE_THEME.LIGHT);
        break;
    }
  }, [theme]);

  useEffect(() => {
    // if (token) {
    //   accountApis.getProfile()
    //     .then((res) => {
    //       dispatch(setProfileAuth(res))
    //     })
    //     .catch((err) => {
    //       errorHelper(err)
    //     })
    //     .finally(() => {
    //       setLoading(false)
    //     })
    // } else {
    setLoading(false);
    // }
  }, []);

  return (
    <>
      {!loading ? children : null}
      <ToastContainer
        position="top-right"
        transition={Zoom}
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default Init;
