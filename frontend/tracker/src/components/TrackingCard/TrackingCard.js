import React from "react";
import { Redirect } from "react-router";
import { useStateValue } from "../../store/StateProvider";
import TrackingDetail from "../../views/Tracking/TrackingDetail";
import "./TrackingCard.css";
import * as actionTypes from "../../store/actionTypes";

function TrackingCard({ receiver, deparment, document, id, meta_info }) {
  const [store, dispatch] = useStateValue();

  const openTrackingDetail = () => {
    dispatch({
      type: actionTypes.SET_TRACKING_DOC_ID,
      payload: id,
    });

    dispatch({
      type: actionTypes.SET_OPEN_TRACKING_MODAL,
      payload: true,
    });
  };

  return (
    <div className="tracking__card">
      <div className="card__info">
        <p className="tracking__title">Sent To: {receiver}</p>
        <p>Department: {deparment} </p>
        <p>Document: {document} </p>
      </div>
      <div className="tracking__button-container">
        <button
          className="tracking__button"
          onClick={() => openTrackingDetail()}
        >
          Track
        </button>
      </div>
    </div>
  );
}

export default TrackingCard;
