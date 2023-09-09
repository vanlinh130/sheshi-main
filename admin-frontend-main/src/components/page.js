import React from 'react'
import classNames from 'classnames'

const Page = ({ className, children }) => (
  <div className={classNames(className, 'page-component')}>
    {children}
  </div>
)

export default Page