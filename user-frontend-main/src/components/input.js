import React, { forwardRef } from "react";
import classNames from "classnames";

const Input = ({ className, ...props }, ref) => (
  <input
    {...props}
    ref={ref}
    className={classNames("form-control input-custom", className)}
  />
);

export default forwardRef(Input);
