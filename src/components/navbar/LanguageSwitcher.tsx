"use client";

// no next/navigation hooks needed for cookie-based locale switching
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { setLang } from "@/utils/i18n";

export default function LanguageSwitcher() {
  // router and pathname are intentionally unused now; keep imports if you plan to
  // re-enable path-prefix behavior later. Otherwise you can remove these lines.
  // const router = useRouter();
  // const pathname = usePathname() || "/";

  const changeLanguage = (lang: string) => {
    // set cookie so server-side rendering can pick it up
    // Simpler: don't change the pathname. Set the locale cookie then reload so
    // server-side rendering picks up the new locale. This avoids creating
    // /en/… or /vi/… routes which this app doesn't define and would 404.
    setLang(lang); // default reload = true
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="bg-black text-white border-gray-700 hover:bg-gray-800 hover:text-rose-300">
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLanguage("vi")} className="text-white">🇻🇳 Tiếng Việt</DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage("en")} className="text-white">🇬🇧 English</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
