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

// incoming count
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

// incoming documents
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

// outgoing count
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

// incoming documents
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
