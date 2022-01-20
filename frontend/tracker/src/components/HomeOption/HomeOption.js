import React from "react";
import "./HomeOption.css";
import Badge from "../Badge/Badge";

function HomeOption({ icon, text, count }) {
  return (
    <div className="homeOption">
      <div className="homeOption__icon">
        <img src={icon} alt={`${text}-icon`} />
        {count >= 0 && <Badge count={count} size="28px" />}
      </div>
      <p className="homeOption__text">{text}</p>
    </div>
  );
}

export default HomeOption;
