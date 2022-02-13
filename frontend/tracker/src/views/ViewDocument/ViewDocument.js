import React, { useEffect, useState } from "react";
import "./ViewDocument.css";
import pdf from "../../assets/images/pdf-img.png";
import LoadingPage from "../../components/Loading/LoadingPage";
import { useParams, useHistory } from "react-router";
import {
  createMinute,
  fetchDocument,
  fetchNextUserToForwardDoc,
  forwardDocument,
  markComplete,
  previewCode,
} from "../../http/document";
import { useStateValue } from "../../store/StateProvider";
import swal from "sweetalert";
import Preview from "../../components/Preview/Preview";
import { showNotification } from "../../utility/helper";
import ForwardModal from "../../components/ForwardModal/ForwardModal";

function ViewDocument() {
  const [store] = useStateValue();
  const history = useHistory();
  const { id, type } = useParams();
  const [document, setDocument] = useState(null);
  const [minute, setMinute] = useState("");
  const [loading, setLoading] = useState(true);
  const [openPreview, setOpenPreview] = useState(false);
  const [code, setCode] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [nextReceiver, setNextReceiver] = useState(null);
  const [previewDoc, setPreviewDoc] = useState({});

  useEffect(() => {
    fetchPreviewCode();
    _fetchDocument();
    _fetchNextUserToForwardDoc();
  }, []);

  const _fetchDocument = async () => {
    const res = await fetchDocument(store.token, id);
    const data = res.data;
    setDocument(data);
    setLoading(false);
  };

  const _fetchNextUserToForwardDoc = async () => {
    const res = await fetchNextUserToForwardDoc(store.token, id);
    const data = res.data;
    setNextReceiver(data.data);
  };

  const fetchPreviewCode = async () => {
    const res = await previewCode(store.token, store.user.employee_id, id);
    const data = res.data;
    setCode(data[0]);
  };

  const handleMarkComplete = async () => {
    swal({
      title: "Are you sure you want to mark this document as complete?",
      text: "This action is irreversible",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willSubmit) => {
      if (willSubmit) {
        const res = await markComplete(store.token, id);
        console.log(res);
        if (res.status === 200) {
          swal("Document has been marked as complete", {
            icon: "success",
          });
          history.push("/");
        }
      }
    });
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

  const handleForwardDocument = async () => {
    if (
      document.document_type === null ||
      document.document_type.name === "Custom"
    ) {
      setOpenModal(true);
    } else {
      swal({
        title: `Are you sure you want to Forward this Document to ${nextReceiver.receiver.first_name} ${nextReceiver.receiver.last_name}?`,
        text: "Forwarding of this Document is irreversible",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (willSubmit) => {
        if (willSubmit) {
          const data = {
            receiver: nextReceiver.receiver,
            document,
          };
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

  const handlePreview = (doc) => {
    setPreviewDoc(doc);
    if (code) {
      if (!code?.used) {
        swal("Enter secret token to view this Document", {
          content: "input",
        }).then(async (value) => {
          if (value) {
            const user_id = store.user.employee_id;
            const document_id = document.id;
            const data = {
              code: value,
            };
            try {
              const res = await previewCode(
                store.token,
                user_id,
                document_id,
                data
              );
              if (res.status === 200) {
                setCode({ ...previewCode, used: true });
                setOpenPreview(true);
              }
            } catch {
              showNotification("Warning", "Wrong token", "warning");
            }
          }
        });
      } else {
        setOpenPreview(true);
      }
    } else {
      setOpenPreview(true);
    }
  };

  return (
    <>
      {!loading ? (
        <div className="view">
          <div className="relatedfiles-section">
            <p>{document.subject}</p>
            {document?.related_document.map((doc) => {
              return (
                <p key={doc.id} onClick={() => handlePreview(doc)}>
                  {doc.subject}
                </p>
              );
            })}
          </div>

          <div className="view__content">
            <div className="file__preview">
              <div
                className="file__preview-box"
                onClick={() => handlePreview(document)}
              >
                <img src={pdf} alt="logo" className="file-preview-box-img" />
              </div>
              <div className="file__action-btn">
                {type === "incoming" && (
                  <>
                    {document.document_type !== "Custom" ? (
                      !nextReceiver?.last_receiver && (
                        <button
                          className="file-btn forward disabled"
                          onClick={() => handleForwardDocument()}
                          disabled={code === undefined ? false : !code?.used}
                        >
                          Forward
                        </button>
                      )
                    ) : (
                      <button
                        className="file-btn forward disabled"
                        onClick={() => handleForwardDocument()}
                        disabled={code === undefined ? false : !code?.used}
                      >
                        Forward
                      </button>
                    )}
                    {document.document_type !== "Custom" ? (
                      nextReceiver?.last_receiver && (
                        <button
                          className="file-btn submit disabled"
                          onClick={handleMarkComplete}
                          disabled={code === undefined ? false : !code?.used}
                        >
                          Mark Complete
                        </button>
                      )
                    ) : (
                      <button
                        className="file-btn submit disabled"
                        onClick={handleMarkComplete}
                        disabled={code === undefined ? false : !code?.used}
                      >
                        Mark Complete
                      </button>
                    )}
                  </>
                )}
              </div>
              {/* {type === "incoming" && store.user.is_staff ? (
              <p className="meta_info">{info?.meta_info}</p>
            ) : null} */}
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
                    disabled={!minute}
                  />
                </form>
              )}
            </div>
          </div>
        </div>
      ) : (
        <LoadingPage />
      )}
      <Preview
        openPreview={openPreview}
        setOpenPreview={setOpenPreview}
        doc={previewDoc}
      />
      <ForwardModal
        document={document}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </>
  );
}

export default ViewDocument;
