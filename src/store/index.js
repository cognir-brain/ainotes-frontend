import { configureStore } from "@reduxjs/toolkit"
import themeReducer from './theme/themeSlice.js'
import authReducer from './auth/authSlice.js'
import noteReducer from "./notes/reducer.js"
import flashcardAndQuizReducer from "./flashcard/reducer.js"
import historyReducer from "./history/reducer.js"

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    notes: noteReducer,
    flashcardAndQuiz: flashcardAndQuizReducer,
    history: historyReducer,
  },
})
