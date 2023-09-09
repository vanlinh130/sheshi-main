import axiosClient from '@/apis/axiosClient'
import { STORAGE_KEY } from '@/constants/storage-key'
import store from '@/store'
import LocalStorage from '@/utils/storage'
import React from 'react'
import { Provider } from 'react-redux'
import Init from './init'
import MainRouter from './main-router'

axiosClient.defaults.headers.common = {
  'Authorization': `Bearer ${LocalStorage.get(STORAGE_KEY.TOKEN)}`
}

const MainApp = () => (
  <Provider store={store}>
    <Init>
      <MainRouter />
    </Init>
  </Provider>
)

export default MainApp