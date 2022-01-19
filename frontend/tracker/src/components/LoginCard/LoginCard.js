import React, { useState } from "react";
import "./LoginCard.css";

import logo from "../../assets/images/logo.png";

import LoginForm from "../LoginForm/LoginForm";
import VerificationForm from "../LoginForm/VerificationForm";

import CircularProgress from "@mui/material/CircularProgress";

import { Redirect } from "react-router-dom";
import { useStateValue } from "../../store/StateProvider";

function LoginCard() {
  const [sentVerificationToken, setSentVerificationToken] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [store, dispatch] = useStateValue();

  if (store.isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="card">
      <div className="card__content">
        <div className="card__header">
          <h3>Welcome To</h3>
          <div className="card__logo">
            <img src={logo} alt="logo" />
            <div className="line"></div>
            <div className="card__logo__text">
              <p className="card__logo__text-title">Ghana Cocoa Board</p>
              <p className="card__logo__text-subtitle">
                Poised to Maintain Premium Quality Cocoa
              </p>
            </div>
          </div>
        </div>
        <p>Login to Proceed to your Dashboard</p>
        <p className="text-light-brown">Don't have an account?</p>

        <VerificationForm
          setSentVerificationToken={setSentVerificationToken}
          setVerifiedEmail={setVerifiedEmail}
          setLoading={setLoading}
        />
        {loading && (
          <div className="progress">
            <CircularProgress />
          </div>
        )}
        {/* Show card when user enters token */}
        {sentVerificationToken && (
          <div className="verification">
            <p className="message">A verification has been sent to</p>
            <p className="email">{verifiedEmail}</p>
            <LoginForm verifiedEmail={verifiedEmail} />
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginCard;
