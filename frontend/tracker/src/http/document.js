import axios from "../utility/axios";

// create document --trail
export async function createDocument(token, data) {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Token ${token}`,
    },
  };

  const receiver = data.receiver.employee_id;
  const department = data.department.name;

  const formData = new FormData();
  formData.append("receiver", receiver);
  formData.append("department", department);
  formData.append("document", data.document);
  formData.append("subject", data.subject);
  formData.append("reference", data.reference);
  formData.append("documentType", data.documentType);

  for (let count = 0; count < data.attachments.length; count++) {
    formData.append(`attachment_${count}`, data.attachments[count].file);
    formData.append(
      `attachment_subject_${count}`,
      data.attachments[count].subject
    );
  }

  const res = await axios.post("create-document/", formData, config);
  return res;
}

// Number of incoming documents
export async function fetchIncomingCount(token) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  };

  const res = await axios.get("incoming-count/", config);
  return res;
}

// Incoming documents
export async function fetchIncoming(token) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  };

  const res = await axios.get("incoming/", config);
  return res;
}

// Number of outgoing documents
export async function fetchOutgoingCount(token) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  };

  const res = await axios.get("outgoing-count/", config);
  return res;
}

// Outgoing documents
export async function fetchOutgoing(token) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  };

  const res = await axios.get("outgoing/", config);
  return res;
}

// Individual employee archived documents
export async function fetchUserArchive(token, user_id) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  };

  const res = await axios.get(`archive/${user_id}/`, config);
  return res;
}

// All employee archived documents
export async function fetchArchive(token) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  };

  const res = await axios.get(`archive/`, config);
  return res;
}

// Tracking trail of a document
export async function fetchTracking(token, document_id) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  };

  const res = await axios.get(`tracking/${document_id}`, config);
  return res;
}

// Minutes
export async function createMinute(token, documentId, data) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  };

  const res = await axios.post(`minutes/${documentId}/`, data, config);
  return res;
}

export async function fetchDocument(token, id) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  };

  const res = await axios.get(`document/${id}`, config);
  return res;
}

export async function markComplete(token, id) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  };

  const res = await axios.post(`mark-complete/${id}/`, null, config);
  return res;
}

export async function previewCode(token, user_id, document_id, data = null) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  };

  if (data !== null) {
    const res = await axios.post(
      `preview-code/${user_id}/${document_id}/`,
      data,
      config
    );
    return res;
  } else {
    const res = await axios.get(
      `preview-code/${user_id}/${document_id}/`,
      config
    );
    return res;
  }
}

export async function fetchDocumentType(token) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  };

  const res = await axios.get("document-type/", config);
  return res;
}

export async function fetchDocumentAction(token, id) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  };

  const res = await axios.get(`document-action/${id}`, config);
  return res;
}
