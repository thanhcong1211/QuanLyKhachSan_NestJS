import { useState } from "react";

export function useDatePicker() {
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");

  const getMinCheckInDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const getMinCheckOutDate = () => {
    return checkInDate || new Date().toISOString().split("T")[0];
  };

  const resetDates = () => {
    setCheckInDate("");
    setCheckOutDate("");
  };

  const isValidDateRange = () => {
    if (!checkInDate || !checkOutDate) return true;
    return new Date(checkOutDate) > new Date(checkInDate);
  };

  return {
    checkInDate,
    setCheckInDate,
    checkOutDate,
    setCheckOutDate,
    getMinCheckInDate,
    getMinCheckOutDate,
    resetDates,
    isValidDateRange,
  };
}
