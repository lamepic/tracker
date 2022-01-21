import React, { useState, useEffect } from "react";
import "./CreateDocument.css";
import { useStateValue } from "../../store/StateProvider";
import * as actionTypes from "../../store/actionTypes";

import { showNotification } from "../../utility/helper";
import { useHistory } from "react-router-dom";
import DescriptionIcon from "@mui/icons-material/Description";
import create_doc_img from "../../assets/images/create-doc-image.png";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InputAutocomplete from "../../components/Autocomplete/InputAutocomplete";
import AttachmentModal from "../../components/AttachmentModal/AttachmentModal";
import LoadingBackdrop from "../../components/Loading/LoadingBackdrop";
import { departments, loadUsers } from "../../http/user";
import { Typography } from "@mui/material";

function CreateDocument() {
  const [store, dispatch] = useStateValue();
  const history = useHistory();

  //   data state
  const [subject, setSubject] = useState("");
  const [reference, setReference] = useState("");
  const [receiver, setReceiver] = useState(null);
  const [department, setDepartment] = useState(null);
  const [document, setDocument] = useState(null);
  const [attachments, setAttachments] = useState([]);

  // utility state
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  //   api state
  const [_departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);

  const fetchDepartments = async () => {
    try {
      const res = await departments(store.token);
      setDepartments(res.data);
    } catch (error) {
      console.log("Fetch departments", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await loadUsers(store.token);
      setUsers(res.data);
    } catch (error) {
      console.log("Fetch Users", error);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchUsers();
    setLoading(false);
  }, []);

  const namesOfUsers = users
    .filter((user) => user.employee_id !== store.user.employee_id)
    .map((user) => {
      const { first_name, last_name, employee_id } = user;
      const name = `${first_name} ${last_name}`;
      return { employee_id, name };
    });

  const namesOfDepartments = _departments.map((department) => {
    const { id, name } = department;
    return { id, name };
  });

  const uploadDocument = (e) => {
    e.preventDefault();
    setDocument(e.target.files[0] ? e.target.files[0] : null);
    if (document !== null) {
      showNotification("Success", "Document Added", "success");
    }
  };

  const goToDashboard = () => {
    history.push("/dashboard");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const items = {
      subject,
      reference,
      receiver,
      department,
      document,
      attachments,
    };
    console.log(items);
  };

  return (
    <>
      {!loading ? (
        <div className="document">
          <h2 className="document__header">Add Document / Attachment</h2>
          <hr className="divider" />
          <div className="document__content">
            <form>
              <div className="form__details">
                <div className="form-group">
                  <label htmlFor="">Subject</label>
                  <input
                    type="text"
                    required
                    style={{ width: "60%" }}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">Reference</label>
                  <input
                    type="text"
                    required
                    style={{ width: "60%" }}
                    onChange={(e) => setReference(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">To</label>
                  <InputAutocomplete
                    options={namesOfUsers}
                    getOption={setReceiver}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">Department</label>
                  <InputAutocomplete
                    options={namesOfDepartments}
                    getOption={setDepartment}
                  />
                </div>
              </div>
              <hr className="divider" />
              <div className="form__document">
                <label>Document</label>
                <div className="document__section">
                  <div className="document__section-header">
                    <DescriptionIcon />
                    <div className="title">
                      <h4>Upload your document</h4>
                      <p>Drag and drop your file here</p>
                    </div>
                  </div>
                  <label htmlFor="file" className="upload__box">
                    <CloudUploadIcon />
                    <p className="ext">.pdf.jpg.png.doc.</p>
                    <p className="upload__box-text">Click to upload file</p>
                    <input
                      id="file"
                      type="file"
                      hidden
                      name="mainFile"
                      onChange={(e) => {
                        uploadDocument(e);
                      }}
                    />
                  </label>
                  <Typography
                    noWrap
                    sx={{
                      color: "var(--dark-brown)",
                      fontWeight: 600,
                      marginTop: "2px",
                      fontSize: "12px",
                    }}
                  >
                    {document ? document.name : null}
                  </Typography>
                </div>
              </div>
              <div className="form-group form__attachment">
                <label htmlFor="attachment">
                  Attachments ({attachments.length})
                </label>
                <button
                  className="upload"
                  type="button"
                  onClick={() => {
                    setOpenModal(true);
                  }}
                >
                  Upload
                </button>
                {openModal && (
                  <AttachmentModal
                    getAttachments={setAttachments}
                    attachments={attachments}
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                  />
                )}
              </div>
              <hr className="divider" />
              <div className="form__buttons">
                <button
                  type="button"
                  className="cancel"
                  onClick={() => goToDashboard()}
                >
                  Cancel
                </button>
                <button className="submit" onClick={handleSubmit}>
                  Submit
                </button>
              </div>
            </form>
          </div>
          <img src={create_doc_img} alt="img" className="document__img" />
        </div>
      ) : (
        <LoadingBackdrop loading={loading} />
      )}
    </>
  );
}

export default CreateDocument;
