import { ActionType } from "./action";

const initialState = {
  loading: false,
  history: null,
  error: null,
};

const historyReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.FETCH_HISTORY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ActionType.FETCH_HISTORY_SUCCESS:
      return {
        ...state,
        loading: false,
        history: action.payload,
      };
    case ActionType.FETCH_HISTORY_FAILUER:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    default:
      return state;
  }
}

export default historyReducer;