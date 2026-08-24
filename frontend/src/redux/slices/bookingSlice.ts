import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Booking } from "@/types/booking.type";

interface BookingState {
  bookings: Booking[];
  selectedBooking: Booking | null;
  isLoading: boolean;
}

const initialState: BookingState = {
  bookings: [],
  selectedBooking: null,
  isLoading: false,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setBookings: (state, action: PayloadAction<Booking[]>) => {
      state.bookings = action.payload;
    },
    setSelectedBooking: (state, action: PayloadAction<Booking | null>) => {
      state.selectedBooking = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    addBooking: (state, action: PayloadAction<Booking>) => {
      state.bookings.push(action.payload);
    },
    updateBooking: (state, action: PayloadAction<Booking>) => {
      const index = state.bookings.findIndex(
        (booking) => booking.id === action.payload.id
      );
      if (index !== -1) {
        state.bookings[index] = action.payload;
      }
    },
    deleteBooking: (state, action: PayloadAction<number>) => {
      state.bookings = state.bookings.filter(
        (booking) => booking.id !== action.payload
      );
    },
    clearBookings: (state) => {
      state.bookings = [];
      state.selectedBooking = null;
    },
  },
});

export const {
  setBookings,
  setSelectedBooking,
  setLoading,
  addBooking,
  updateBooking,
  deleteBooking,
  clearBookings,
} = bookingSlice.actions;

export default bookingSlice.reducer;
