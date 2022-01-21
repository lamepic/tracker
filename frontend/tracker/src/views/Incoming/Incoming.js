import React from "react";
import "./Incoming.css";

import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";

import { Link } from "react-router-dom";
import { useStateValue } from "../../store/StateProvider";
import Folder from "../../components/DocIcon/Folder";
import File from "../../components/DocIcon/File";
import EmptyPage from "../../components/EmptyPage/EmptyPage";

function Incoming() {
  const [store] = useStateValue();

  //   const data = store.incoming;

  return (
    <div className="incoming">
      <div className="incoming__container">
        <h2 className="incoming__header">Received</h2>
        <div className="incoming__content">
          {/* {data.length > 0 ? (
            <div className="incoming__items">
              {data.map((item) => {
                if (item.related_document.length > 0) {
                  return (
                    <Folder doc={item} key={item.document.id} type="incoming" />
                  );
                } else {
                  return (
                    <File doc={item} key={item.document.id} type="incoming" />
                  );
                }
              })}
            </div>
          ) : (
            <EmptyPage type="Incoming" />
          )} */}
          <Link to="/dashboard/add-document">
            <Fab
              size="medium"
              sx={{
                backgroundColor: "#582F08",
                color: "#E3BC97",
                position: "absolute",
                right: "10px",
                bottom: "0px",
              }}
              aria-label="add"
            >
              <AddIcon />
            </Fab>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Incoming;
