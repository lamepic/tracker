import React, { useState } from "react";
import "./ActivateDocument.css";

// import "../ViewDocument/ViewDocument.css";
import swal from "sweetalert";
import logo from "../../assets/images/logo.png";

import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";

import { Redirect, useHistory } from "react-router";
import DatePicker from "@mui/lab/DatePicker";

import { Box } from "@mui/material";
import LoadingPage from "../../components/Loading/LoadingPage";
import Preview from "../../components/Preview/Preview";

function ActivateDocument() {
  const today = new Date();
  const nextweek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 7
  );

  const [loading, setLoading] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [expireAt, setExpireAt] = React.useState(nextweek);

  const handlePreview = () => {
    setOpenPreview(!openPreview);
  };

  return (
    <>
      {!loading ? (
        <div className="view">
          <div className="relatedfiles-section">
            {/* <p>{document.subject}</p>
            {document?.related_document.map((doc) => {
              return (
                <p key={doc.id} onClick={handlePreview}>
                  {doc.subject}
                </p>
              );
            })} */}
          </div>

          <div className="view__content">
            <div className="file__preview">
              <div className="file__preview-box" onClick={handlePreview}>
                <img src={logo} alt="logo" className="file-preview-box-img" />
              </div>
              <div className="file__action-btn">
                <div className="expiry-date">
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Custom input"
                      value={expireAt}
                      onChange={(newValue) => {
                        setExpireAt(newValue);
                      }}
                      renderInput={({ inputRef, inputProps, InputProps }) => (
                        <Box
                          sx={{
                            display: "flex",
                          }}
                        >
                          <button
                            className="file-btn submit"
                            // onClick={sendRequest}
                          >
                            Activate Document
                          </button>
                          <label
                            style={{
                              width: "0px",
                              overflow: "hidden",
                              visibility: "hidden",
                              border: "1px solid blue",
                            }}
                          >
                            <input ref={inputRef} {...inputProps} />
                          </label>
                          <div style={{ marginTop: "0.8em" }}>
                            {InputProps?.endAdornment}
                          </div>
                        </Box>
                      )}
                    />
                  </LocalizationProvider>
                </div>
              </div>
            </div>

            <div className="vr vr-sm"></div>

            <div className="file-info">
              <div className={`minute-box-preview`}>
                <div>
                  {/* {document?.minute?.map((item) => {
                    return (
                      <div className="minute" key={item?.id}>
                        <p>{item?.content}</p>
                        <p className="employee">{item?.user}</p>
                        <p className="date">
                          Date: {new Date(item?.date).toDateString()}
                        </p>
                      </div>
                    );
                  })} */}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <LoadingPage />
      )}
      <Preview
        openPreview={openPreview}
        setOpenPreview={setOpenPreview}
        doc={document}
      />
    </>
  );
}

export default ActivateDocument;
