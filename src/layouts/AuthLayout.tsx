"use client";

import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      {/* Ảnh bên trái - Sử dụng ảnh có sẵn */}
      <div className="hidden md:block w-1/2 relative bg-gradient-to-br from-pink-500 to-purple-600">
        <Image
          src="/trangchu.jpg"
          alt="Auth background"
          fill
          className="object-cover opacity-80"
          priority
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/50 to-purple-600/50"></div>
      </div>

      {/* Form bên phải */}
      <div className="flex-1 flex flex-col justify-center items-center bg-white px-6 sm:px-10">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
