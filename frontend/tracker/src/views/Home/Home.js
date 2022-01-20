import React from "react";
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

function Home() {
  const [store, dispatch] = useStateValue();

  //   const outgoingCount = store.outgoing.length;
  //   const incomingCount = store.incoming.length;

  const userInfo = store.user;

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
                <HomeOption icon={incoming_icon} text="Incoming" count={5} />
              </Link>
            </div>
            <div className="home__option">
              <Link to="/dashboard/outgoing">
                <HomeOption icon={outgoing_icon} text="Outgoing" count={3} />
              </Link>
            </div>
            <div className="home__option">
              <Link to="/dashboard/archive">
                <HomeOption icon={archive} text="Archive" />
              </Link>
            </div>
          </div>

          <hr className="divider" />
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
