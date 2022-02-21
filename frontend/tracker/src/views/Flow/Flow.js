import React from "react";
import "./Flow.css";

import FlowField from "../../components/FlowField/FlowField";

function Flow() {
  return (
    <div className="flow">
      <h2 className="flow__header">Create Document Flow</h2>
      <hr className="divider" />
      <div className="flow__content">
        <div className="flow-type">
          <div className="flow-group">
            <label htmlFor="">Name of Flow</label>
            <input type="text" id="action-type" />
          </div>

          <div className="flow-action">
            <div className="action">
              <h3 className="action__header">Add Actions</h3>
              <FlowField />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Flow;
