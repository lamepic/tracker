import React, { useEffect, useState } from "react";
import "./Incoming.css";

import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";

import { Link } from "react-router-dom";
import { useStateValue } from "../../store/StateProvider";
import Folder from "../../components/DocIcon/Folder";
import File from "../../components/DocIcon/File";
import EmptyPage from "../../components/EmptyPage/EmptyPage";
import { fetchIncoming } from "../../http/document";
import LoadingBackdrop from "../../components/Loading/LoadingBackdrop";

function Incoming() {
  const [store] = useStateValue();
  const [incoming, setIncoming] = useState([]);
  const [loading, setLoading] = useState(true);

  const incomingCount = store.incomingCount;

  const _fetchIncoming = async () => {
    const res = await fetchIncoming(store.token);
    const data = res.data;
    setIncoming(data);
  };

  useEffect(() => {
    _fetchIncoming();
    setLoading(false);
  }, []);

  if (incomingCount === 0) {
    return <EmptyPage type="incoming" />;
  }

  return (
    <>
      {!loading ? (
        <div className="incoming">
          <div className="incoming__container">
            <h2 className="incoming__header">Received</h2>
            <div className="incoming__content">
              <div className="incoming__items">
                {incoming.map((item) => {
                  if (item.related_document.length > 0) {
                    return (
                      <Folder
                        doc={item}
                        key={item.document.id}
                        type="incoming"
                      />
                    );
                  } else {
                    return (
                      <File doc={item} key={item.document.id} type="incoming" />
                    );
                  }
                })}
              </div>

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
      ) : (
        <LoadingBackdrop loading={loading} />
      )}
    </>
  );
}

export default Incoming;
