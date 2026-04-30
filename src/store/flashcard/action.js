import { getFlashcardAndQuizById } from "../../utils/api.js";

const ActionType = {
  FETCH_REQUEST: "FETCH_REQUEST",
  FETCH_SUCCESS: "FETCH_SUCCESS",
  FETCH_FAILURE: "FETCH_FAILURE",
};

const fetchRequest = () => ({
  type: ActionType.FETCH_REQUEST,
});

const fetchSuccess = ({flashcards, quizs}) => ({
  type: ActionType.FETCH_SUCCESS,
  payload: {
    flashcards,
    quizs,
  },
});

const fetchFailure = (error) => ({
  type: ActionType.FETCH_REQUEST,
  payload: error,
});

const fetchFlashcardAndQuizById = (id) => {
  return async (dispatch) => {
    dispatch(fetchRequest());
    try {
      const data = await getFlashcardAndQuizById(id);
      // const jsonData = Array.isArray(data) ? data[0] : data;
      const flashcards =  data.flashcards;
      const quizs = data.quizs;
      dispatch(fetchSuccess({flashcards, quizs}));
    } catch (error) {
      dispatch(fetchFailure(error));
    }
  };
};

export {
  ActionType,
  fetchFailure,
  fetchRequest,
  fetchSuccess,
  fetchFlashcardAndQuizById,
}