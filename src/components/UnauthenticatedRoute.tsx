import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import LoadingSpinner from "./ui/LoadingSpinner";

const UnauthenticatedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth
  );

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default UnauthenticatedRoute;
