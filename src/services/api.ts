import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import tokenStorage from "../utils/tokenStorage";

const BASE = import.meta.env.VITE_API_BASE || "https://reqres.in";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE}/api`,
    prepareHeaders: (headers) => {
      const token = tokenStorage.get();
      if (token) headers.set("Authorization", `Bearer ${token}`);
      const apiKey = import.meta.env.VITE_REQRES_API_KEY;
      if (apiKey) headers.set("x-api-key", apiKey);
      return headers;
    },
  }),
  tagTypes: ["Users"],
  endpoints: () => ({}),
});
