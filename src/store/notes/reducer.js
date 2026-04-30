import { ActionType } from "./action";

const initialState = {
  loading: false,
  note: null,
  error: null,
};

const noteReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.FETCH_NOTE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ActionType.FETCH_NOTE_SUCCESS:
      return {
        ...state,
        loading: false,
        note: action.payload,
      };
    case ActionType.FETCH_NOTE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
}

export default noteReducer;