import React, { useState } from "react";

const InputNumber = ({ className, ...props }) => {
  const [num, setNum] = useState(1);
  const incNum = () => {
    if (num < 10) {
      setNum(Number(num) + 1);
    }
  };
  const decNum = () => {
    if (num > 0) {
      setNum(num - 1);
    }
  };
  const handleChange = (e) => {
    setNum(e.target.value);
  };

  return (
    <div className="input-number">
      <button onClick={decNum} type="button">
        -
      </button>
      <input {...props} value={num} onChange={handleChange} />
      <button onClick={incNum} type="button">
        +
      </button>
    </div>
  );
};

export default InputNumber;
