import React from "react";
import classNames from "classnames";

const Button = ({
  onClick,
  disabled = false,
  loading = false,
  small = false,
  className,
  children,
  ...props
}) => (
  <button
    {...props}
    onClick={onClick}
    className={classNames(
      "btn button-custom",
      {
        "btn-small": small,
      },
      className
    )}
    disabled={loading || disabled}
  >
    {loading && (
      <div
        role="status"
        className={classNames("spinner-border spinner-border-sm", {
          "me-3": !small,
          "me-2": small,
        })}
      />
    )}
    {children}
  </button>
);

export default Button;
