"use client";

import Image from "next/image";
import LanguageSwitcher from "@/components/navbar/LanguageSwitcher";
import { useTranslations } from "@/lib/i18n";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("auth.layout");

  return (
    <div className="flex h-screen">
      {/* Left image */}
      <div className="hidden md:block w-1/2 relative bg-gradient-to-br from-pink-500 to-purple-600">
        <Image
          src="/trangchu.jpg"
          alt={t("backgroundAlt")}
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/50 to-purple-600/50"></div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex flex-col justify-center items-center bg-white px-6 sm:px-10">
        <div className="w-full max-w-md">
          {/* Top bar: language switcher */}
          <div className="flex justify-end mb-6">
            <LanguageSwitcher />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
