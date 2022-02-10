import React, { useState } from "react";
import "./Navbar.css";
import * as actionTypes from "../../store/actionTypes";

import Badge from "../Badge/Badge";

import NotificationsIcon from "@mui/icons-material/Notifications";
import { styled, alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { useStateValue } from "../../store/StateProvider";
import { CircularProgress, IconButton, Typography } from "@mui/material";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { logout } from "../../http/auth";
import SearchAutocomplete from "../Autocomplete/SearchAutocomplete";
import { fetchActivateDocument, fetchRequest } from "../../http/document";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.mode === "light" ? "#603814" : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

function DropDownMenu({ handleLogout, userInfo }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [{}, dispatch] = useStateValue();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    setAnchorEl(null);
    handleLogout();
  };

  return (
    <div>
      <Button
        id="demo-customized-button"
        aria-controls="demo-customized-menu"
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{
          color: "#9D4D01",
          // fontWeight: 600,
          maxWidth: "14em",
        }}
      >
        <Typography
          noWrap
          sx={{
            color: "#9D4D01",
            fontWeight: 600,
          }}
        >
          {`${userInfo.first_name} ${userInfo.last_name}`}
        </Typography>
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={logout} disableRipple>
          Logout
        </MenuItem>
      </StyledMenu>
    </div>
  );
}

function RequestDropDownMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const history = useHistory();
  const [store, dispatch] = useStateValue();
  const [pendingRequest, setPendingRequest] = useState([]);
  const [activatedDocuments, setActivatedDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    fetchPendingRequest();
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const fetchPendingRequest = async () => {
    const requestRes = await fetchRequest(store.token);
    const requestData = requestRes.data;
    setPendingRequest(requestData);

    const activatedDocumentRes = await fetchActivateDocument(store.token);
    const activatedDocumentData = activatedDocumentRes.data;
    setActivatedDocuments(activatedDocumentData);

    setLoading(false);
  };

  const handleRequest = (details) => {
    setAnchorEl(null);
    dispatch({
      type: actionTypes.SET_REQUEST_DETAILS,
      payload: details,
    });
    history.push("/dashboard/activate-document");
  };

  const handleOpenActivatedDoc = (details) => {
    setAnchorEl(null);
    dispatch({
      type: actionTypes.SET_ACTIVATED_DOCUMENTS_DETAILS,
      payload: details,
    });
    history.push("/dashboard/activated-document");
  };

  return (
    <div>
      <IconButton
        id="demo-customized-button"
        aria-controls="demo-customized-menu"
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{
          color: "#603814",
          fontWeight: 600,
        }}
      >
        <NotificationsIcon />
      </IconButton>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem>
          <div className="request__header">
            <NotificationsIcon />
            <p>Notifications</p>
          </div>
        </MenuItem>
        {!loading ? (
          pendingRequest.map((request) => {
            const id = request.id;
            const name = `${request.requested_by.first_name} ${request.requested_by.last_name}`;
            const document = request.document.subject;
            const department = request.requested_by.department.name;
            const date = new Date(request.created_at);
            return (
              <MenuItem
                disableRipple
                onClick={() => handleRequest(request)}
                key={id}
              >
                <div className="request">
                  <div className="request__content">
                    <div className="request_from">
                      <Typography
                        noWrap
                        sx={{
                          color: "var(--dark-brown)",
                          fontWeight: 600,
                          fontSize: "15px",
                        }}
                      >
                        {name}
                      </Typography>
                    </div>
                    <p className="request_department">{department}</p>
                    <p className="document__name">{document}</p>
                  </div>
                  <p className="request__date">{moment(date).fromNow()}</p>
                </div>
              </MenuItem>
            );
          })
        ) : (
          <div className="notification__loading">
            <CircularProgress color="inherit" />
          </div>
        )}
        {activatedDocuments.map((doc) => {
          const id = doc.id;
          const name = `${doc.document_sender.first_name} ${doc.document_sender.last_name}`;
          const document = doc.document.subject;
          const date = new Date(doc.date_activated);

          return (
            <MenuItem
              disableRipple
              onClick={() => handleOpenActivatedDoc(doc)}
              key={id}
            >
              <div className="request">
                <div className="request__content">
                  <div className="request_from">
                    <Typography
                      noWrap
                      sx={{
                        color: "var(--dark-brown)",
                        fontWeight: 600,
                        fontSize: "15px",
                      }}
                    >
                      {name}
                    </Typography>
                  </div>
                  <p className="activate__msg">Document request granted</p>
                  <p className="activate__document__name">{document}</p>
                </div>
                <p className="request__date">{moment(date).fromNow()}</p>
              </div>
            </MenuItem>
          );
        })}
        {(!loading && store.notificationsCount) === 0 && (
          <MenuItem>
            <div className="request">
              <p className="empty__request">You have 0 Notifications</p>
            </div>
          </MenuItem>
        )}
      </StyledMenu>
    </div>
  );
}

function Navbar() {
  const [store, dispatch] = useStateValue();

  const userInfo = store.user;

  const handleLogout = async () => {
    const res = await logout(store.token);
    if (res.status === 200) {
      dispatch({
        type: actionTypes.LOGOUT_SUCCESS,
      });
    }
  };

  const getDay = () => {
    const event = new Date();
    const options = { weekday: "long" };
    return event.toLocaleDateString("en-US", options);
  };

  const getMonth = () => {
    const event = new Date();
    const options = { month: "long" };
    return event.toLocaleDateString("en-US", options);
  };

  return (
    <div className="navbar">
      <div className="title">
        <h2 className="title__text">Dashboard</h2>
        <h3 className="title__date">
          {getDay()}{" "}
          <span className="title__day">{`${new Date().getDate()} ${getMonth()} ${new Date().getFullYear()}`}</span>
        </h3>
      </div>
      <div className="search">
        <SearchAutocomplete />
      </div>
      <div className="notification">
        <Badge
          count={store.notificationsCount}
          size="20px"
          position={{ top: "0", right: "0" }}
        />
        <RequestDropDownMenu />
      </div>
      <div className="profile">
        <span className="initials">{`${userInfo.first_name[0]}${userInfo.last_name[0]}`}</span>
        <span className="name">
          <DropDownMenu handleLogout={handleLogout} userInfo={userInfo} />
        </span>
      </div>
    </div>
  );
}

export default Navbar;
