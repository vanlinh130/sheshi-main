import { configureStore } from '@reduxjs/toolkit'
import { createBrowserHistory } from 'history'
import { rootReducer } from './slices'

const store = configureStore({
  reducer: rootReducer()
})

export default store