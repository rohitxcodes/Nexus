import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../utils/storage";

export default function PublicRoute({ children }) {
  return isAuthenticated() ? <Navigate to="/home" replace /> : children;
}
