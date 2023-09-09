import React, { forwardRef } from 'react'
import classNames from 'classnames'

const Textarea = ({ className, ...props }, ref) => (
  <textarea
    {...props}
    ref={ref}
    className={classNames('form-control textarea-custom', className)}
  />
)

export default forwardRef(Textarea)