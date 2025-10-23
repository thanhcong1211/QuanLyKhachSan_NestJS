"use client";

import { useAuth } from "@/hooks/Auth/useAuth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { useTranslations } from "@/lib/i18n";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const t = useTranslations("auth.register");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    birthday: "",
    gender: true,
  });
  const [error, setError] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!acceptTerms) {
      setError(t("acceptTerms") || "You must accept terms");
      return;
    }

    register.mutate(form, {
      onSuccess: () => {
        router.push("/login");
      },
      onError: (err) => {
        setError(err instanceof Error ? err.message : "Đăng ký thất bại");
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("title")}</h1>
            <p className="text-gray-600">{t("subtitle")}</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t("nameLabel")}</label>
              <Input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder={t("namePlaceholder")}
                required
                disabled={register.isPending}
              />
            </div>

            {/* Email */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t("emailLabel")}</label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder={t("emailPlaceholder")}
                required
                disabled={register.isPending}
              />
            </div>

            {/* Password */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t("passwordLabel")}</label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                required
                disabled={register.isPending}
              />
                <p className="mt-1 text-xs text-gray-500">{t("passwordHint")}</p>
            </div>

            {/* Phone */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t("phoneLabel")}</label>
              <Input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="0909xxxxxx"
                required
                disabled={register.isPending}
              />
            </div>

            {/* Birthday & Gender */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t("birthdayLabel")}</label>
                <input
                  type="date"
                  value={form.birthday}
                  onChange={(e) => setForm({ ...form, birthday: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  disabled={register.isPending}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t("genderLabel")}</label>
                <select
                  value={form.gender ? "true" : "false"}
                  onChange={(e) =>
                    setForm({ ...form, gender: e.target.value === "true" })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  disabled={register.isPending}
                >
                  <option value="true">{t("male")}</option>
                  <option value="false">{t("female")}</option>
                </select>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 w-4 h-4 text-rose-500 border-gray-300 rounded focus:ring-rose-500"
                disabled={register.isPending}
              />
              <label className="ml-2 text-sm text-gray-600">
                {t("agreeIntro")} {" "}
                <a href="#" className="text-rose-500 hover:underline">{t("terms")}</a>{" "}
                {t("and")} {" "}
                <a href="#" className="text-rose-500 hover:underline">{t("privacy")}</a>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full mt-2"
              size="lg"
              disabled={register.isPending || !acceptTerms}
            >
              {register.isPending ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  {t("loading")}
                </>
              ) : (
                t("submit")
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">hoặc</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Social Register */}
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="font-medium text-gray-700">
                Đăng ký với Google
              </span>
            </button>

            <button className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition">
              <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="font-medium text-gray-700">
                Đăng ký với Facebook
              </span>
            </button>
          </div>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Đã có tài khoản?{" "}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-rose-500 font-semibold hover:underline"
            >
              Đăng nhập
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
