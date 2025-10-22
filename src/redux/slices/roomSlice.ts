import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Room } from "@/types/room.type";

interface RoomState {
  rooms: Room[];
  selectedRoom: Room | null;
  isLoading: boolean;
}

const initialState: RoomState = {
  rooms: [],
  selectedRoom: null,
  isLoading: false,
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setRooms: (state, action: PayloadAction<Room[]>) => {
      state.rooms = action.payload;
    },
    setSelectedRoom: (state, action: PayloadAction<Room | null>) => {
      state.selectedRoom = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    addRoom: (state, action: PayloadAction<Room>) => {
      state.rooms.push(action.payload);
    },
    updateRoom: (state, action: PayloadAction<Room>) => {
      const index = state.rooms.findIndex((room) => room.id === action.payload.id);
      if (index !== -1) {
        state.rooms[index] = action.payload;
      }
    },
    deleteRoom: (state, action: PayloadAction<number>) => {
      state.rooms = state.rooms.filter((room) => room.id !== action.payload);
    },
    clearRooms: (state) => {
      state.rooms = [];
      state.selectedRoom = null;
    },
  },
});

export const {
  setRooms,
  setSelectedRoom,
  setLoading,
  addRoom,
  updateRoom,
  deleteRoom,
  clearRooms,
} = roomSlice.actions;

export default roomSlice.reducer;
