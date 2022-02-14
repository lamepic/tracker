import React from "react";
import Backdrop from "@mui/material/Backdrop";

function Preview({ openPreview, setOpenPreview, doc }) {
  const handleClose = () => {
    setOpenPreview(false);
  };

  return (
    <div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openPreview}
        onClick={handleClose}
      >
        <iframe
          src={`http://localhost:8000${doc?.content}`}
          // src={`http://192.168.40.8:8000${doc?.content}`}
          title="preview document"
          width="70%"
          height="100%"
          type="application/pdf"
        ></iframe>
      </Backdrop>
    </div>
  );
}

export default Preview;
