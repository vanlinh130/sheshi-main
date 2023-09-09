import React, { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'
import Input from './input'
import classNames from 'classnames'
import { formatNumber } from '@/utils/funcs'
import Button from './button'

const InputOtp = ({ disabledSend = false, loading = false, onSendOTP, countdown = 0, className, ...props }, ref) => {
  const { t } = useTranslation()

  return (
    <div className="input-otp pe-0">
      <Input
        {...props}
        value={props.value}
        onChange={(e) => props.onChange(formatNumber(e.target.value))}
        ref={ref}
        className={classNames(className, 'form-control form-control-lg')}
      />
      <Button
        loading={loading}
        disabled={disabledSend || countdown < 60}
        onClick={onSendOTP}
        className="btn btn-primary btn__send-code" type="button"
      >
        {(countdown !== 60 && countdown !== 0) ? countdown : t('send')}
      </Button>
    </div>
  )
}

export default forwardRef(InputOtp)