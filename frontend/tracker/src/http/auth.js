import axios, { auth_axios } from "../utility/axios";

// get verification token
export async function verificationToken(id) {
  const res = await axios.post("/auth/login/", { employee_id: id });
  return res;
}

// login user
export async function login(email, token) {
  const body = JSON.stringify({ email, token });
  const res = await auth_axios.post("/auth/token/", body);
  return res;
}

export async function logout(token) {
  const config = {
    headers: {
      Authorization: `Token ${token}`,
    },
  };
  const res = await axios.post("auth/logout/", null, config);
  return res;
}
