import React from "react";
import Backdrop from "@mui/material/Backdrop";

import PDF from "../../assets/test.pdf";

function Preview({ openPreview, setOpenPreview }) {
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
          src={PDF}
          title="preview document"
          width="70%"
          height="100%"
        ></iframe>
      </Backdrop>
    </div>
  );
}

export default Preview;
