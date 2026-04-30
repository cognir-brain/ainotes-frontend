import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  dark: localStorage.getItem("theme") === "dark",
}

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme(state) {
      state.dark = !state.dark
      localStorage.setItem("theme", state.dark ? "dark" : "light")
    },
    setDark(state) {
      state.dark = true
      localStorage.setItem("theme", "dark")
    },
    setLight(state) {
      state.dark = false
      localStorage.setItem("theme", "light")
    },
  },
})

export const { toggleTheme, setDark, setLight } = themeSlice.actions
export default themeSlice.reducer
