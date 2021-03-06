import React, { useEffect, useState } from "react";
import "./Dashboard.css";

import { Route } from "react-router";
import { useStateValue } from "../../store/StateProvider";
import * as actionTypes from "../../store/actionTypes";

import { loadUser } from "../../http/user";
import {
  fetchIncomingCount,
  fetchOutgoingCount,
  notificationsCount,
} from "../../http/document";

import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import Home from "../Home/Home";
import Incoming from "../Incoming/Incoming";
import Outgoing from "../Outgoing/Outgoing";
import CreateDocument from "../CreateDocument/CreateDocument";
import LoadingBackdrop from "../../components/Loading/LoadingBackdrop";
import Archive from "../Archive/Archive";
import Tracking from "../Tracking/Tracking";
import ViewDocument from "../ViewDocument/ViewDocument";
import ProtectedPage from "../../utility/ProtectedPage";
import TrackingDetail from "../Tracking/TrackingDetail";
import ActivateDocument from "../ActivateDocument/ActivateDocument";
import ActivatedDocView from "../ActivateDocument/ActivatedDocView";
import Flow from "../Flow/Flow";

function Dashboard() {
  const [store, dispatch] = useStateValue();
  const [loading, setLoading] = useState(true);

  const token = store.token;

  const fetchUser = async () => {
    try {
      const res = await loadUser(token);
      dispatch({
        type: actionTypes.USER_LOADED,
        payload: res.data,
      });
    } catch {
      dispatch({
        type: actionTypes.AUTH_ERROR,
      });
    }
  };

  const _fetchIncomingCount = async () => {
    const res = await fetchIncomingCount(store.token);
    const data = res.data;
    dispatch({
      type: actionTypes.SET_INCOMING_COUNT,
      payload: data.data,
    });
  };

  const _fetchOutgoingCount = async () => {
    const res = await fetchOutgoingCount(store.token);
    const data = res.data;
    dispatch({
      type: actionTypes.SET_OUTGOING_COUNT,
      payload: data.data,
    });
  };

  const fetchNotifications = async () => {
    const res = await notificationsCount(store.token);
    const data = res.data;
    dispatch({
      type: actionTypes.SET_NOTIFICATIONS_COUNT,
      payload: data.count,
    });
  };

  useEffect(() => {
    fetchUser();
    _fetchIncomingCount();
    _fetchOutgoingCount();
    fetchNotifications();
    setLoading(false);
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard__container">
        <Sidebar />
        <div className="dashboard__content">
          {store.user !== null ? (
            <>
              <Navbar />
              <main>
                <Route exact path="/dashboard" component={Home} />
                <Route path="/dashboard/incoming" component={Incoming} />
                <Route path="/dashboard/outgoing" component={Outgoing} />
                <Route
                  path="/dashboard/add-document"
                  component={CreateDocument}
                />
                <Route
                  path={`/dashboard/document/:type/:id/`}
                  component={ViewDocument}
                />
                <Route path="/dashboard/tracker" component={Tracking} />
                <ProtectedPage path="/dashboard/archive" component={Archive} />
                <ProtectedPage path="/dashboard/create-flow" component={Flow} />
                <Route
                  path="/dashboard/activate-document"
                  component={ActivateDocument}
                />
                <Route
                  path="/dashboard/activated-document"
                  component={ActivatedDocView}
                />
                {store.openTrackingModal && <TrackingDetail />}
              </main>
            </>
          ) : (
            <LoadingBackdrop loading={loading} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
