import { getHistory } from "../../utils/api";

const ActionType = {
  FETCH_HISTORY_REQUEST: "FETCH_HISTORY_REQUEST",
  FETCH_HISTORY_SUCCESS: "FETCH_HISTORY_SUCCESS",
  FETCH_HISTORY_FAILUER: "FETCH_HISTORY_FAILUER",
};

const fetchHistoryRequest = () => ({
  type: ActionType.FETCH_HISTORY_REQUEST,
});

const fetchHistoryFailure = (error) => ({
  type: ActionType.FETCH_HISTORY_FAILUER,
  payload: error,
});

const fetchHostorySuccess = (history) => ({
  type: ActionType.FETCH_HISTORY_SUCCESS,
  payload: history,
});

const fetchHistory = () => {
  return async (dispatch) => {
    dispatch(fetchHistoryRequest());
    try {
      const history = await getHistory();
      dispatch(fetchHostorySuccess(history));
    } catch (error) {
      dispatch(fetchHistoryFailure(error));
    }
  };
};


export {
  ActionType,
  fetchHistoryRequest,
  fetchHostorySuccess,
  fetchHistoryFailure,
  fetchHistory,
}