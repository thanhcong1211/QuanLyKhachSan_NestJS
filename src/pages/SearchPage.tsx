"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RoomCard from "@/components/RoomCard";
import { Button } from "@/components/ui/button";
import { roomApi } from "@/api/room.api";
import { locationApi } from "@/api/location.api";
import { useSearchForm } from "@/hooks/search/useSearchForm";
import type { Room } from "@/types/room.type";
import type { Location } from "@/types/location.type";
import { Search, SlidersHorizontal, X, MapPin } from "lucide-react";
import { useTranslations } from "@/lib/i18n";

export default function SearchPage() {
  const t = useTranslations("search");
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Lấy params từ URL
  const locationId = searchParams?.get("locationId");
  const queryString = searchParams?.get("q");

  // State để lưu rooms và location info
  const [roomList, setRoomList] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationName, setLocationName] = useState<string>("");
  const [locationsList, setLocationsList] = useState<Location[]>([]);

  // Fetch tất cả locations cho dropdown
  useEffect(() => {
    const fetchAllLocations = async () => {
      try {
        const response = await locationApi.getAll();
        const locations = (response as { content?: Location[] }).content || [];
        setLocationsList(locations);
      } catch (err) {
        console.error("❌ Error fetching locations:", err);
      }
    };
    fetchAllLocations();
  }, []);

  // Fetch location name và rooms khi có locationId
  useEffect(() => {
    const fetchLocationAndRooms = async () => {
      if (!locationId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
  console.log("🔍 Searching rooms by location ID:", locationId);
        
        // Fetch location info để lấy tên
        const locationResponse = await locationApi.getById(parseInt(locationId));
        const locationData = locationResponse as unknown as Location;
        setLocationName(locationData.tenViTri);
        
        // Fetch rooms theo locationId
        const roomsResponse = await roomApi.getByLocation(parseInt(locationId));
        console.log("📍 Response từ API:", roomsResponse);
        
        const rooms = (roomsResponse as { content?: Room[] }).content || [];
        setRoomList(rooms);
        
        console.log(`✅ Tìm thấy ${rooms.length} phòng tại ${locationData.tenViTri}`);
      } catch (err) {
        console.error("❌ Error fetching data:", err);
        setError("Không thể tải danh sách phòng");
        setRoomList([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocationAndRooms();
  }, [locationId]);

  // Search form hook
  const {
    searchQuery,
    setSearchQuery,
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
    dropdownRef,
    filterLocations,
    getSearchParams,
  } = useSearchForm();

  const [searchTerm, setSearchTerm] = useState(queryString || "");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    guests: "",
    bedrooms: "",
    wifi: false,
    parking: false,
    pool: false,
    airConditioner: false,
  });

  // Filter locations cho dropdown
  const filteredLocations = filterLocations(locationsList, searchQuery);

  // Filter rooms based on search and filters
  const filteredRooms = roomList.filter((room) => {
    // Search by name or description
    const matchesSearch =
      !searchTerm ||
      room.tenPhong.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.moTa?.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by price
    const matchesMinPrice =
      !filters.minPrice || room.giaTien >= parseInt(filters.minPrice);
    const matchesMaxPrice =
      !filters.maxPrice || room.giaTien <= parseInt(filters.maxPrice);

    // Filter by guests
    const matchesGuests =
      !filters.guests || room.khach >= parseInt(filters.guests);

    // Filter by bedrooms
    const matchesBedrooms =
      !filters.bedrooms || room.phongNgu >= parseInt(filters.bedrooms);

    // Filter by amenities
    const matchesWifi = !filters.wifi || room.wifi;
    const matchesParking = !filters.parking || room.doXe;
    const matchesPool = !filters.pool || room.hoBoi;
    const matchesAC = !filters.airConditioner || room.dieuHoa;

    return (
      matchesSearch &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesGuests &&
      matchesBedrooms &&
      matchesWifi &&
      matchesParking &&
      matchesPool &&
      matchesAC
    );
  });

  const clearFilters = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
      guests: "",
      bedrooms: "",
      wifi: false,
      parking: false,
      pool: false,
      airConditioner: false,
    });
  };

  const hasActiveFilters = Object.values(filters).some((value) =>
    typeof value === "boolean" ? value : value !== ""
  );

  const handleLocationSelect = (location: Location) => {
    console.log("🎯 Selected location:", location);
    selectLocation(location.tenViTri, location.id);
  };

  const handleSearchSubmit = () => {
    const params = getSearchParams();
    // Navigate lại với params mới
    const urlParams = new URLSearchParams();
    if (params.locationId) {
      urlParams.append("locationId", params.locationId.toString());
    }
    if (params.checkInDate) urlParams.append("checkIn", params.checkInDate);
    if (params.checkOutDate) urlParams.append("checkOut", params.checkOutDate);
    if (params.guests && params.guests > 1) urlParams.append("guests", params.guests.toString());
    
    router.push(`/search?${urlParams.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search Bar - Tìm kiếm nâng cao */}
      <div className="mb-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Location Dropdown */}
          <div className="lg:col-span-3 relative" ref={dropdownRef}>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              <MapPin className="inline w-4 h-4 mr-1" />
              {t("labels.location")}
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowLocationDropdown(true);
                }}
                onFocus={() => setShowLocationDropdown(true)}
                placeholder={t("placeholders.location")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              
              {/* Location Dropdown */}
              {showLocationDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
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
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                              <span className="text-blue-600 text-lg">📍</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">
                            {location.tenViTri}
                          </p>
                          <p className="text-sm text-gray-600">
                            {location.tinhThanh}, {location.quocGia}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      {t("noResults")}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Search by Name */}
          <div className="lg:col-span-4">
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              <Search className="inline w-4 h-4 mr-1" />
              {t("labels.roomName")}
            </label>
            <input
              type="text"
              placeholder={t("placeholders.roomSearch")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Check-in */}
          <div className="lg:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              {t("labels.checkIn")}
            </label>
            <input
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              min={getMinCheckInDate()}
            />
          </div>

          {/* Check-out */}
          <div className="lg:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              {t("labels.checkOut")}
            </label>
            <input
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              min={getMinCheckOutDate()}
            />
          </div>

          {/* Guests + Search Button */}
          <div className="lg:col-span-1 flex flex-col">
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              {t("labels.guests")}
            </label>
            <div className="flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg">
              <button
                onClick={decrementGuests}
                disabled={!canDecrement}
                type="button"
                className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                -
              </button>
              <span className="text-sm font-medium text-gray-800">
                {guests}
              </span>
              <button
                onClick={incrementGuests}
                disabled={!canIncrement}
                type="button"
                className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          <Button onClick={handleSearchSubmit} size="lg" className="flex-1">
            <Search className="w-4 h-4 mr-2" />
            {t("results")}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={20} className="mr-2" />
            Bộ lọc
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">{t("labels.filters")}</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("placeholders.minPrice")}
              </label>
              <input
                type="number"
                placeholder="0"
                value={filters.minPrice}
                onChange={(e) =>
                  setFilters({ ...filters, minPrice: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("placeholders.maxPrice")}
              </label>
              <input
                type="number"
                placeholder="Không giới hạn"
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters({ ...filters, maxPrice: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* Guests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("labels.guests")}
              </label>
              <input
                type="number"
                placeholder="Bất kỳ"
                min="1"
                value={filters.guests}
                onChange={(e) =>
                  setFilters({ ...filters, guests: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("labels.roomName")}
              </label>
              <input
                type="number"
                placeholder="Bất kỳ"
                min="0"
                value={filters.bedrooms}
                onChange={(e) =>
                  setFilters({ ...filters, bedrooms: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Amenities */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t("labels.amenities")}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.wifi}
                  onChange={(e) =>
                    setFilters({ ...filters, wifi: e.target.checked })
                  }
                  className="w-4 h-4 text-rose-500 rounded focus:ring-rose-500"
                />
                <span className="text-sm">Wifi</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.parking}
                  onChange={(e) =>
                    setFilters({ ...filters, parking: e.target.checked })
                  }
                  className="w-4 h-4 text-rose-500 rounded focus:ring-rose-500"
                />
                <span className="text-sm">Bãi đỗ xe</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.pool}
                  onChange={(e) =>
                    setFilters({ ...filters, pool: e.target.checked })
                  }
                  className="w-4 h-4 text-rose-500 rounded focus:ring-rose-500"
                />
                <span className="text-sm">Hồ bơi</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.airConditioner}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      airConditioner: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-rose-500 rounded focus:ring-rose-500"
                />
                <span className="text-sm">Điều hòa</span>
              </label>
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
              <div className="mt-6 flex justify-end">
              <Button variant="ghost" onClick={clearFilters}>
                {t("labels.clearFilters")}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Results Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          {locationId && locationName && (
            <div className="flex items-center gap-2 text-rose-500">
              <MapPin size={24} />
              <span className="text-sm font-medium">Vị trí đã chọn</span>
            </div>
          )}
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          {locationId && locationName
            ? t("resultsHeader.roomsAt", { location: locationName })
            : searchTerm
            ? t("resultsHeader.resultsFor", { term: searchTerm })
            : t("resultsHeader.allRooms")}
        </h1>
        <p className="text-gray-600 mt-2">
          {t("resultsHeader.foundCount", { count: filteredRooms.length })}
          {locationId && <span className="text-gray-500 ml-2">(ID: {locationId})</span>}
        </p>
        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">⚠️ {error}</p>
          </div>
        )}
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">{t("labels.loading")}</p>
          </div>
        </div>
      ) : filteredRooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              onClick={() => router.push(`/room/${room.id}`)}
              className="cursor-pointer"
            >
              <RoomCard room={room} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {t("labels.noResultsTitle")}
          </h3>
          <p className="text-gray-600 mb-4">{t("labels.noResultsDesc")}</p>
          <Button onClick={clearFilters}>{t("labels.clearFilters")}</Button>
        </div>
      )}
    </div>
  );
}
