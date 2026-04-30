import { getNoteById } from "../../utils/api";

const ActionType = {
  FETCH_NOTE_REQUEST: "FETCH_NOTE_REQUEST",
  FETCH_NOTE_SUCCESS: "FETCH_NOTE_SUCCESS",
  FETCH_NOTE_FAILURE: "FETCH_NOTE_FAILURE",
};

const fetchNoteRequest = () => ({
  type: ActionType.FETCH_NOTE_REQUEST,
});

const fetchNoteSuccess = (note) => ({
  type: ActionType.FETCH_NOTE_SUCCESS,
  payload: note,
});

const fetchNoteFailure = (error) => ({
  type: ActionType.FETCH_NOTE_FAILURE,
  payload: error,
});

const fetchNoteById = (id) => {
  return async (dispatch) => {
    dispatch(fetchNoteRequest());

    try {
      const data = await getNoteById(id);
      // const data = await response.json();
      const note = Array.isArray(data) ? data[0] : data;
      dispatch(fetchNoteSuccess(note));
    } catch (error) {
      dispatch(fetchNoteFailure(error));
    }
  };
};

export {
  ActionType,
  fetchNoteRequest,
  fetchNoteFailure,
  fetchNoteSuccess,
  fetchNoteById,
}