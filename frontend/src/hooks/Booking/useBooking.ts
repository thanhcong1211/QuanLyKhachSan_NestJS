import { useMutation } from "@tanstack/react-query";
import { bookingService } from "@/services/bookingService";
import { message } from "antd";

export const useBooking = () => {
  const bookRoom = useMutation({
    mutationFn: bookingService.create,
    onSuccess: () => message.success("Đặt phòng thành công!"),
    onError: () => message.error("Đặt phòng thất bại."),
  });

  return { bookRoom };
};
