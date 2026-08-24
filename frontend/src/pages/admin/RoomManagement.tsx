"use client";
import '@ant-design/v5-patch-for-react-19';
import useRoomManager from "@/hooks/Room/useRoomManager";
import { useEffect, useState, useMemo } from "react";
import { locationService } from "@/services/locationService";
import type { Location } from "@/types/location.type";
import { useTranslations } from "@/lib/i18n";
import type { Room } from "@/types/room.type";
import { Modal, Spin, Select } from "antd";
import AdminPagination from "@/components/ui/admin-pagination";
import {
  Plus,
  Edit,
  Trash2,
  Image as ImageIcon,
  Home,
  DollarSign,
  MapPin,
  Upload as UploadIcon,
  Users,
  Bed,
  Bath,
} from "lucide-react";

export default function RoomManagement() {
  const t = useTranslations("roomManagement");
  const tc = useTranslations("common");

  const {
    rooms,
    loading,
    searchKeyword,
    pageIndex,
    totalPages,
    totalRows,
    isModalOpen,
    modalMode,
    formData,
    imagePreview,
    setFormData,
    setIsModalOpen,
    setPageIndex,
    setSearchKeyword,
    handleSearch,
    openCreate,
    openEdit,
    handleDelete,
    submit,
    handleImageChange,
  } = useRoomManager();

  // State cho loại tìm kiếm
  const [searchType, setSearchType] = useState<"name" | "price" | "location">("name");

  // State lưu map id -> tenViTri
  const [locationMap, setLocationMap] = useState<Record<number, string>>({});
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<number>(0); // 0 = "Tất cả"

  // Lọc phòng theo loại tìm kiếm
  const filteredRooms = useMemo(() => {
    let result = rooms;

    // Lọc theo vị trí (dropdown)
    if (selectedLocation !== 0) {
      result = result.filter((room: Room) => room.maViTri === selectedLocation);
    }

    // Lọc theo từ khóa tìm kiếm
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      
      if (searchType === "name") {
        result = result.filter((room: Room) =>
          (room.tenPhong || "").toLowerCase().includes(keyword)
        );
      } else if (searchType === "price") {
        result = result.filter((room: Room) =>
          String(room.giaTien || "").includes(keyword)
        );
      } else if (searchType === "location") {
        result = result.filter((room: Room) => {
          const locationName = locationMap[room.maViTri] || "";
          return locationName.toLowerCase().includes(keyword);
        });
      }
    }

    return result;
  }, [rooms, selectedLocation, searchKeyword, searchType, locationMap]);

  useEffect(() => {
    // Lấy tất cả vị trí và tạo map id -> tenViTri
    locationService.getAll().then((res) => {
      let locationList: Location[] = [];
      if (Array.isArray(res)) {
        locationList = res;
      } else if (res && typeof res === 'object') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = res as any;
        if (Array.isArray(data.content)) {
          locationList = data.content;
        }
      }
      setLocations(locationList);
      const map: Record<number, string> = {};
      locationList.forEach((loc) => { map[loc.id] = loc.tenViTri; });
      setLocationMap(map);
    }).catch(() => {
      // Ignore errors - just won't show location names
    });
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Responsive */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent mb-2">{t("title")}</h1>
              <p className="text-sm text-gray-600">{t("totalCount").replace("{count}", String(totalRows))}</p>
            </div>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 bg-rose-500 text-white px-6 py-3 rounded-lg hover:bg-rose-600 transition-colors font-semibold"
            >
              <Plus size={20} />
              {t("createButton")}
            </button>
          </div>

          {/* Unified Search - giống UserManagement */}
          <div className="flex gap-3 mb-4">
            {/* Search Type Selector */}
            <div className="w-52">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as "name" | "price" | "location")}
                className="w-full h-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white font-medium"
              >
                <option value="name">{t("search.name")}</option>
                <option value="price">{t("search.price")}</option>
                <option value="location">{t("search.location")}</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="flex-1 relative">
              {searchType === "name" ? (
                <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-500" size={20} />
              ) : searchType === "price" ? (
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" size={20} />
              ) : (
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" size={20} />
              )}
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder={
                  searchType === "name"
                    ? t("search.placeholderName")
                    : searchType === "price"
                    ? t("search.placeholderPrice")
                    : t("search.placeholderLocation")
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* Search Button */}
            <button
              onClick={() => handleSearch()}
              className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
            >
              {tc("actions.search")}
            </button>

            {/* Result Badge */}
            {searchKeyword && (
              <div className="flex items-center gap-2 bg-rose-50 text-rose-700 px-4 py-2 rounded-lg whitespace-nowrap">
                <Home size={18} />
                <span className="font-medium">{t("resultsCount").replace("{count}", String(filteredRooms.length))}</span>
              </div>
            )}
          </div>

          {/* Filter by Location */}
          <div className="flex items-center gap-3">
            <MapPin size={20} className="text-rose-500" />
            <Select
              allowClear
              showSearch
              placeholder={t("filter.placeholder")}
              value={selectedLocation}
              onChange={(value) => setSelectedLocation(value || 0)}
              className="flex-1"
              size="large"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={[
                { value: 0, label: t("filter.allLocations") },
                ...locations.map((loc) => ({
                  value: loc.id,
                  label: `${loc.tenViTri}, ${loc.tinhThanh}`,
                }))
              ]}
            />
            
            {/* Tổng kết quả sau khi lọc */}
            {(selectedLocation !== 0 || searchKeyword) && (
              <div className="flex items-center gap-2 bg-rose-50 text-rose-700 px-4 py-2 rounded-lg whitespace-nowrap">
                <Home size={18} />
                <span className="font-medium">{t("filteredSummary").replace("{filtered}", String(filteredRooms.length)).replace("{total}", String(rooms.length))}</span>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Spin size="large" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{t("table.id")}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{t("table.image")}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{t("table.name")}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{t("table.location")}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{t("table.price")}</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">{t("table.actions")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredRooms && filteredRooms.length > 0 ? (
                      filteredRooms.map((room: Room) => (
                        <tr key={room.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-900">{room.id}</td>
                          <td className="px-6 py-4">
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                              {room.hinhAnh ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={room.hinhAnh} alt={room.tenPhong} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ImageIcon size={24} className="text-gray-400" />
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Home size={16} className="text-rose-500" />
                              <span className="text-sm font-medium text-gray-900">{room.tenPhong}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">{locationMap[room.maViTri] || room.maViTri}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <DollarSign size={16} className="text-green-500" />
                              <span className="text-sm text-gray-700">{room.giaTien}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => openEdit(room)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title={tc("actions.edit")}
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(room)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title={tc("actions.delete")}
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                          <div className="flex flex-col items-center gap-2">
                            <Home size={48} className="text-gray-300" />
                            <p className="text-lg font-medium">{t("noData.title")}</p>
                            <p className="text-sm">{t("noData.subtitle")}</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Component */}
              <AdminPagination
                currentPage={pageIndex}
                totalPages={totalPages}
                totalItems={totalRows}
                onPageChange={setPageIndex}
                previousLabel={tc("actions.previous") || "Trước"}
                nextLabel={tc("actions.next") || "Tiếp"}
                infoLabel={t("pagination")}
              />
            </>
          )}
        </div>

      {/* Modal Create/Edit - Form đẹp */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <Home size={20} className="text-rose-500" />
            <span>{modalMode === "create" ? t("modal.createTitle") : t("modal.editTitle")}</span>
          </div>
        }
        open={isModalOpen}
        onOk={submit}
        onCancel={() => setIsModalOpen(false)}
        okText={modalMode === "create" ? t("modal.createButton") : t("modal.updateButton")}
        cancelText={tc("actions.cancel")}
        width={800}
        confirmLoading={loading}
        okButtonProps={{ className: "bg-rose-500 hover:bg-rose-600" }}
      >
        <div className="py-4">
          {/* Tên phòng & Giá - 2 cột */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Home size={16} className="text-rose-500" />
                {t("form.name")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.tenPhong}
                onChange={(e) => setFormData({ ...formData, tenPhong: e.target.value })}
                placeholder={t("form.namePlaceholder")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <DollarSign size={16} className="text-green-500" />
                {t("form.price")} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.giaTien}
                  onChange={(e) => setFormData({ ...formData, giaTien: Number(e.target.value) })}
                  placeholder={t("form.pricePlaceholder")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">{t("perNight")}</span>
              </div>
            </div>
          </div>

          {/* Vị trí - Dropdown */}
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <MapPin size={16} className="text-red-500" />
              {t("form.location")} <span className="text-red-500">*</span>
            </label>
            <Select
              showSearch
              placeholder={t("form.locationPlaceholder")}
              value={formData.maViTri || undefined}
              onChange={(value) => setFormData({ ...formData, maViTri: value })}
              className="w-full"
              size="large"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={locations.map((loc) => ({
                value: loc.id,
                label: `${loc.tenViTri}, ${loc.tinhThanh}`,
              }))}
            />
          </div>

          {/* Thông tin phòng - Grid 4 cột */}
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Home size={16} className="text-blue-500" />
              {t("form.infoTitle")}
            </label>
            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                  <Users size={14} />
                  {t("form.guests")}
                </label>
                <input
                  type="number"
                  value={formData.khach}
                  onChange={(e) => setFormData({ ...formData, khach: Number(e.target.value) })}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-center"
                  min="1"
                />
              </div>
              <div>
                <label className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                  <Bed size={14} />
                  {t("form.bedrooms")}
                </label>
                <input
                  type="number"
                  value={formData.phongNgu}
                  onChange={(e) => setFormData({ ...formData, phongNgu: Number(e.target.value) })}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-center"
                  min="0"
                />
              </div>
              <div>
                <label className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                  <Bed size={14} />
                  {t("form.beds")}
                </label>
                <input
                  type="number"
                  value={formData.giuong}
                  onChange={(e) => setFormData({ ...formData, giuong: Number(e.target.value) })}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-center"
                  min="0"
                />
              </div>
              <div>
                <label className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                  <Bath size={14} />
                  {t("form.bathrooms")}
                </label>
                <input
                  type="number"
                  value={formData.phongTam}
                  onChange={(e) => setFormData({ ...formData, phongTam: Number(e.target.value) })}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-center"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Mô tả */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              {t("form.descriptionTitle")}
            </label>
            <textarea
              value={formData.moTa}
              onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
              placeholder={t("form.descriptionPlaceholder")}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Tiện ích - Checkbox grid */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Tiện ích
            </label>
            <div className="grid grid-cols-4 gap-3">
              {[
                'mayGiat',
                'banLa',
                'tivi',
                'dieuHoa',
                'wifi',
                'bep',
                'doXe',
                'hoBoi',
                'banUi',
              ].map((key) => (
                <label
                  key={key}
                  className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-all ${
                    formData[key as keyof typeof formData]
                      ? 'border-rose-500 bg-rose-50'
                      : 'border-gray-300 hover:border-rose-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={!!formData[key as keyof typeof formData]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })}
                    className="rounded text-rose-500 focus:ring-rose-500"
                  />
                  <span className="text-sm">{t(`amenities.${key}`)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Hình ảnh */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <ImageIcon size={16} className="text-purple-500" />
              {t("form.image")}
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-rose-500 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                {imagePreview ? (
                  <div className="relative w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                      <UploadIcon size={32} className="text-white" />
                      <span className="text-white ml-2">{t("upload.change")}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <UploadIcon size={48} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">{t("upload.click")}</p>
                    <p className="text-xs text-gray-400 mt-1">{t("upload.hint")}</p>
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
