import React, { forwardRef, useState } from "react";
import classNames from "classnames";
import { CopyToClipboard } from "react-copy-to-clipboard";
import successHelper from "@/utils/success-helper";
import { useTranslation } from "react-i18next";

let timeout;

const InputCopy = ({ className, ...props }, ref) => {
  const [dis, setDis] = useState(false);

  const { t } = useTranslation();

  const onCopyClipboard = () => {
    successHelper(t("copied"));
    setDis(true);

    clearTimeout(timeout);
    timeout = setTimeout(() => {
      setDis(false);
    }, 5000);
  };
  const copy = (e) => {
    const arr = window.location.href.split("/");
    const url = arr[0] + "//" + arr[2]
    navigator.clipboard.writeText(`${url}/sign-up/${e}`);
  };

  return (
    <div className="d-flex relative box__input-copy">
      <input
        {...props}
        ref={ref}
        className={classNames("form-control", className)}
      />
      <CopyToClipboard text={props.value} onCopy={copy}>
        <button
          onClick={onCopyClipboard}
          disabled={dis}
          className="btn__eye-copy"
          type="button"
        >
          <i className="bi bi-files fs-6"></i>
        </button>
      </CopyToClipboard>
    </div>
  );
};

export default forwardRef(InputCopy);
