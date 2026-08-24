import { useState } from "react";
import { useGuestCounter } from "../useGuestCounter";
import { useDatePicker } from "../useDatePicker";
import { useLocationDropdown } from "../Location/useLocationDropdown";

export function useSearchForm() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
  
  const guestCounter = useGuestCounter(1, 20);
  const datePicker = useDatePicker();
  const locationDropdown = useLocationDropdown();

  const handleLocationSelect = (locationName: string, locationId: number) => {
    setSearchQuery(locationName);
    // Nếu locationId = 0 thì clear (reset về null)
    setSelectedLocationId(locationId === 0 ? null : locationId);
    locationDropdown.setShowDropdown(false);
  };

  const resetForm = () => {
    setSearchQuery("");
    setSelectedLocationId(null);
    guestCounter.resetGuests();
    datePicker.resetDates();
  };

  const getSearchParams = () => {
    return {
      searchQuery,
      locationId: selectedLocationId,
      checkInDate: datePicker.checkInDate,
      checkOutDate: datePicker.checkOutDate,
      guests: guestCounter.guests,
    };
  };

  return {
    // Search query
    searchQuery,
    setSearchQuery,
    selectedLocationId,
    handleLocationSelect,

    // Guest counter
    guests: guestCounter.guests,
    incrementGuests: guestCounter.incrementGuests,
    decrementGuests: guestCounter.decrementGuests,
    canIncrement: guestCounter.canIncrement,
    canDecrement: guestCounter.canDecrement,

    // Date picker
    checkInDate: datePicker.checkInDate,
    setCheckInDate: datePicker.setCheckInDate,
    checkOutDate: datePicker.checkOutDate,
    setCheckOutDate: datePicker.setCheckOutDate,
    getMinCheckInDate: datePicker.getMinCheckInDate,
    getMinCheckOutDate: datePicker.getMinCheckOutDate,
    isValidDateRange: datePicker.isValidDateRange,

    // Location dropdown
    showLocationDropdown: locationDropdown.showDropdown,
    setShowLocationDropdown: locationDropdown.setShowDropdown,
    searchByLocationId: locationDropdown.searchByLocationId,
    dropdownRef: locationDropdown.dropdownRef,
    filterLocations: locationDropdown.filterLocations,

    // Form actions
    resetForm,
    getSearchParams,
  };
}
