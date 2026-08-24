// 🔍 SearchButton - Ví dụ sử dụng nhanh

// ============================================
// 1. IMPORT
// ============================================
import SearchButton from "@/components/ui/SearchButton";
import { useState } from "react";
import { useTranslations } from '@/lib/i18n';

// ============================================
// 2. SỬ DỤNG CƠ BẢN
// ============================================
function BasicExample() {
  const t = useTranslations('common');
  const handleSearch = () => {
    console.log(t('actions.search') + "!");
  };

  return <SearchButton onClick={handleSearch} />;
}

// ============================================
// 3. VỚI LOADING STATE
// ============================================
function LoadingExample() {
  const [loading, setLoading] = useState(false);
  const t = useTranslations('common');

  const handleSearch = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Giả lập API
  console.log(t('messages.searchComplete'));
    } finally {
      setLoading(false);
    }
  };

  return <SearchButton onClick={handleSearch} loading={loading} />;
}

// ============================================
// 4. CUSTOM SIZE & SHAPE
// ============================================
function CustomExample() {
  return (
    <>
      {/* Nhỏ, tròn */}
      <SearchButton 
        onClick={() => {}} 
        size="small" 
        shape="circle" 
      />

      {/* Vừa, bo tròn */}
      <SearchButton 
        onClick={() => {}} 
        size="middle" 
        shape="round" 
      />

      {/* Lớn, vuông */}
      <SearchButton 
        onClick={() => {}} 
        size="large" 
        shape="default" 
      />
    </>
  );
}

// ============================================
// 5. VỚI DISABLE
// ============================================
function DisableExample() {
  const [query, setQuery] = useState("");
  const t = useTranslations('common');

  return (
    <div>
      <input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('placeholders.keyword')}
      />
      <SearchButton 
        onClick={() => console.log(query)}
        disabled={!query.trim()}
        tooltip={query.trim() ? t('actions.search') : t('tooltips.enterKeyword')}
      />
    </div>
  );
}

// ============================================
// 6. FULL EXAMPLE - SEARCH FORM
// ============================================
function SearchForm() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const t = useTranslations('common');

  const handleSearch = async () => {
    if (!query.trim()) {
      alert(t('messages.enterKeywordAlert'));
      return;
    }

    setLoading(true);
    try {
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 1500));
  console.log(t('messages.searched', { query }));
  alert(t('messages.searched', { query }));
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 p-4">
      <input 
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
  placeholder={t('placeholders.keywordSearch')}
        className="flex-1 px-4 py-2 border rounded-lg"
      />
      <SearchButton 
        onClick={handleSearch}
        loading={loading}
        disabled={!query.trim()}
        tooltip={query.trim() ? t('tooltips.searchNow') : t('tooltips.enterKeyword')}
        size="large"
        shape="round"
      />
    </div>
  );
}

// ============================================
// 7. TẤT CẢ PROPS
// ============================================
function AllPropsExample() {
  const [loading, setLoading] = useState(false);
  const t = useTranslations('common');

  return (
    <SearchButton 
      onClick={async () => {
        setLoading(true);
        await new Promise(r => setTimeout(r, 2000));
        setLoading(false);
      }}
      loading={loading}
      size="middle"
      shape="circle"
      tooltip={t('tooltips.searchRooms')}
      className="shadow-lg hover:shadow-xl"
      disabled={false}
    />
  );
}

// ============================================
// 8. TRONG HOMEPAGE (ĐÃ ÁP DỤNG)
// ============================================
/*
export default function HomePage() {
  const { handleSearch: performSearch, loading } = useSearch();
  const { getSearchParams } = useSearchForm();

  const handleSearch = () => {
    performSearch(getSearchParams());
  };

  return (
    <div className="flex-shrink-0 px-2">
      <SearchButton
        onClick={handleSearch}
        loading={loading}
        size="middle"
        shape="circle"
        tooltip="Tìm kiếm"
      />
    </div>
  );
}
*/

export {
  BasicExample,
  LoadingExample,
  CustomExample,
  DisableExample,
  SearchForm,
  AllPropsExample,
};
