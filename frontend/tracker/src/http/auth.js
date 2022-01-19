import axios from "../utility/axios";

export async function verificationToken(id) {
  const res = await axios.post("/auth/login/", { employee_id: id });
  const data = await res;

  return data;
}
