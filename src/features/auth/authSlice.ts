import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import tokenStorage from "../../utils/tokenStorage";

interface AuthState {
  token: string | null;
  email?: string | null;
}

const initialState: AuthState = {
  token: tokenStorage.get(),
  email: null,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; email?: string }>
    ) => {
      state.token = action.payload.token;
      state.email = action.payload.email ?? state.email;
      tokenStorage.set(action.payload.token);
    },
    logout: (state) => {
      state.token = null;
      state.email = null;
      tokenStorage.remove();
    },
  },
});

export const { setCredentials, logout } = slice.actions;
export default slice.reducer;
