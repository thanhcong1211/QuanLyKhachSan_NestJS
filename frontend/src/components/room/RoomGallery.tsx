"use client";
export default function RoomGallery({ images }: { images: string[] }) {
  if (!images?.length)
    return (
      <div className="bg-gray-100 h-64 flex items-center justify-center text-gray-400 rounded-2xl">
        Không có hình ảnh
      </div>
    );

  const main = images[0];
  const thumbs = images.slice(1, 5);

  if (thumbs.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl shadow-sm group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={main}
          alt="main"
          className="w-full h-[420px] sm:h-[480px] lg:h-[540px] object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-1.5 rounded-2xl overflow-hidden shadow-sm">
      {/* Main large image */}
      <div className="lg:col-span-2 relative group overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={main}
          alt="main"
          className="w-full h-[520px] object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Right column thumbnails */}
      <div className="flex flex-col gap-1.5">
        {thumbs.map((img, idx) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={idx}
            src={img}
            alt={`thumb-${idx}`}
            className="w-full h-32 lg:h-[126px] object-cover transition-transform duration-500 hover:scale-105"
          />
        ))}
      </div>
    </div>
  );
}
