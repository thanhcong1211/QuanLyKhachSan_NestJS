"use client";

import { useTranslations } from "../../lib/i18n";

export default function Footer() {
  const t = useTranslations("footer");

  const cards = [
    { img: "/ngoinha1.jpg", key: "cards.wholeHome" },
    { img: "/cho_o.jpg", key: "cards.uniqueStays" },
    { img: "/trang_trai.jpg", key: "cards.worktrip" },
    { img: "/thucung.jpg", key: "cards.family" },
  ];

  return (
    <>
      <section className="px-10 py-16 bg-white text-black font-manrope">
        <h2 className="text-2xl font-semibold mb-6">{t("title")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {cards.map((item, i) => (
            <div key={i} className="cursor-pointer hover:opacity-80 transition">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.img}
                alt={t(item.key)}
                className="rounded-xl w-full h-52 object-cover mb-2"
              />
              <p className="text-sm font-medium">{t(item.key)}</p>
            </div>
          ))}
        </div>
      </section>

  <footer className="bg-gray-100 text-gray-600 text-sm mt-10 border-t font-manrope">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <h4 className="font-semibold mb-3">{t("support.title")}</h4>
            <ul className="space-y-2">
              <li>{t("support.helpCenter")}</li>
              <li>{t("support.safetyInfo")}</li>
              <li>{t("support.accessibility") ?? t("support.accessibility",) /* fallback if missing */}</li>
              <li>{t("support.cancellation") ?? t("support.cancellation",)}</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">{t("community.title")}</h4>
            <ul className="space-y-2">
              <li>{t("community.events")}</li>
              <li>{t("community.blog")}</li>
              <li>{t("community.partner")}</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">{t("hosting.title")}</h4>
            <ul className="space-y-2">
              <li>{t("hosting.tryHosting")}</li>
              <li>{t("hosting.resources")}</li>
              <li>{t("hosting.forum")}</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">{t("about.title")}</h4>
            <ul className="space-y-2">
              <li>{t("about.news")}</li>
              <li>{t("about.features")}</li>
              <li>{t("about.investors")}</li>
              <li>{t("about.careers")}</li>
            </ul>
          </div>
        </div>

        <div className="border-t py-4 px-6 text-center text-xs text-gray-500">
          {(() => {
            const year = String(new Date().getFullYear());
            const tmpl = t("copyright");
            if (!tmpl) return `© ${year} Airbnb clone - Made with ❤️ by You.`;
            return tmpl.replace("{year}", year);
          })()}
        </div>
      </footer>
    </>
  );
}
