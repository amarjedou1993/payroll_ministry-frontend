import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/services/auth.service";
import axiosInstance from "@/api/client";
import Button from "@/components/ui/Button";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  // Fetch user profile
  const { isLoading, isError } = useQuery({
    queryKey: ["user"],
    queryFn: getUserProfile,
    retry: false,
    enabled: true, // Make sure query is only triggered when needed
  });

  const handleLogout = () => {
    // Perform logout actions such as clearing cookies
    axiosInstance.post("/auth/logout").then(() => {
      // Redirect to the login page after logging out
      navigate("/");
    });
  };

  // If still loading user data or there's an error, we don't want to show the page yet
  if (isLoading || isError) {
    return null; // You can return a loading state here if needed
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">403 - Forbidden</h1>
        <p className="text-lg mb-4">
          You don't have permission to access this page
        </p>
        <Button
          onClick={handleLogout}
          className="text-blue-600 border rounded-md p-3 hover:text-white hover:bg-green-700 transition"
        >
          Return to login page
        </Button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
