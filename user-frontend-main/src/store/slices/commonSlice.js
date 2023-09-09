import { MODE_THEME } from '@/constants'
import { STORAGE_KEY } from '@/constants/storage-key'
import LocalStorage from '@/utils/storage'
import { createSlice } from '@reduxjs/toolkit'

const commonSlice = createSlice({
  name: 'common',
  initialState: {
    theme: LocalStorage.get(STORAGE_KEY.THEME) || MODE_THEME.DARK,
    lang: LocalStorage.has(STORAGE_KEY.LANGUAGE) && LocalStorage.get(STORAGE_KEY.LANGUAGE) === 'en'
      ? 'en'
      : 'vi'
  },
  reducers: {
    changeTheme (state, action) {
      const newTheme = action.payload
      state.theme = newTheme
    },
    changeLanguage (state, action) {
      const newLang = action.payload
      state.lang = newLang
    }
  }
})

const { actions, reducer } = commonSlice

export const {
  changeTheme,
  changeLanguage
} = actions

export default reducer
