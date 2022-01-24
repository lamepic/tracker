import React, { useEffect, useState } from "react";
import "./Outgoing.css";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";

import { Link } from "react-router-dom";
import Folder from "../../components/DocIcon/Folder";
import File from "../../components/DocIcon/File";
import EmptyPage from "../../components/EmptyPage/EmptyPage";
import { fetchOutgoing } from "../../http/document";
import { useStateValue } from "../../store/StateProvider";
import LoadingPage from "../../components/Loading/LoadingPage";

function Outgoing() {
  const [store] = useStateValue();
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);

  const outgoingCount = store.outgoingCount;

  const _fetchOutgoing = async () => {
    const res = await fetchOutgoing(store.token);
    const data = res.data;
    setOutgoing(data);
  };

  useEffect(() => {
    _fetchOutgoing();
    setLoading(false);
  }, []);

  return (
    <>
      <div className="outgoing">
        <div className="outgoing__container">
          <h2 className="outgoing__header">Pending</h2>
          {!loading ? (
            <div className="outgoing__content">
              {!outgoingCount === 0 ? (
                <div className="outgoing__items">
                  {outgoing.map((item) => {
                    if (item.related_document.length > 0) {
                      return (
                        <Folder
                          doc={item}
                          key={item.document.id}
                          type="outgoing"
                        />
                      );
                    } else {
                      return (
                        <File
                          doc={item}
                          key={item.document.id}
                          type="outgoing"
                        />
                      );
                    }
                  })}
                </div>
              ) : (
                <EmptyPage type="outgoing" />
              )}
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
          ) : (
            <LoadingPage />
          )}
        </div>
      </div>
    </>
  );
}

export default Outgoing;
