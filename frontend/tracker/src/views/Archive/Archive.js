import React, { useEffect, useState } from "react";
import "./Archive.css";

import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";

import { Link } from "react-router-dom";
import { useStateValue } from "../../store/StateProvider";
import Folder from "../../components/DocIcon/Folder";
import File from "../../components/DocIcon/File";
import EmptyPage from "../../components/EmptyPage/EmptyPage";
import { fetchEmployeeArchive } from "../../http/document";
import LoadingBackdrop from "../../components/Loading/LoadingBackdrop";

function Archive() {
  const [store] = useStateValue();
  const [archive, setArchive] = useState([]);
  const [loading, setLoading] = useState(true);

  const _fetchEmployeeArchive = async () => {
    const res = await fetchEmployeeArchive(store.token, store.user.employee_id);
    const data = res.data;
    setArchive(data);
  };

  useEffect(() => {
    _fetchEmployeeArchive();
    setLoading(false);
  }, []);

  return (
    <>
      {!loading ? (
        <div className="archive">
          <div className="archive__container">
            <h2 className="archive__header">Archive</h2>
            <div className="archive__content">
              {archive.length > 0 ? (
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
                        <File
                          doc={item}
                          key={item.document.id}
                          type="archive"
                        />
                      );
                    }
                  })}
                </div>
              ) : (
                <EmptyPage type="archived" />
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
          </div>
        </div>
      ) : (
        <LoadingBackdrop loading={loading} />
      )}
    </>
  );
}

export default Archive;
