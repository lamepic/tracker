import React, { useEffect, useState } from "react";
import "./ForwardModal.css";
import * as actionTypes from "../../store/actionTypes";
import { useHistory } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useStateValue } from "../../store/StateProvider";
import InputAutocomplete from "../Autocomplete/InputAutocomplete";
// import {
//   fetchDepartments,
//   fetchEmployees,
//   forwardDocument,
// } from "../../utility/utility";

import swal from "sweetalert";
import { departments, loadUsers } from "../../http/user";
import { forwardDocument } from "../../http/document";

function ForwardModal({ document, openModal, setOpenModal }) {
  const [store, dispatch] = useStateValue();
  const [receiver, setReceiver] = useState(null);
  const [department, setDepartment] = useState(null);
  const history = useHistory();
  const [_departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [namesOfUsers, setNamesOfUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const namesOfUsers = users
      .filter(
        (user) =>
          user.employee_id !== store.user.employee_id &&
          user.department?.name === department?.name
      )
      .map((user) => {
        const { first_name, last_name, employee_id } = user;
        const name = `${first_name} ${last_name}`;
        return { employee_id, name };
      });
    setNamesOfUsers(namesOfUsers);
  }, [department]);

  useEffect(() => {
    fetchDepartments();
    fetchUsers();
    setLoading(false);
  }, []);

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

  const namesOfDepartments = _departments.map((department) => {
    const { id, name } = department;
    return { id, name };
  });

  const handleClose = () => {
    setOpenModal(false);
    setNamesOfUsers([]);
  };

  const handleSubmit = (e) => {
    const data = { receiver, document };
    console.log(data);
    if (receiver && department && document) {
      swal({
        title: `Are you sure you want to Forward this Document to ${receiver.name} ?`,
        text: "Forwarding of this Document is irreversible",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (willSubmit) => {
        if (willSubmit) {
          const res = await forwardDocument(store.token, data);
          if (res.status === 201) {
            setOpenModal(false);
            history.push("/dashboard/outgoing");
            swal("Document has been sent succesfully", {
              icon: "success",
            });
          }
        }
      });
    }
  };

  return (
    <div className="forwardModal">
      {!loading ? (
        <Dialog fullWidth={true} open={openModal} onClose={handleClose}>
          <DialogTitle>Forward Document</DialogTitle>
          <DialogContent>
            <div>
              <div className="form-group">
                <label>Department</label>
                <InputAutocomplete
                  options={namesOfDepartments}
                  getOption={setDepartment}
                />
              </div>
              <div className="form-group">
                <label>Name</label>
                <InputAutocomplete
                  options={namesOfUsers}
                  getOption={setReceiver}
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
              onClick={handleSubmit}
              disabled={receiver && department ? false : true}
            >
              Forward
            </button>
          </DialogActions>
        </Dialog>
      ) : (
        <p>loading....</p>
      )}
    </div>
  );
}

export default ForwardModal;
