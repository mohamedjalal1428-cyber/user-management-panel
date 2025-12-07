import type { User } from "../../features/auth/types";
import { api } from "../api";

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<
      { token: string },
      { email: string; password: string }
    >({
      query: (body) => ({ url: "/login", method: "POST", body }),
    }),
    getUser: build.query<
      {
        data: {
          id: number;
          email: string;
          first_name: string;
          last_name: string;
          avatar?: string;
        };
      },
      number
    >({
      query: (id) => `/users/${id}`,
    }),

    fetchUsers: build.query<
      {
        page: number;
        per_page: number;
        total: number;
        total_pages: number;
        data: User[];
      },
      number
    >({
      query: (page = 1) => `/users?page=${page}`,
      providesTags: (result) =>
        result
          ? [
              { type: "Users" as const, id: "LIST" },
              ...result.data.map((u) => ({ type: "Users" as const, id: u.id })),
            ]
          : [{ type: "Users" as const, id: "LIST" }],
    }),

    createUser: build.mutation<
      { id: string; name: string; job: string; createdAt: string },
      { name: string; job: string }
    >({
      query: (body) => ({ url: "/users", method: "POST", body }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),

    updateUser: build.mutation<
      { name: string; job: string; updatedAt: string },
      { id: number | string; name: string; job: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Users", id: arg.id }],
    }),

    deleteUser: build.mutation<void, number>({
      query: (id) => ({ url: `/users/${id}`, method: "DELETE" }),
      invalidatesTags: (result, error, id) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUserQuery,
  useLoginMutation,
  useFetchUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = authApi;
