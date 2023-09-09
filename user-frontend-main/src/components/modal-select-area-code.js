import { COUNTRIES_LIST } from '@/constants/countries'
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Input from './input'
import Modal from './modal'
import { findFlagUrlByIso2Code } from 'country-flags-svg'
import classNames from 'classnames'

let timeout

const ModalSelectAreaCode = ({ onChange }, ref) => {
  const { t } = useTranslation()

  const [ show, setShow ] = useState(false)
  const [ currentPhoneCode, setCurrentPhoneCode ] = useState(null)
  const [ listCountries, setListCountries ] = useState(COUNTRIES_LIST)
  const [ search, setSearch ] = useState('')

  const onOpen = (info) => {
    setShow(true)
    setCurrentPhoneCode(info)
  }

  const onClose = () => { 
    setShow(false)
    setCurrentPhoneCode(null)
  }

  useImperativeHandle(ref, () => ({
    onOpen
  }))

  const getFlag = (countryCode) => {
    if (countryCode)
    {return findFlagUrlByIso2Code(countryCode)}
    return ''
  }

  const onChangeArea = (area) => {
    onChange(area)
    onClose()
  }

  useEffect(() => {
    const newList = COUNTRIES_LIST.filter((countryItem) => countryItem.countryNameEn.toLowerCase().includes(search) || countryItem.countryCallingCode.includes(search))
    setListCountries(newList)
  }, [ search ])

  const onChangeSearch = (newValue) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      setSearch(newValue.toLowerCase())
    }, 500)
  }

  return (
    <Modal
      show={show}
      centered
      className="modal-select-area-code modal-sticky modal-sticky-lg modal-sticky-bottom-right"
    >
      <div className="modal-header">
        <div className="text-center w-100">
          <h6 className="mb-0">
            {t('select_area_code')}
          </h6>
        </div>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
          onClick={onClose}
        />
      </div>
      <div className="modal-body">
        <div className="box-search w-100 mb-3">
          <Input
            onChange={(e) => onChangeSearch(e.target.value)}
            placeholder={t('search')}
            className="form-control form-control-lg"
          />
        </div>
        <ul className="box-countries">
          {listCountries.map((countryItem) => (
            <li
              key={`country-${countryItem.countryCode}`}
              className={classNames('d-flex align-items-center', {
                active: currentPhoneCode === countryItem.countryCallingCode
              })}
              onClick={() => onChangeArea(countryItem)}
            >
              <div className="box__country-image">
                {getFlag(countryItem.countryCode) && <img src={getFlag(countryItem.countryCode)} />}
              </div>
              <div className="text-truncate box__name-country">
                {`${countryItem.countryNameEn} (${countryItem.countryNameLocal})`}
              </div>
              <div className="text-end ms-1">
                {`+${countryItem.countryCallingCode}`}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  )
}

export default forwardRef(ModalSelectAreaCode)
