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

      <DropdownMenuContent align="end" className="w-48 bg-rose-50/80 backdrop-blur-sm border border-rose-200 shadow-lg">
        <DropdownMenuItem 
          onClick={() => changeLanguage("vi")} 
          className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-rose-100/80 focus:bg-rose-100/80 text-gray-900 font-medium rounded-md"
        >
          <span className="text-xl">🇻🇳</span>
          <span>Tiếng Việt</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => changeLanguage("en")} 
          className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-rose-100/80 focus:bg-rose-100/80 text-gray-900 font-medium rounded-md"
        >
          <span className="text-xl">🇬🇧</span>
          <span>English</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
