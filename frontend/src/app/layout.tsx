// Apply Ant Design v5 patch for React 19 compatibility globally
import '@ant-design/v5-patch-for-react-19';
import "@/styles/globals.css";
import { Manrope } from "next/font/google";
import Providers from "@/app/Providers";
import { cookies } from "next/headers";
import { defaultLocale } from "@/i18n/config";
import enMessages from "../../messages/en.json";
import viMessages from "../../messages/vi.json";
import MainLayout from '@/layouts/MainLayout';

// Load the Manrope font at module scope (required by Next.js font loader)
const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"],
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Read NEXT_LOCALE cookie server-side (await per Next.js dynamic API requirement)
  const cookieStore = await cookies();
  const cookie = cookieStore.get("NEXT_LOCALE");
  const locale = (cookie?.value as string) || defaultLocale;
  const messages = locale === "vi" ? viMessages : enMessages;

  return (
    <html lang={locale} className={manrope.className}>
      <body>
        <Providers initialLocale={locale} initialMessages={messages}>
          <MainLayout >{children}</MainLayout> 
        </Providers>
      </body>
    </html>
  );
}
