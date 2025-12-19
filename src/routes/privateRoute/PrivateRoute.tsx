import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "../../store";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { token, user } = useSelector((state: RootState) => state.user);
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default PrivateRoute;
