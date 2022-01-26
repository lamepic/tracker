import React from "react";
import "./ViewDocument.css";
import logo from "../../assets/images/logo.png";
import { useParams, useHistory } from "react-router";

function ViewDocument() {
  const { id, type } = useParams();
  return (
    <div className="view">
      <div className="relatedfiles-section">
        <p>document subject</p>
      </div>

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

        <div className="vr"></div>

        <div className="file-info">
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
          {type === "incoming" && (
            <form onSubmit={(e) => {}}>
              <textarea
                name="minutes"
                cols="35"
                rows="7"
                placeholder="Please add minutes here..."
                // onChange={(e) => setMinute(e.target.value)}
                // value={minute}
              ></textarea>
              <input
                type="submit"
                value="Add Minute"
                className="minute-button"
                // disabled={minute ? false : true}
              />
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewDocument;
