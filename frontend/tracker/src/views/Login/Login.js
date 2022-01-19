import React from "react";
import "./Login.css";

import logo from "../../assets/images/logo.png";
import login_banner from "../../assets/images/landing-page-image.png";

import LoginCard from "../../components/LoginCard/LoginCard";

function Login() {
  return (
    <div className="login">
      <div className="login__content">
        <div className="login__content-left">
          <div className="header">
            <div className="logo">
              <img src={logo} alt="logo" />
              <div className="logo__text">
                <p className="logo__text-title">Ghana Cocoa Board</p>
                <p className="logo__text-subtitle">
                  Poised to Maintain Premium Quality Cocoa
                </p>
              </div>
            </div>
            <div className="header-text">
              <h2 className="text-bold">Manage</h2>
              <h2 className="subtitle">Your Files here.</h2>
            </div>
          </div>
          <div className="banner">
            <img src={login_banner} className="banner-img" alt="banner" />
          </div>
        </div>

        <div className="login__content-right">
          <LoginCard />
        </div>
      </div>
    </div>
  );
}

export default Login;
