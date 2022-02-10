import React, { useEffect, useState } from "react";
import { useStateValue } from "../../store/StateProvider";
import { fetchTracking } from "../../http/document";
import * as actionTypes from "../../store/actionTypes";

import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import CircularProgress from "@mui/material/CircularProgress";

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

function TrackingDetail() {
  const [store, dispatch] = useStateValue();
  const [tracking, setTracking] = useState([]);
  const [loading, setLoading] = useState(true);

  const documentId = store.trackingDocId;

  const _fetchTracking = async () => {
    const res = await fetchTracking(store.token, documentId);
    const data = res.data;
    setTracking(data.data);
    setLoading(false);
  };

  useEffect(() => {
    _fetchTracking();
  }, []);

  const handleClose = () => {
    dispatch({
      type: actionTypes.SET_OPEN_TRACKING_MODAL,
      payload: false,
    });
    dispatch({
      type: actionTypes.SET_TRACKING_DOC_ID,
      payload: null,
    });
  };

  return (
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={store.openTrackingModal}
        fullWidth={true}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          Tracker
        </BootstrapDialogTitle>
        <DialogContent dividers>
          {!loading ? (
            <Stepper
              activeStep={tracking.length - 1}
              alternativeLabel
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
              }}
            >
              {tracking.map((label, idx) => (
                <Step key={idx} sx={{ marginBottom: "2em" }}>
                  <StepLabel sx={{ color: "#582f08" }}>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          ) : (
            <div className="loading__spinner">
              <CircularProgress />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default TrackingDetail;
