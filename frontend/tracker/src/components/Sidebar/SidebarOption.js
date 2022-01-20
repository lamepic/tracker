import React from "react";
import "./Sidebar.css";

function SidebarOption({ icon, name }) {
  return (
    <div className="sidebaroption">
      <div className="backdrop"></div>
      <img src={icon} alt="" />
      <p>{name}</p>
    </div>
  );
}

export default SidebarOption;
