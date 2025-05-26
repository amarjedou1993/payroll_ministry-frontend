import axiosInstance from "@/api/client";
import {
  IUserResponse,
  IPayrollReponse,
  PaginatedPayrollsResponse,
  PaginatedUsersResponse,
  LastFivePayrollsResponse,
  PaginatedUsersResponse2,
} from "@/types/types";

export const loginUser = async (
  username: string,
  password: string
): Promise<IUserResponse | null> => {
  try {
    await axiosInstance.post("/auth/login", { username, password });
    return await getUserProfile();
  } catch (error: any) {
    throw (
      error.response?.data?.message || "Failed to log in. Please try again."
    );
  }
};

export const checkAuth = async (): Promise<{
  isAuthenticated: boolean;
  user?: IUserResponse;
}> => {
  try {
    const response = await axiosInstance.get<{
      isAuthenticated: boolean;
      user?: IUserResponse;
    }>("/auth/status");
    return response.data;
  } catch (error) {
    console.error("Authentication check error:", error);
    return { isAuthenticated: false };
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
      return null;
    }
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await axiosInstance.post("/auth/logout");
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Logout failed. Please try again.";
    console.error("Logout failed:", message);
    throw new Error(message);
  }
};

export const getUsers = async (): Promise<IUserResponse[]> => {
  try {
    const response = await axiosInstance.get<IUserResponse[]>("/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// export const getUser = async (id: number): Promise<IUserResponse> => {
//   try {
//     const response = await axiosInstance.get<IUserResponse>(`/users/${id}`);
//     if (!response.data?.id) {
//       console.error("Malformed API Response:", response.data);
//       throw new Error("Invalid user data structure from API");
//     }
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching user:", error);
//     throw error;
//   }
// };

export const getUser = async (id: number): Promise<IUserResponse> => {
  try {
    const response = await axiosInstance.get<IUserResponse>(`/users/${id}`);
    console.log("API Response for getUser:", response.data); // Debug
    if (!response.data?.id) {
      console.error("Malformed API Response:", response.data);
      throw new Error("Invalid user data structure from API");
    }
    if (!response.data.name && !response.data.username) {
      console.warn("User missing name and username:", response.data);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const getPayrolls = async (): Promise<IPayrollReponse[]> => {
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

export const getPayrollsById = async (
  userId: number
): Promise<IPayrollReponse[]> => {
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
    const params: Record<string, string> = {
      page: String(Math.max(page, 1)),
      limit: String(Math.min(Math.max(limit, 1), 50)),
    };
    if (userId) params.userId = userId;
    const response = await axiosInstance.get<PaginatedPayrollsResponse>(
      "/payroll/limitedPayrolls",
      { params }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching payrolls:",
      error.response?.data?.message || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch payrolls"
    );
  }
};

export const getAllPayrolls = async (
  page: number = 1,
  limit: number = 6,
  userId?: string,
  month?: number,
  year?: number,
  search?: string
): Promise<PaginatedPayrollsResponse> => {
  try {
    const params: Record<string, string> = {
      page: String(Math.max(page, 1)),
      limit: String(Math.min(Math.max(limit, 1), 50)),
    };
    if (search) params.search = search;
    if (userId) params.userId = userId;
    if (typeof month === "number" && month >= 0 && month <= 11) {
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
  } catch (error: any) {
    console.error(
      "Error fetching payrolls:",
      error.response?.data?.message || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch payrolls"
    );
  }
};

export const getUsersWithFilters = async (
  page: number = 1,
  limit: number = 10,
  role?: string,
  search?: string
): Promise<PaginatedUsersResponse2> => {
  try {
    const params: Record<string, string> = {
      page: String(Math.max(page, 1)),
      limit: String(Math.min(Math.max(limit, 1), 50)),
    };
    if (role) params.role = role;
    if (search) params.search = search;
    const response = await axiosInstance.get<PaginatedUsersResponse2>(
      "/users/paginatedUsers",
      { params }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching users:",
      error.response?.data?.message || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to fetch users");
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
  } catch (error: any) {
    console.error(
      "Error fetching users:",
      error.response?.data?.message || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};

export const getLastFivePayrolls =
  async (): Promise<LastFivePayrollsResponse> => {
    try {
      const response = await axiosInstance.get<LastFivePayrollsResponse>(
        "/payroll/lastFive"
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "Error fetching last five payrolls:",
        error.response?.data?.message || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to fetch last five payrolls"
      );
    }
  };
