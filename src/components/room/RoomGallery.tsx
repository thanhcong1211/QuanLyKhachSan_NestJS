"use client";
export default function RoomGallery({ images }: { images: string[] }) {
  if (!images?.length)
    return (
      <div className="bg-gray-100 h-64 flex items-center justify-center text-gray-400">
        Không có hình ảnh
      </div>
    );

  const main = images[0];
  const thumbs = images.slice(1, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 rounded-lg overflow-hidden">
      {/* Main large image */}
  <div className="lg:col-span-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={main} alt="main" className="w-full h-[520px] object-cover rounded-lg" />
      </div>

      {/* Right column thumbnails */}
      <div className="flex flex-col gap-2">
        {thumbs.map((img, idx) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={idx} src={img} alt={`thumb-${idx}`} className="w-full h-36 object-cover rounded-lg" />
        ))}
      </div>
    </div>
  );
}
