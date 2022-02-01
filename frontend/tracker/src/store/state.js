const intialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  isLoading: true,
  user: null,
  incomingCount: 0,
  outgoingCount: 0,
  openTrackingModal: false,
  trackingDocId: null,
  documentType: null,
};

export default intialState;
