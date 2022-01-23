import React from "react";
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
import { IconButton, Typography } from "@mui/material";
// import SearchAutocomplete from "../Autocomplete/SearchAutocomplete";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { logout } from "../../http/auth";

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
  const [store, dispatch] = useStateValue();
  const history = useHistory();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //   const handleRequest = (details) => {
  //     setAnchorEl(null);
  //     dispatch({
  //       type: actionTypes.SET_REQUEST_DETAILS,
  //       payload: details,
  //     });
  //     history.push("/dashboard/activate-document");
  //   };

  //   const handleOpenActivatedDoc = (details) => {
  //     setAnchorEl(null);
  //     dispatch({
  //       type: actionTypes.SET_ACTIVATED_DOCUMENTS_DETAILS,
  //       payload: details,
  //     });
  //     history.push("/dashboard/activated-document");
  //   };

  //   const requests = store.requests;
  //   const activatedDocs = store.activatedDocuments;

  return (
    <div>
      <IconButton
        id="demo-customized-button"
        aria-controls="demo-customized-menu"
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        // endIcon={<NotificationsIcon />}
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
        {/* {requests.map((request) => {
          const id = request.id;
          const name = `${request.created_by.user.first_name} ${request.created_by.user.last_name}`;
          const document = request.document.subject;
          const department = request.created_by.department.name;
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
        })}
        {activatedDocs.map((doc) => {
          const id = doc.id;
          const name = `${doc.document_sender.user.first_name} ${doc.document_sender.user.last_name}`;
          const document = doc.document.subject;
          const department = doc.document_sender.department.name;
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
        {requests.length === 0 && activatedDocs.length === 0 && (
          <MenuItem>
            <div className="request">
              <p className="empty__request">You have 0 Notifications</p>
            </div>
          </MenuItem>
        )} */}
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

  //   const documentName = store.documents.map((document) => {
  //     const { subject, id, ref } = document;
  //     return { id, subject, ref };
  //   });

  return (
    <div className="navbar">
      <div className="title">
        <h2 className="title__text">Dashboard</h2>
        <h3 className="title__date">
          {getDay()}{" "}
          <span className="title__day">{`${new Date().getDate()} ${getMonth()} ${new Date().getFullYear()}`}</span>
        </h3>
      </div>
      <div className="search">{/* <SearchAutocomplete /> */}</div>
      <div className="notification">
        <Badge count={10} size="20px" position={{ top: "0", right: "0" }} />
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