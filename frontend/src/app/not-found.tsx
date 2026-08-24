"use client";

import { useRouter } from "next/navigation";
import {Button} from "@/components/ui/button";
import { Home, Search } from "lucide-react";
import { useTranslations } from '@/lib/i18n';

export default function NotFound() {
  const router = useRouter();
  const t = useTranslations('notFound');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-rose-500">404</h1>
          <div className="text-6xl mt-4">🏠</div>
        </div>

        {/* Content */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {t('title')}
        </h2>
        <p className="text-gray-600 mb-8">
          {t('subtitle')}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => router.push("/")}
            size="lg"
            className="gap-2"
          >
            <Home size={20} />
            {t('backHome')}
          </Button>
          <Button
            onClick={() => router.push("/search")}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <Search size={20} />
            {t('searchRooms')}
          </Button>
        </div>

        {/* Additional Help */}
        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-gray-500 mb-4">
            Bạn cần hỗ trợ?
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <button className="text-rose-500 hover:underline">
              Trung tâm trợ giúp
            </button>
            <button className="text-rose-500 hover:underline">
              Liên hệ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
