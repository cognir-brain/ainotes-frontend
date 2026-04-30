import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const accessToken = useSelector((s) => s.auth.accessToken);
  const profile = useSelector((s) => s.auth.profile);
  console.log(profile);
  if (!accessToken) return <Navigate to="/login" replace />;
  // optionally ensure profile is loaded
  return children;
}

export default PrivateRoute;