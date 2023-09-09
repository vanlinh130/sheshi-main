import React, { forwardRef } from "react";
import classNames from "classnames";
import Select from "react-select";

const SelectCustom = (
  { className, children, options, value, ...props },
  ref
) => {
  return (
    <Select
      {...props}
      ref={ref}
      value={options.find((itemOption) => itemOption.value === value)}
      className={classNames("select-custom", className)}
      classNamePrefix="select-custom"
      options={options}
    />
  );
};

export default forwardRef(SelectCustom);
