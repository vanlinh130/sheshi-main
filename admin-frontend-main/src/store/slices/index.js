import accountSlice from './accountSlice'
import commonSlice from './commonSlice'

export const rootReducer = () => ({
  account: accountSlice,
  common: commonSlice
})
