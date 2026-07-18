"use client";
import { useState } from "react";
import { Star, Calendar, Users2 } from "lucide-react";
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
    <div className="rounded-2xl border border-gray-200 shadow-lg shadow-gray-900/5 p-5 sticky top-24 bg-white">
      <div className="flex items-baseline justify-between">
        <div>
          <span className="text-2xl font-bold text-gray-900">{price.toLocaleString()} ₫</span>
          <span className="text-sm text-gray-500"> {t('perNight')}</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-700">
          <Star size={14} className="fill-rose-500 text-rose-500" />
          <span className="font-medium">4.83</span>
          <span className="text-gray-400">· 48 {t('reviews')}</span>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-gray-300 divide-y divide-gray-300">
        <div className="grid grid-cols-2 divide-x divide-gray-300">
          <label className="p-2.5">
            <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              <Calendar size={12} /> {t('checkIn')}
            </span>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full bg-transparent text-sm text-gray-900 outline-none mt-0.5"
            />
          </label>
          <label className="p-2.5">
            <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              <Calendar size={12} /> {t('checkOut')}
            </span>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-transparent text-sm text-gray-900 outline-none mt-0.5"
            />
          </label>
        </div>
        <label className="block p-2.5">
          <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
            <Users2 size={12} /> {t('guests')}
          </span>
          <select
            value={guest}
            onChange={(e) => setGuest(Number(e.target.value))}
            className="w-full bg-transparent text-sm text-gray-900 outline-none mt-0.5"
          >
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} {t('guests')}</option>)}
          </select>
        </label>
      </div>

      <button
        onClick={handleBook}
        className="mt-4 w-full bg-rose-500 hover:bg-rose-600 active:scale-[0.99] text-white font-semibold py-3 rounded-xl transition shadow-sm shadow-rose-500/30 disabled:opacity-60 disabled:pointer-events-none"
        disabled={bookRoom.isPending}
      >
        {bookRoom.isPending ? t('bookingInProgress') : t('bookButton')}
      </button>

      <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500 space-y-2">
        <div className="flex items-center justify-between">
          <span className="underline decoration-dotted underline-offset-2">
            {price.toLocaleString()} ₫ x {nights} {t('nights')}
          </span>
          <span className="text-gray-700">{subtotal.toLocaleString()} ₫</span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 font-semibold text-gray-900">
          <span>{t('estimatedTotal')}</span>
          <span>{subtotal.toLocaleString()} ₫</span>
        </div>
      </div>
    </div>
  );
}
