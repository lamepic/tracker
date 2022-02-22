import React from "react";
import "./Sidebar.css";
import logo from "../../assets/images/logo.png";

import tracker from "../../assets/icons/tracker-icon.svg";
import home from "../../assets/icons/home-icon.svg";
import { Link } from "react-router-dom";
import { useStateValue } from "../../store/StateProvider";
import SidebarOption from "./SidebarOption";
import AddCircleIcon from "@mui/icons-material/AddCircle";

function Sidebar() {
  const [store, dispatch] = useStateValue();

  return (
    <div className="sidebar">
      <div className="sidebar__content">
        <div className="sidebar__logo">
          <img src={logo} alt="logo" />
          <p className="sidebar__logo-title">Ghana Cocoa Board</p>
          <p className="sidebar__logo-subtitle">
            Poised to Maintain Premium Quality Cocoa
          </p>
        </div>
        <div className="sidebar__options">
          <Link to="/dashboard">
            <SidebarOption icon={home} name="home" />
          </Link>
          <Link to="/dashboard/tracker">
            <SidebarOption icon={tracker} name="tracker" />
          </Link>
          {store.user.is_department && (
            <Link to="/dashboard/create-flow">
              <SidebarOption icon={tracker} name="create flow" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
