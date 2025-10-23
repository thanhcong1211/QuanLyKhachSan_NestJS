"use client";
import { useParams } from "next/navigation";
import { useRoom } from "@/hooks/Room/useRoom";
import RoomGallery from "@/components/room/RoomGallery";
import RoomInfo from "@/components/room/RoomInfo";
// RoomReview not used in this page; reviews are rendered by RoomReviewSection
import RoomBookingForm from "@/components/room/RoomBookingForm";
import { Spin } from "antd";
import RoomAmenities from "@/components/room/RoomAmenities";
import RoomReviewSection from "@/components/room/RoomReviewSection";
export default function RoomDetailPage() {
  const params = useParams();
  const id = params?.id ? Number(params.id) : undefined;
  const { room, isLoading } = useRoom(id);
  if (isLoading) return <div className="flex justify-center py-20"><Spin size="large" /></div>;
  if (!room) return <p className="text-center mt-10 text-gray-600">Không tìm thấy phòng</p>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <RoomGallery images={[room.hinhAnh]} />
          <RoomInfo room={room} />
          <RoomAmenities room={room} />
          <RoomReviewSection roomId={room.id} />
        </div>
        <div>
          <div className="sticky top-24">
            <RoomBookingForm roomId={room.id} price={room.giaTien} />
          </div>
        </div>
      </div>
    </div>
  );
}
