import React, { useEffect } from "react";
import "./Dashboard.css";

import { Route, Redirect } from "react-router";
import { useStateValue } from "../../store/StateProvider";
import * as actionTypes from "../../store/actionTypes";

import { loadUser } from "../../http/user";

import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import Home from "../Home/Home";
import Incoming from "../Incoming/Incoming";
import Outgoing from "../Outgoing/Outgoing";
import CreateDocument from "../CreateDocument/CreateDocument";

function Dashboard() {
  const [store, dispatch] = useStateValue();

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

  useEffect(() => {
    fetchUser();
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
                {/* <Route
                  path={`/dashboard/document/:type/:id/`}
                  component={ViewDocument}
                /> */}
                {/* <Route path="/dashboard/tracker" component={Tracking} /> */}
                {/* <Route path="/dashboard/archive" component={Archive} /> */}
                {/* <Route
                  path="/dashboard/activate-document"
                  component={ActivateDocument}
                /> */}
                {/* <Route
                  path="/dashboard/activated-document"
                  component={ActivatedDocView}
                /> */}
                {/* <TrackingDetail /> */}
              </main>
            </>
          ) : (
            // <LoadingBackdrop loading={store.user !== null ? false : true} />
            <p>Loading</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
