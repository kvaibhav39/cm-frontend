import jwtDecode from "jwt-decode";
import { store } from "../store";

export const authCheck = () => {
  let currentLoginProfile = localStorage.getItem("loginProfile");

  if (localStorage.getItem(`${currentLoginProfile}_login`)) {
    let { token } = JSON.parse(
      localStorage.getItem(`${currentLoginProfile}_login`)
    );

    if (!token) {
      return;
    }

    const { exp } = jwtDecode(token);

    if (exp * 1000 < Date.now()) {
      localStorage.removeItem(`${currentLoginProfile}_login`);

      window.location.href = process.env.REACT_APP_BASE_URL;
    }
  }
  return;
};
