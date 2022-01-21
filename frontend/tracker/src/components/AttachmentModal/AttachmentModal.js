import React, { useState } from "react";
import "./AttachmentModal.css";
import * as actionTypes from "../../store/actionTypes";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { showNotification } from "../../utility/helper";

function AttachmentModal({
  getAttachments,
  attachments,
  openModal,
  setOpenModal,
}) {
  const [file, setFile] = useState();
  const [subject, setSubject] = useState();

  const addAttachment = (e, file, subject) => {
    e.preventDefault();
    const new_attachment = {
      file,
      subject,
    };
    const items = [...attachments, new_attachment];
    getAttachments(items);
    setOpenModal(false);
    showNotification("Success", "Attachment Added", "success");
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  return (
    <div className="attachment">
      <Dialog open={openModal} onClose={handleClose}>
        <DialogTitle>Upload Attachment</DialogTitle>
        <DialogContent>
          <div className="attchment-group">
            <div className="attachment-form-group">
              <label htmlFor="">Subject</label>
              <input
                type="text"
                value={subject}
                required
                onChange={(e) => {
                  setSubject(e.target.value);
                }}
              />
            </div>
            <div className="attachment-form-group form__attachment">
              <label htmlFor="attachment">Attachment</label>
              <input
                id="attachment"
                type="file"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                }}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <button onClick={handleClose} className="attachment-btn cancel">
            Cancel
          </button>
          <button
            type="button"
            className="attachment-btn attachment-submit"
            onClick={(e) => addAttachment(e, file, subject)}
            disabled={subject && file ? false : true}
          >
            Add
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AttachmentModal;
