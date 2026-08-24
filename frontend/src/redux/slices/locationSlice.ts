import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Location } from "@/types/location.type";

interface LocationState {
  locations: Location[];
  selectedLocation: Location | null;
  isLoading: boolean;
}

const initialState: LocationState = {
  locations: [],
  selectedLocation: null,
  isLoading: false,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocations: (state, action: PayloadAction<Location[]>) => {
      state.locations = action.payload;
    },
    setSelectedLocation: (state, action: PayloadAction<Location | null>) => {
      state.selectedLocation = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    addLocation: (state, action: PayloadAction<Location>) => {
      state.locations.push(action.payload);
    },
    updateLocation: (state, action: PayloadAction<Location>) => {
      const index = state.locations.findIndex(
        (location) => location.id === action.payload.id
      );
      if (index !== -1) {
        state.locations[index] = action.payload;
      }
    },
    deleteLocation: (state, action: PayloadAction<number>) => {
      state.locations = state.locations.filter(
        (location) => location.id !== action.payload
      );
    },
    clearLocations: (state) => {
      state.locations = [];
      state.selectedLocation = null;
    },
  },
});

export const {
  setLocations,
  setSelectedLocation,
  setLoading,
  addLocation,
  updateLocation,
  deleteLocation,
  clearLocations,
} = locationSlice.actions;

export default locationSlice.reducer;
