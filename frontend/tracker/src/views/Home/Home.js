import React, { useEffect } from "react";
import "./Home.css";
import { useStateValue } from "../../store/StateProvider";
import dashboard_hero from "../../assets/icons/dashboard-hero-icon.svg";
import incoming_icon from "../../assets/icons/incoming-tray-icon.svg";
import outgoing_icon from "../../assets/icons/outgoing-tray-icon.svg";
import archive from "../../assets/icons/archive.svg";

import HomeOption from "../../components/HomeOption/HomeOption";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";

import { Link } from "react-router-dom";
import { fetchIncomingCount, fetchOutgoingCount } from "../../http/document";

import * as actionTypes from "../../store/actionTypes";

function Home() {
  const [store, dispatch] = useStateValue();

  useEffect(() => {
    _fetchIncomingCount();
    _fetchOutgoingCount();
  }, []);

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

  const userInfo = store.user;
  const incomingCount = store.incomingCount;
  const outgoingCount = store.outgoingCount;

  return (
    <div className="home">
      <div className="home__container">
        <div className="home__content">
          <div className="home__hero">
            <img src={dashboard_hero} alt="dashboard-hero" />
            <div className="dashboard-hero-background"></div>
            <div className="hero__text">
              <h3 className="hero__title">Hi, {userInfo.first_name}</h3>
              <h4 className="hero__subtitle">
                Ready to start your day with Documents Tracker?
              </h4>
            </div>
          </div>

          <div className="home__options">
            <div className="home__option">
              <Link to="/dashboard/incoming">
                <HomeOption
                  icon={incoming_icon}
                  text="Incoming"
                  count={incomingCount}
                />
              </Link>
            </div>
            <div className="home__option">
              <Link to="/dashboard/outgoing">
                <HomeOption
                  icon={outgoing_icon}
                  text="Outgoing"
                  count={outgoingCount}
                />
              </Link>
            </div>
            {userInfo.is_department && (
              <div className="home__option">
                <Link to="/dashboard/archive">
                  <HomeOption icon={archive} text="Archive" />
                </Link>
              </div>
            )}
          </div>

          <hr className="divider" style={{ marginTop: "10px", color: "red" }} />
          <Link to="/dashboard/add-document">
            <Fab
              size="medium"
              sx={{
                backgroundColor: "#582F08",
                color: "#E3BC97",
                position: "absolute",
                right: "10px",
                bottom: "0px",
              }}
              aria-label="add"
            >
              <AddIcon />
            </Fab>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
