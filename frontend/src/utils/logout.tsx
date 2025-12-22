import API from "../api/axiosConfig";

export const logout = (
  navigate: (path: string, options?: { replace?: boolean }) => void
) => {
  localStorage.clear();
  sessionStorage.clear();
  delete API.defaults.headers.common["Authorization"];
  navigate("/", { replace: true });
  window.history.pushState(null, "", "/");
};

