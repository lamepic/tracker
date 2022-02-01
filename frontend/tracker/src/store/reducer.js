import * as actionTypes from "./actionTypes";

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_SUCCESS:
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        ...action.payload,
        isLoading: false,
        isAuthenticated: true,
      };
    case actionTypes.USER_LOADED:
      return {
        ...state,
        isLoading: false,
        user: action.payload,
        isAuthenticated: true,
      };
    case actionTypes.SET_INCOMING_COUNT:
      return {
        ...state,
        incomingCount: action.payload,
      };
    case actionTypes.SET_OUTGOING_COUNT:
      return {
        ...state,
        outgoingCount: action.payload,
      };
    case actionTypes.SET_OPEN_TRACKING_MODAL:
      return {
        ...state,
        openTrackingModal: action.payload,
      };
    case actionTypes.SET_TRACKING_DOC_ID:
      return {
        ...state,
        trackingDocId: action.payload,
      };
    case actionTypes.SET_DOCTYPE:
      return {
        ...state,
        documentType: action.payload,
      };
    case actionTypes.LOGIN_FAIL:
    case actionTypes.AUTH_ERROR:
    case actionTypes.LOGOUT_SUCCESS:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
};
export default reducer;
