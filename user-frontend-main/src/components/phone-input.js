import React, { forwardRef, useRef } from 'react'
import Input from './input'
import { countries } from 'country-flags-svg'
import { COUNTRIES_LIST } from '@/constants/countries'
import { formatNumber } from '@/utils/funcs'
import { useTranslation } from 'react-i18next'
import ModalSelectAreaCode from './modal-select-area-code'

const PhoneInput = ({
  onChangePhoneCode,
  onChangePhoneNumber,
  phoneCode,
  phoneNumber,
  namePhoneCode,
  namePhoneNumber,
  register,
  ...props
}, ref) => {
  const countryCode = COUNTRIES_LIST.find((countryItem) => countryItem.countryCallingCode === phoneCode)?.countryCode
  const findFCountry = countries.find((countryFlagItem) => countryFlagItem.iso2 === countryCode)

  const { t } = useTranslation()
  const refModalSelectAreaCode = useRef()

  const onOpenSelectAreaCode = () => {
    refModalSelectAreaCode.current.onOpen(phoneCode)
  }

  const onChangeAreaCode = (areaItem) => {
    onChangePhoneCode(areaItem.countryCallingCode)
  }

  return (
    <div className="phone-input-component">
      <div className="box-phone-code" onClick={onOpenSelectAreaCode}>
        <img src={findFCountry?.flag} className="flag-icon" />
        <span className="text__phone-code">
          {`+${phoneCode}`}
        </span>
        <i className="bi bi-caret-down-fill"></i>
      </div>
      <Input
        ref={ref}
        {...props}
        {...register(namePhoneNumber)}
        placeholder={t('phone')}
        maxLength={16}
        onChange={(e) => onChangePhoneNumber(formatNumber(e.target.value))}
      />
      <ModalSelectAreaCode
        ref={refModalSelectAreaCode}
        onChange={onChangeAreaCode}
      />
    </div>
  )
}

export default forwardRef(PhoneInput)