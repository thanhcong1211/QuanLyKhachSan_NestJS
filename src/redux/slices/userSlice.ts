import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types/user.type";

interface UserState {
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
}

const initialState: UserState = {
  users: [],
  selectedUser: null,
  isLoading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex((user) => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    deleteUser: (state, action: PayloadAction<number>) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
    },
    clearUsers: (state) => {
      state.users = [];
      state.selectedUser = null;
    },
  },
});

export const {
  setUsers,
  setSelectedUser,
  setLoading,
  addUser,
  updateUser,
  deleteUser,
  clearUsers,
} = userSlice.actions;

export default userSlice.reducer;
