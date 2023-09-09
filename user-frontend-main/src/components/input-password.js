import React, { forwardRef, useState } from 'react'
import classNames from 'classnames'

const InputPassword = ({ className, ...props }, ref) => {
  const [show, setShow] = useState(false)

  return (
    <div className="d-flex relative box__input-pass">
      <input
        {...props}
        ref={ref}
        type={show ? 'text' : "password"}
        className={classNames('form-control input-custom', className)}
      />
      {show ? (
        <button
          onClick={() => setShow(!show)}
          className="btn__eye-pass"
          type="button">
          <i className="bi bi-eye fs-6"></i>
        </button>
      ) : (
        <button
          onClick={() => setShow(!show)}
          className="btn__eye-pass"
          type="button">
          <i className="bi bi-eye-slash fs-6"></i>
        </button>
      )}
    </div>
  )
}

export default forwardRef(InputPassword)