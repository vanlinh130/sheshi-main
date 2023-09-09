import classNames from 'classnames'
import React from 'react'
import { Helmet } from 'react-helmet'

const Container = ({ title = 'Administration Control Panel', children, className }) => (
  <div className={classNames(className, 'container-component')}>
    <Helmet>
      <title>{title}</title>
    </Helmet>
    {children}
  </div>
)

export default Container
