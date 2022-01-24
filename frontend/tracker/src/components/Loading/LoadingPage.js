import React from "react";
import "./Loading.css";
import { CircularProgress } from "@mui/material";

function LoadingPage() {
  return (
    <div className="page__loader">
      <CircularProgress color="inherit" />
    </div>
  );
}

export default LoadingPage;
