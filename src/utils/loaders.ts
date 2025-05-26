import { getUser, getUsers } from "@/services/auth.service";
import { IUserResponse } from "@/types/types";
import { QueryClient } from "@tanstack/react-query";
import { LoaderFunction, LoaderFunctionArgs } from "react-router-dom";

export const usersLoader =
  (queryClient: QueryClient): LoaderFunction =>
  async () => {
    const queryKey = ["users"];
    return queryClient.ensureQueryData({
      queryKey,
      queryFn: getUsers,
      staleTime: 1000 * 60 * 5,
    });
  };

// export const userDetailsLoader =
//   (queryClient: QueryClient) =>
//   async ({ params }: LoaderFunctionArgs) => {
//     const userId = Number(params.id);

//     // Validate ID format
//     if (!userId || isNaN(userId)) {
//       throw new Response("Invalid User ID", {
//         status: 400,
//         statusText: "Malformed user identifier",
//       });
//     }

//     try {
//       // Fetch with proper typing
//       const data = await queryClient.ensureQueryData<IUserResponse>({
//         queryKey: ["user-details", userId],
//         queryFn: () => getUser(userId),
//         staleTime: 1000 * 60 * 5,
//       });

//       // Verify API response structure
//       if (!data?.id) {
//         throw new Error("Invalid user data structure");
//       }

//       // Return explicit shape
//       return {
//         userDetails: {
//           id: data.id,
//           name: data.name,
//           username: data.username,
//           position: data.position,
//           employeeId: data.employeeId,
//           roles: data.roles,
//         },
//       };
//     } catch (error) {
//       console.error("Loader Failure:", error);
//       throw new Response("User Loading Failed", {
//         status: 500,
//         statusText: "Please try again or contact support",
//       });
//     }
//   };

export const userDetailsLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const userId = Number(params.id);

    if (!userId || isNaN(userId)) {
      throw new Response("Invalid User ID", {
        status: 400,
        statusText: "Malformed user identifier",
      });
    }

    try {
      const data = await queryClient.ensureQueryData<IUserResponse>({
        queryKey: ["user-details", userId],
        queryFn: () => getUser(userId),
        staleTime: 1000 * 60 * 5,
      });

      if (!data?.id) {
        throw new Error("Invalid user data structure");
      }

      console.log("userDetailsLoader Data:", data); // Debug

      const userName = data.name || data.username || `User ${data.id}`;

      return {
        userDetails: {
          id: data.id,
          name: userName,
          username: data.username,
          position: data.position,
          employeeId: data.employeeId,
          roles: data.roles,
        },
      };
    } catch (error) {
      console.error("Loader Failure:", error);
      throw new Response("User Loading Failed", {
        status: 500,
        statusText: "Please try again or contact support",
      });
    }
  };
