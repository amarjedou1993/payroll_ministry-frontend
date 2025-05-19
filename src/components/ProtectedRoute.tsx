// // DeepSeek
// import { useEffect, useCallback } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "../store";
// import { getUserProfile } from "../services/auth.service";
// import { setUser, clearUser } from "../store/slices/authSlice";
// import LoadingSpinner from "./ui/LoadingSpinner";
// import { Outlet, Navigate } from "react-router-dom";

// const ProtectedRoute = ({ allowedRoles = [] }: { allowedRoles?: string[] }) => {
//   // const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { user, isAuthenticated, isLoading } = useSelector(
//     (state: RootState) => state.auth
//   );

//   const verifyAuth = useCallback(async () => {
//     try {
//       const userData = await getUserProfile();
//       dispatch(setUser(userData));
//     } catch (error) {
//       console.error("Authentication error:", error);
//       dispatch(clearUser());
//     }
//   }, [dispatch]);

//   // Initial auth check and visibility/focus handlers
//   useEffect(() => {
//     if (isAuthenticated) verifyAuth();

//     const handleVisibilityChange = () => {
//       if (document.visibilityState === "visible" && isAuthenticated) {
//         verifyAuth();
//       }
//     };

//     const handleFocus = () => {
//       if (isAuthenticated) verifyAuth();
//     };

//     document.addEventListener("visibilitychange", handleVisibilityChange);
//     window.addEventListener("focus", handleFocus);

//     return () => {
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//       window.removeEventListener("focus", handleFocus);
//     };
//   }, [isAuthenticated, verifyAuth]);

//   if (isLoading) {
//     return <LoadingSpinner fullScreen />;
//   }

//   if (!isAuthenticated || !user) {
//     return <Navigate to="/auth" replace />;
//   }

//   // Role-based access control
//   const userRoles =
//     user.roles?.map((role: { name: string }) => role.name) || [];
//   const hasAccess =
//     allowedRoles.length === 0 ||
//     allowedRoles.some((role) => userRoles.includes(role));

//   if (!hasAccess) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return <Outlet />;
// };

// export default ProtectedRoute;

import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { getUserProfile } from "../services/auth.service";
import { setUser, clearUser } from "../store/slices/authSlice";
import LoadingSpinner from "./ui/LoadingSpinner";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles = [] }: { allowedRoles?: string[] }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth
  );

  const verifyAuth = useCallback(async () => {
    try {
      const userData = await getUserProfile();
      dispatch(setUser(userData));
    } catch (error) {
      console.error("Authentication error:", error);
      dispatch(clearUser());
    }
  }, [dispatch]);

  // Initial auth check and visibility/focus handlers
  useEffect(() => {
    if (isAuthenticated) verifyAuth();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && isAuthenticated) {
        verifyAuth();
      }
    };

    const handleFocus = () => {
      if (isAuthenticated) verifyAuth();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [isAuthenticated, verifyAuth]);

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth" replace />;
  }

  // Role-based access control
  const userRoles =
    user.roles?.map((role: { name: string }) => role.name) || [];
  const hasAccess =
    allowedRoles.length === 0 ||
    allowedRoles.some((role) => userRoles.includes(role));

  if (!hasAccess) {
    throw new Response("Forbidden", {
      status: 403,
      statusText: "You don’t have permission to access this.",
    });
  }

  return <Outlet />;
};

export default ProtectedRoute;
