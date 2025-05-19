import axios from "axios";
import axiosInstance from "../api/client";
import {
  IPayrollReponse,
  IUserResponse,
  User,
  PaginatedUsersResponse,
  PaginatedPayrollsResponse,
  PaginatedUsersResponse2,
  LastFivePayrollsResponse,
} from "../types/types";

// Login function with improved error handling
// export const loginUser = async (
//   username: string,
//   password: string
// ): Promise<User | null> => {
//   try {
//     await axiosInstance.post("/auth/login", { username, password });
//     return await getUserProfile(); // Fetch profile immediately after login
//   } catch (error: any) {
//     throw (
//       error.response?.data?.message || "Failed to log in. Please try again."
//     );
//   }
// };

// export const getUserProfile = async (): Promise<User | null> => {
//   try {
//     const res = await axiosInstance.get<User>("/auth/profile", {
//       withCredentials: true,
//     });
//     return res.data;
//   } catch (error: any) {
//     if (error.response?.status === 401) {
//       // User is not authenticated, return null instead of throwing an error
//       return null;
//     }
//     throw error;
//   }
// };

export const loginUser = async (
  username: string,
  password: string
): Promise<IUserResponse | null> => {
  try {
    await axiosInstance.post("/auth/login", { username, password });
    return await getUserProfile(); // Fetch profile immediately after login
  } catch (error: any) {
    throw (
      error.response?.data?.message || "Failed to log in. Please try again."
    );
  }
};

// Check the auth staus
export const checkAuth = async (): Promise<{
  isAuthenticated: boolean;
  user?: User;
}> => {
  try {
    const response = await axiosInstance.get("/auth/status");
    return response.data;
  } catch (error) {
    console.error("Authentication check error:", error);
    return { isAuthenticated: false }; // Return a default value on error
  }
};

export const getUserProfile = async (): Promise<IUserResponse | null> => {
  try {
    const res = await axiosInstance.get<IUserResponse>("/auth/profile", {
      withCredentials: true,
    });
    return res.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      // User is not authenticated, return null instead of throwing an error
      return null;
    }
    throw error;
  }
};

// Logout function that clears React Query cache (if needed)
export const logoutUser = async (): Promise<void> => {
  try {
    await axiosInstance.post("/auth/logout");
  } catch (error: any) {
    console.error(
      "Logout failed:",
      error.response?.data?.message || error.message
    );
  }
};

// Get all users
export const getUsers = async () => {
  try {
    const response = await axiosInstance.get<IUserResponse[]>("/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const getUser = async (id: number): Promise<IUserResponse> => {
  const response = await axiosInstance.get(`/users/${id}`);

  if (!response.data?.id) {
    console.error("Malformed API Response:", response.data);
    throw new Error("Invalid user data structure from API");
  }

  return response.data;
};

export const getPayrolls = async () => {
  try {
    const response = await axiosInstance.get<IPayrollReponse[]>(
      "/payroll/payrolls"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching payrolls:", error);
    throw error;
  }
};

export const getPayrollsById = async (userId: number) => {
  // if (!userId) return []; // Prevents API call if userId is undefined
  try {
    const response = await axiosInstance.get<IPayrollReponse[]>(
      `/users/${userId}/payrolls`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching payrolls:", error);
    throw error;
  }
};

export const findPayrolls = async (
  page: number = 1,
  limit: number = 6,
  userId?: string
): Promise<PaginatedPayrollsResponse> => {
  try {
    // Define query parameters
    const params: Record<string, string> = {
      page: String(Math.max(page, 1)), // Ensure page >= 1
      limit: String(Math.min(Math.max(limit, 1), 50)), // Keep limit reasonable
    };

    if (userId) params.userId = userId;

    // Make the request to the correct endpoint
    const response = await axiosInstance.get<PaginatedPayrollsResponse>(
      "/payroll/limitedPayrolls", // Match the backend endpoint
      { params }
    );

    return response.data;
  } catch (error) {
    // Handle Axios errors
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching payrolls:",
        error.response?.data?.message || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to fetch payrolls"
      );
    }
    throw error;
  }
};

export const getAllPayrolls = async (
  page: number = 1,
  limit: number = 6,
  userId?: string,
  month?: number,
  year?: number,
  search?: string // Add search parameter
): Promise<PaginatedPayrollsResponse> => {
  try {
    const params: Record<string, string> = {
      page: String(Math.max(page, 1)),
      limit: String(Math.min(Math.max(limit, 1), 50)),
    };

    // Add search parameter if provided
    if (search) {
      params.search = search; // 👈 Sends 'search' parameter
    }

    if (userId) {
      params.userId = userId;
    }

    if (typeof month === "number") {
      if (month < 0 || month > 11) {
        return {
          data: [],
          meta: {
            currentPage: page,
            totalPages: 0,
            totalItems: 0,
            itemsPerPage: limit,
          },
        };
      }
      params.month = String(month);
    }

    if (typeof year === "number") {
      params.year = String(year);
    }

    const response = await axiosInstance.get<PaginatedPayrollsResponse>(
      "/payroll/limitedPayrolls",
      { params }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching payrolls:",
        error.response?.data?.message || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to fetch payrolls"
      );
    }
    throw error;
  }
};

export const fetchUsers = async (
  page: number = 1,
  limit: number = 10
): Promise<PaginatedUsersResponse> => {
  try {
    const response = await axiosInstance.get<PaginatedUsersResponse>("/users", {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching users:",
        error.response?.data?.message || error.message
      );
      throw new Error(error.response?.data?.message || "Failed to fetch users");
    }
    throw error;
  }
};

// New function: Paginated users with role and search filters
export const getUsersWithFilters = async (
  page: number = 1,
  limit: number = 10,
  role?: string,
  search?: string
): Promise<PaginatedUsersResponse2> => {
  try {
    const params: Record<string, string> = {
      page: String(Math.max(page, 1)), // Ensure page >= 1
      limit: String(Math.min(Math.max(limit, 1), 50)), // Clamp limit between 1 and 50
    };

    if (role) params.role = role;
    if (search) params.search = search;

    const response = await axiosInstance.get<PaginatedUsersResponse2>(
      "/users/paginatedUsers",
      {
        params,
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching users:",
        error.response?.data?.message || error.message
      );
      throw new Error(error.response?.data?.message || "Failed to fetch users");
    }
    throw error;
  }
};

export const fetchUsersWithFilters = async (
  page: number,
  limit: number,
  roleFilter?: string,
  searchTerm?: string
): Promise<PaginatedUsersResponse2> => {
  const params: Record<string, string | number> = {
    page: page.toString(),
    limit: limit.toString(),
  };
  if (roleFilter) params.role = roleFilter; // e.g., "Admin", "Manager", "Employee"
  if (searchTerm) params.search = searchTerm; // e.g., searches name, employeeId, position

  const response = await axiosInstance.get("/users/paginatedUsers", { params });
  return response.data;
};

export const getLastFivePayrolls =
  async (): Promise<LastFivePayrollsResponse> => {
    try {
      const response = await axiosInstance.get<LastFivePayrollsResponse>(
        "/payroll/lastFive"
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error fetching last five payrolls:",
          error.response?.data?.message || error.message
        );
        throw new Error(
          error.response?.data?.message || "Failed to fetch last five payrolls"
        );
      }
      throw error;
    }
  };
