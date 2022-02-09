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
  notificationsCount: 0,
  request_details: null,
};

export default intialState;
