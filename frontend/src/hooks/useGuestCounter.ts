import { useState } from "react";

export function useGuestCounter(initialGuests: number = 1, maxGuests: number = 20) {
  const [guests, setGuests] = useState(initialGuests);

  const incrementGuests = () => {
    if (guests < maxGuests) {
      setGuests(guests + 1);
    }
  };

  const decrementGuests = () => {
    if (guests > 1) {
      setGuests(guests - 1);
    }
  };

  const resetGuests = () => {
    setGuests(initialGuests);
  };

  return {
    guests,
    incrementGuests,
    decrementGuests,
    resetGuests,
    canIncrement: guests < maxGuests,
    canDecrement: guests > 1,
  };
}
