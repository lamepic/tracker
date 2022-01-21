import React from "react";
import "./Outgoing.css";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";

import { Link } from "react-router-dom";
import { useStateValue } from "../../store/StateProvider";
import Folder from "../../components/DocIcon/Folder";
import File from "../../components/DocIcon/File";
import EmptyPage from "../../components/EmptyPage/EmptyPage";

function Outgoing() {
  const [state] = useStateValue();

  //   const data = state.outgoing;

  //   if (data.length === 0) {
  //     return <EmptyPage type="Outgoing" />;
  //   }

  //   const handleData = (data) => {
  //     console.log("working", data);
  //   };

  return (
    <div className="outgoing">
      <div className="outgoing__container">
        <h2 className="outgoing__header">Pending</h2>
        <div className="outgoing__content">
          {/* {data && (
            <div className="outgoing__items">
              {data.map((item) => {
                if (item.related_document.length > 0) {
                  return (
                    <Folder doc={item} key={item.document.id} type="outgoing" />
                  );
                } else {
                  return (
                    <File doc={item} key={item.document.id} type="outgoing" />
                  );
                }
              })}
            </div>
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

export default Outgoing;
