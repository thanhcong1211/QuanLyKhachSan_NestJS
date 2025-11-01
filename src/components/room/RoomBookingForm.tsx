"use client";
import { useState } from "react";
import { useBooking } from "@/hooks/Booking/useBooking";
import { useAppSelector } from "@/redux/hooks";
import { message } from "antd";
import { useTranslations } from "@/lib/i18n";

export default function RoomBookingForm({ roomId, price }: { roomId: number; price: number }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guest, setGuest] = useState(1);
  const { bookRoom } = useBooking();
  const user = useAppSelector((state) => state.auth.user);
  const t = useTranslations("room.bookingForm");

  const handleBook = () => {
    if (!user?.id) {
      message.error(t('loginRequired'));
      return;
    }

    if (!checkIn || !checkOut) {
      message.error(t('selectDates'));
      return;
    }

    // Convert dates to ISO format
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    bookRoom.mutate({
      maPhong: roomId,
      ngayDen: checkInDate.toISOString(),
      ngayDi: checkOutDate.toISOString(),
      soLuongKhach: guest,
      maNguoiDung: Number(user.id),
    });
  };

  const calcNights = () => {
    if (!checkIn || !checkOut) return 0;
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diff = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const nights = calcNights();
  const subtotal = nights * price;

  return (
    <div className="border rounded-lg p-4 shadow-md sticky top-24 bg-white">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold">{price.toLocaleString()} ₫</div>
          <div className="text-sm text-gray-600">{t('perNight')}</div>
        </div>
        <div className="text-sm text-gray-600">4.83 · 48 {t('reviews')}</div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="border p-2 rounded-lg"
          placeholder={t('checkIn')}
        />
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="border p-2 rounded-lg"
          placeholder={t('checkOut')}
        />
      </div>

      <div className="mt-3">
        <select
          value={guest}
          onChange={(e) => setGuest(Number(e.target.value))}
          className="w-full border p-2 rounded-lg"
        >
          {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} {t('guests')}</option>)}
        </select>
      </div>

      <button
        onClick={handleBook}
        className="mt-4 w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 rounded-lg transition"
        disabled={bookRoom.isPending}
      >
        {bookRoom.isPending ? t('bookingInProgress') : t('bookButton')}
      </button>

      <div className="mt-3 text-sm text-gray-600">
        <div>{t('estimatedTotal')}</div>
        <div className="flex items-center justify-between">
          <div>{price.toLocaleString()} ₫ x {nights} {t('nights')}</div>
          <div className="font-medium">{subtotal.toLocaleString()} ₫</div>
        </div>
      </div>
    </div>
  );
}
