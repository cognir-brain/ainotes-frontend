import { ActionType } from "./action";

const initialState = {
  loadingFlashcardAndQuiz: false,
  flashcards: null,
  quizs: null,
  errorFlashcardAdnQuiz: null,
};

const flashcardAndQuizReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.FETCH_REQUEST:
      return {
        ...state,
        loadingFlashcardAndQuiz: true,
        errorFlashcardAdnQuiz: null,
      };
    case ActionType.FETCH_SUCCESS:
      return {
        ...state,
        loadingFlashcardAndQuiz: false,
        flashcards: action.payload.flashcards,
        quizs: action.payload.quizs,
      };
    case ActionType.FETCH_FAILURE:
      return {
        ...state,
        loadingFlashcardAndQuiz: false,
        errorFlashcardAdnQuiz: action.payload,
      }
    default:
      return state;
  }
}

export default flashcardAndQuizReducer;