import InputCopy from "@/components/input-copy";
import warningHelp from "@/utils/warning-help";
import classNames from "classnames";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const Referral = () => {
  const { t } = useTranslation();
  const { info } = useSelector((state) => state.account);

  const showMessage = () => {
    warningHelp(t("coming_soon"));
  };

  return <div className="referral-user h-100"></div>;
};

export default Referral;
