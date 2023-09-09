import React from 'react'
import { Result, Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
const Notfound = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const homePage = () => {
    navigate('/')
  }
  return (
    <Result
      status="404"
      title={t('404')}
      subTitle={t('404_subtitle')}
      extra={<Button type="primary" onClick={homePage}>{t('go_homepage')}</Button>}
    />
  )
}

export default Notfound