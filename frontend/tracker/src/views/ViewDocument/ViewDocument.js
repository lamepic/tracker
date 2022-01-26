import React, { useEffect, useState } from "react";
import "./ViewDocument.css";
import logo from "../../assets/images/logo.png";
import LoadingPage from "../../components/Loading/LoadingPage";
import { useParams, useHistory } from "react-router";
import { createMinute, fetchDocument } from "../../http/document";
import { useStateValue } from "../../store/StateProvider";

function ViewDocument() {
  const [store] = useStateValue();
  const { id, type } = useParams();
  const [document, setDocument] = useState(null);
  const [minute, setMinute] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    _fetchDocument();
  }, []);

  const _fetchDocument = async () => {
    const res = await fetchDocument(store.token, id);
    const data = res.data;
    setDocument(data);
    setLoading(false);
  };

  const handleMinute = async (e) => {
    e.preventDefault();
    const res = await createMinute(store.token, id, minute);
    const data = res.data;
    if (res.status === 201) {
      setDocument({ ...document, minute: [data, ...document.minute] });
      setMinute("");
    }
  };

  return (
    <>
      {!loading ? (
        <div className="view">
          {document?.related_document?.length > 0 ? (
            <div className="relatedfiles-section">
              <p>{document.subject}</p>
              {document?.related_document.map((doc) => {
                return <p key={doc.id}>{doc.subject}</p>;
              })}
            </div>
          ) : null}

          <div className="view__content">
            <div className="file__preview">
              <div className="file__preview-box">
                <img src={logo} alt="logo" className="file-preview-box-img" />
              </div>
              <div className="file__action-btn">
                {type === "incoming" && (
                  <>
                    <button
                      className="file-btn forward"
                      // onClick={() => handleForwardDocument()}
                    >
                      Forward
                    </button>
                    <button
                      className="file-btn submit"
                      // onClick={handleMarkComplete}
                    >
                      Mark Complete
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className={`vr ${type !== "incoming" && "vr-sm"}`}></div>

            <div className="file-info">
              <div
                className={`minute-box-preview ${
                  type !== "incoming" && "minute-box-preview-lg"
                }`}
              >
                <div>
                  {document?.minute?.map((item) => {
                    return (
                      <div className="minute" key={item?.id}>
                        <p>{item?.content}</p>
                        <p className="employee">{item?.user}</p>
                        <p className="date">
                          Date: {new Date(item?.date).toDateString()}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
              {type === "incoming" && (
                <form
                  onSubmit={(e) => {
                    handleMinute(e);
                  }}
                >
                  <textarea
                    name="minutes"
                    cols="35"
                    rows="7"
                    placeholder="Please add minutes here..."
                    onChange={(e) => setMinute(e.target.value)}
                    value={minute}
                  ></textarea>
                  <input
                    type="submit"
                    value="Add Minute"
                    className="minute-button"
                    disabled={minute ? false : true}
                  />
                </form>
              )}
            </div>
          </div>
        </div>
      ) : (
        <LoadingPage />
      )}
    </>
  );
}

export default ViewDocument;
