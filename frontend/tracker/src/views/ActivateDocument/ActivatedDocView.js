import React, { useEffect, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { useStateValue } from "../../store/StateProvider";
import logo from "../../assets/images/logo.png";
import { fetchDocument } from "../../http/document";
import Preview from "../../components/Preview/Preview";
import LoadingPage from "../../components/Loading/LoadingPage";

function ActivatedDocView() {
  const [store, dispatch] = useStateValue();
  const [openPreview, setOpenPreview] = useState(false);
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);

  const activatedDoc = store.activatedDocumentDetails;

  useEffect(() => {
    _fetchDocument(store.token);
  }, []);

  const _fetchDocument = async () => {
    const res = await fetchDocument(store.token, activatedDoc.document.id);
    const data = res.data;
    setDocument(data);
    setLoading(false);
  };

  if (!activatedDoc) {
    return <Redirect to="/" />;
  }

  const handlePreview = () => {
    setOpenPreview(!openPreview);
  };

  return (
    <>
      {!loading ? (
        <div className="view">
          <div className="relatedfiles-section">
            <p>{document.subject}</p>
            {document?.related_document.map((doc) => {
              return (
                <p key={doc.id} onClick={handlePreview}>
                  {doc.subject}
                </p>
              );
            })}
          </div>

          <div className="view__content">
            <div className="file-preview">
              <p className="file-preview-title">{document.subject}</p>
              <div className="file__preview-box" onClick={handlePreview}>
                <img src={logo} alt="logo" className="file-preview-box-img" />
              </div>

              <div className="file-action-btn">
                <Preview
                  openPreview={openPreview}
                  setOpenPreview={setOpenPreview}
                />
              </div>
            </div>

            <div className="file-info">
              <p className="file-info-title">Minutes</p>
              <div className="minute-box-preview">
                <div>
                  {" "}
                  {document?.minute?.map((item) => {
                    return (
                      <div className="minute" key={item?.id}>
                        <p>{item?.content}</p>
                        <p className="employee">{item?.employee}</p>
                        <p className="date">
                          Date: {new Date(item?.date).toDateString()}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <LoadingPage />
      )}
    </>
  );
}

export default ActivatedDocView;
