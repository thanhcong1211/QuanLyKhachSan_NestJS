"use client";

import { useState, useEffect } from "react";
import { useSearch } from "@/hooks/search/useSearch";
import { useSearchForm } from "@/hooks/search/useSearchForm";
import { locationApi } from "@/api/location.api";
import { roomApi } from "@/api/room.api";
import type { Room } from "@/types/room.type";
import type { Location } from "@/types/location.type";
import { MapPin, Calendar, Users } from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import SearchButton from "@/components/ui/SearchButton";


export default function HomePage() {
  const t = useTranslations("home");
  const tSearch = useTranslations("search");
  const tCommon = useTranslations("common");
  const { handleSearch: performSearch, loading } = useSearch();
  
  // State để lưu locations và rooms từ API
  const [locationsList, setLocationsList] = useState<Location[]>([]);
  const [featuredLocations, setFeaturedLocations] = useState<Location[]>([]); // Vị trí nổi bật để hiển thị
  const [roomList, setRoomList] = useState<Room[]>([]);
  const [, setIsLoadingRooms] = useState(true);
  const [currentPage] = useState(1);
  const [, setTotalPages] = useState(1);
  
  // Fetch locations cho dropdown và featured locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        // 1. Lấy tất cả locations cho dropdown
        const allLocationsResponse = await locationApi.search({
          pageIndex: 1,
          pageSize: 100,
        });
        console.log("📍 All locations response:", allLocationsResponse);
        
        const allData = allLocationsResponse as { content?: Location[] };
        const allLocations = allData.content || [];
        setLocationsList(allLocations);

        // 2. Lấy danh sách vị trí nổi bật để hiển thị 4 cột x 2 hàng (8 items)
        const featuredResponse = await locationApi.search({
          pageIndex: 1,
          pageSize: 8,
        });
        console.log("⭐ Featured locations response:", featuredResponse);
        
        const featuredData = featuredResponse as { content?: Location[] };
        const featured = featuredData.content || [];
        // Giới hạn 8 items để hiển thị 4 cột x 2 hàng
        setFeaturedLocations(featured.slice(0, 8));
        
      } catch (error) {
        console.error("❌ Error fetching locations:", error);
        // Fallback về getAll nếu search failed
        try {
          const response = await locationApi.getAll();
          const locations = (response as { content?: Location[] }).content || [];
          setLocationsList(locations);
          setFeaturedLocations(locations.slice(0, 8)); // Lấy 8 vị trí đầu
        } catch (err) {
          console.error("❌ Fallback getAll also failed:", err);
          setLocationsList([]);
          setFeaturedLocations([]);
        }
      }
    };
    
    fetchLocations();
  }, []);

  // Fetch rooms với phân trang
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoadingRooms(true);
        
        // Gọi API phân trang tìm kiếm
        const response = await roomApi.search({
          // Không truyền params để lấy tất cả
        });
        
        console.log("🏠 roomApi.search() response:", response);
        
        // API trả về { statusCode, content: [], pageIndex, pageSize, totalRow }
        const data = response as {
          content?: Room[];
          pageIndex?: number;
          pageSize?: number;
          totalRow?: number;
        };
        
        const rooms = data.content || [];
        setRoomList(rooms);
        
        // Tính tổng số trang
        if (data.totalRow && data.pageSize) {
          setTotalPages(Math.ceil(data.totalRow / data.pageSize));
        }
        
        console.log(`✅ Đã tải ${rooms.length} phòng (trang ${data.pageIndex || 1})`);
      } catch (error) {
        console.error("❌ Error fetching rooms:", error);
        setRoomList([]);
      } finally {
        setIsLoadingRooms(false);
      }
    };
    
    fetchRooms();
  }, [currentPage]);

  // Use search form hook for all form state management
  const {
    searchQuery,
    setSearchQuery,
    selectedLocationId,
    handleLocationSelect: selectLocation,
    guests,
    incrementGuests,
    decrementGuests,
    canIncrement,
    canDecrement,
    checkInDate,
    setCheckInDate,
    checkOutDate,
    setCheckOutDate,
    getMinCheckInDate,
    getMinCheckOutDate,
    showLocationDropdown,
    setShowLocationDropdown,
    searchByLocationId,
    dropdownRef,
    filterLocations,
    getSearchParams,
  } = useSearchForm();

  // Filter locations based on search query
  const filteredLocations = filterLocations(locationsList, searchQuery);

  const handleLocationSelect = (location: Location) => {
    console.log("🎯 Selected location:", location);
    selectLocation(location.tenViTri, location.id);
  };

  const handleSearch = () => {
    performSearch(getSearchParams());
  };

  return (
    <div className="min-h-screen">
      {/* Debug Panel - Hiển thị thông tin locations */}
      {selectedLocationId && (
        <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg shadow-xl z-50 max-w-sm">
          <h3 className="font-bold mb-2 text-yellow-400">🔍 Location Debug</h3>
          <div className="text-xs space-y-1">
            <p><strong>Location ID:</strong> {selectedLocationId}</p>
            <p><strong>Search Query:</strong> {searchQuery}</p>
            <p><strong>Total Locations:</strong> {locationsList.length}</p>
            <p><strong>Filtered Locations:</strong> {filteredLocations.length}</p>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      {/* Hero Banner với hình nền */}
      <div className="relative h-[500px] bg-gradient-to-br from-pink-500 via-rose-400 to-pink-600 overflow-visible">
        {/* Hình nền overlay - Sử dụng hình từ public folder */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/trangchu.jpg')",
          }}
        />
        
        {/* Gradient overlay - Tạo hiệu ứng màu đẹp */}
        <div className="absolute inset-0 " />
        
        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center px-4">
          <div className="text-center text-white mb-8 max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              {t("hero.title")}
            </h1>
            <p className="text-xl md:text-2xl mb-2 drop-shadow-md">
              {t("hero.subtitle")}
            </p>
            <p className="text-lg opacity-90 drop-shadow-md">
              {t("hero.roomsIntro", { count: roomList.length })}
              {selectedLocationId && <span className="ml-2 text-sm">(Vị trí ID: {selectedLocationId})</span>}
            </p>
          </div>

          {/* Search Box */}
          <div className="absolute bottom-[400px] flex items-center w-[90%] max-w-5xl bg-white rounded-full shadow-lg border border-gray-300 p-2">
            {/* Địa điểm */}
            <div
              className="flex-[2] pl-6 pr-3 py-3 border-r border-gray-300 relative"
              ref={dropdownRef}
            >
              <p className="text-xs font-semibold text-gray-700 mb-1">
                Địa điểm
              </p>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowLocationDropdown(true);
                }}
                onFocus={() => setShowLocationDropdown(true)}
                placeholder={tSearch('placeholders.location')}
                className="w-full text-sm text-gray-800 bg-transparent border-none outline-none placeholder-gray-400"
              />

              {/* Location Dropdown */}
              {showLocationDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                  {searchByLocationId && /^\d+$/.test(searchQuery.trim()) && (
                    <div className="p-3 bg-blue-50 border-b border-blue-200">
                      <div className="flex items-center text-blue-700">
                        <span className="text-lg mr-2">🔢</span>
                        <span className="text-sm font-medium">
                          Tìm kiếm theo ID vị trí: {searchQuery.trim()}
                        </span>
                      </div>
                      <p className="text-xs text-blue-600 mt-1">
                        Nhấn tìm kiếm để xem phòng theo vị trí này
                      </p>
                    </div>
                  )}
                  {filteredLocations.length > 0 ? (
                    filteredLocations.map((location) => (
                      <div
                        key={location.id}
                        onClick={() => handleLocationSelect(location)}
                        className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div className="w-12 h-12 bg-gray-200 rounded-lg mr-3 flex-shrink-0">
                          {location.hinhAnh ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={location.hinhAnh}
                              alt={location.tenViTri}
                              className="w-full h-full object-cover rounded-lg"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder-location.jpg";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                              <span className="text-blue-600 text-lg">📍</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-800">
                              {location.tenViTri}
                            </p>
                            {searchByLocationId && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                ID: {location.id}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {location.tinhThanh}, {location.quocGia}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      <span className="text-2xl mb-2 block">🔍</span>
                      {searchByLocationId 
                        ? `Không tìm thấy vị trí với ID: ${searchQuery.trim()}`
                        : "Không tìm thấy địa điểm"
                      }
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Nhận phòng */}
            <div className="flex-1 px-4 py-3 border-r border-gray-300">
              <p className="text-xs font-semibold text-gray-700 mb-1">
                Nhận phòng
              </p>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full text-sm text-gray-800 bg-transparent border-none outline-none"
                min={getMinCheckInDate()}
              />
            </div>

            {/* Trả phòng */}
            <div className="flex-1 px-4 py-3 border-r border-gray-300">
              <p className="text-xs font-semibold text-gray-700 mb-1">
                Trả phòng
              </p>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full text-sm text-gray-800 bg-transparent border-none outline-none"
                min={getMinCheckOutDate()}
              />
            </div>

            {/* Khách */}
            <div className="flex-1 px-4 py-3 border-r border-gray-300">
              <p className="text-xs font-semibold text-gray-700 mb-1">Khách</p>
              <div className="flex items-center space-x-1">
                <button
                  onClick={decrementGuests}
                  disabled={!canDecrement}
                  className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  aria-label="Giảm số khách"
                >
                  -
                </button>
                <span
                  className="text-sm text-gray-800 min-w-[1.5rem] text-center"
                  aria-label={`${guests} khách`}
                >
                  {guests}
                </span>
                <button
                  onClick={incrementGuests}
                  disabled={!canIncrement}
                  className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  aria-label="Tăng số khách"
                >
                  +
                </button>
              </div>
            </div>

            {/* Nút tìm kiếm */}
            <div className="flex-shrink-0 px-2">
              <SearchButton
                onClick={handleSearch}
                loading={loading}
                size="middle"
                shape="circle"
                tooltip={tCommon('actions.search')}
              />
            </div>
          </div>
        </div>

        {/* Decorative waves */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Rooms Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {selectedLocationId 
              ? `${t("hero.title")} - ${searchQuery}`
              : featuredLocations.length > 0
                ? t("explore.shortTitle")
                : t("explore.longTitle")}
          </h2>
          <p className="text-sm text-gray-600">
            {selectedLocationId
              ? `${t("hero.roomsIntro", { count: locationsList.length })}`
              : t("hero.roomsIntro", { count: locationsList.length })}
          </p>
        </div>

        {/* Featured Locations Section - Hiển thị các vị trí nổi bật */}
        {featuredLocations.length > 0 && (
          <div className="mb-1">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
              {featuredLocations.map((location) => (
                <div
                  key={location.id}
                  className="flex items-start gap-2 group cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition-colors"
                  onClick={() => handleLocationSelect(location)}
                >
                  {/* Image - Small square thumbnail */}
                  <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden shadow-sm">
                    {location.hinhAnh ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={location.hinhAnh}
                        alt={location.tenViTri}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder-location.jpg";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        <span className="text-xl">🏙️</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Location Info - Next to image */}
                  <div className="flex-1 min-w-0 py-1">
                    <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-rose-600 transition-colors">
                      {location.tenViTri}
                    </h3>
                    <p className="text-xs text-gray-600 truncate mt-0.5">
                      {Math.floor(Math.random() * 100) + 5} giờ lái xe
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {t("features.title")}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-rose-500" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t("features.items.locations.title")}</h3>
              <p className="text-gray-600">
                {t("features.items.locations.desc")}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="text-rose-500" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t("features.items.booking.title")}</h3>
              <p className="text-gray-600">
                {t("features.items.booking.desc")}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-rose-500" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t("features.items.support.title")}</h3>
              <p className="text-gray-600">
                {t("features.items.support.desc")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
