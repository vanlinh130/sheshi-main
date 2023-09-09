import React from 'react'
import { Modal as ModalCustom } from 'react-bootstrap'
import classNames from 'classnames'

const Modal = ({ className, children, ...props }) => (
  <ModalCustom
    {...props}
    role="dialog"
    data-backdrop="false"
    aria-hidden="true"
    tabIndex="-1"
    animation
    className={classNames(className, 'modal-custom')}
  >
    {children}
  </ModalCustom>
)

export default Modal
