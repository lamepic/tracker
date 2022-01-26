import React, { useEffect, useState } from "react";
import "./Archive.css";

import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";

import { Link } from "react-router-dom";
import { useStateValue } from "../../store/StateProvider";
import Folder from "../../components/DocIcon/Folder";
import File from "../../components/DocIcon/File";
import EmptyPage from "../../components/EmptyPage/EmptyPage";
import { fetchUserArchive } from "../../http/document";
import LoadingPage from "../../components/Loading/LoadingPage";

function Archive() {
  const [store] = useStateValue();
  const [archive, setArchive] = useState([]);
  const [loading, setLoading] = useState(true);

  const _fetchUserArchive = async () => {
    const res = await fetchUserArchive(store.token, store.user.employee_id);
    const data = res.data;
    setArchive(data);
  };

  useEffect(() => {
    _fetchUserArchive();
    setLoading(false);
  }, []);

  if (archive.length === 0) {
    return <EmptyPage type="archived" />;
  }

  return (
    <>
      <div className="archive">
        <div className="archive__container">
          <h2 className="archive__header">Archive</h2>
          {!loading ? (
            <div className="archive__content">
              <div className="archive__items">
                {archive.map((item) => {
                  if (item?.document.related_document?.length > 0) {
                    return (
                      <Folder
                        doc={item}
                        key={item.document.id}
                        type="archive"
                      />
                    );
                  } else {
                    return (
                      <File doc={item} key={item.document.id} type="archive" />
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
          ) : (
            <LoadingPage />
          )}{" "}
        </div>
      </div>
    </>
  );
}

export default Archive;
