
"use client";
import '@ant-design/v5-patch-for-react-19';
import useLocationManager from "@/hooks/Location/useLocationManager";
import { useTranslations } from "@/lib/i18n";
import type { Location } from "@/types/location.type";
import { Modal, Spin } from "antd";
import AdminPagination from "@/components/ui/admin-pagination";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Image as ImageIcon,
  MapPin,
  Globe
} from "lucide-react";

export default function LocationManagement() {
  const t = useTranslations("locationManagement");
  const tc = useTranslations("common");
  const {
    locations,
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
  } = useLocationManager();

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Responsive */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent mb-2 flex items-center gap-3">
                <MapPin size={28} className="text-rose-500" />
                <span>{t("title")}</span>
              </h1>
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

          {/* Search */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder={t("placeholders.search")}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <button
              onClick={() => handleSearch()}
              className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
            >
              {tc("actions.search")}
            </button>
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
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{t("table.province")}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{t("table.country")}</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">{t("table.actions")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {locations && locations.length > 0 ? (
                      locations.map((location: Location) => (
                        <tr key={location.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-900">{location.id}</td>
                          <td className="px-6 py-4">
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                              {location.hinhAnh ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={location.hinhAnh}
                                  alt={location.tenViTri}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ImageIcon size={24} className="text-gray-400" />
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <MapPin size={16} className="text-rose-500" />
                              <span className="text-sm font-medium text-gray-900">{location.tenViTri}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">{location.tinhThanh}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Globe size={16} className="text-blue-500" />
                              <span className="text-sm text-gray-700">{location.quocGia}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => openEdit(location)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title={tc("actions.edit")}
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(location)}
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
                            <MapPin size={48} className="text-gray-300" />
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

      {/* Modal Create/Edit - Enhanced */}
      <Modal
        title={
          <div className="flex items-center gap-3 pb-4 border-b">
            <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
              <MapPin size={20} className="text-rose-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {modalMode === "create" ? t("modal.createTitle") : t("modal.editTitle")}
              </h3>
              <p className="text-sm text-gray-500">
                {modalMode === "create" 
                  ? "Thêm vị trí mới vào hệ thống" 
                  : "Cập nhật thông tin vị trí"}
              </p>
            </div>
          </div>
        }
        open={isModalOpen}
        onOk={submit}
        onCancel={() => setIsModalOpen(false)}
        okText={modalMode === "create" ? t("modal.createButton") : t("modal.updateButton")}
        cancelText={tc("actions.cancel")}
        width={700}
        confirmLoading={loading}
        okButtonProps={{
          className: "bg-rose-500 hover:bg-rose-600",
        }}
      >
        <div className="space-y-5 py-6">
          {/* Tên vị trí */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <MapPin size={16} className="text-rose-500" />
              {t("form.name")} 
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.tenViTri}
              onChange={(e) => setFormData({ ...formData, tenViTri: e.target.value })}
              placeholder="VD: Hồ Hoàn Kiếm, Bãi biển Mỹ Khê..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
            />
            <p className="mt-1 text-xs text-gray-500">Tên địa điểm cụ thể</p>
          </div>

          {/* Row: Tỉnh thành & Quốc gia */}
          <div className="grid grid-cols-2 gap-4">
            {/* Tỉnh thành */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <MapPin size={16} className="text-blue-500" />
                {t("form.province")} 
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.tinhThanh}
                onChange={(e) => setFormData({ ...formData, tinhThanh: e.target.value })}
                placeholder="VD: Hà Nội, TP.HCM..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Quốc gia */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Globe size={16} className="text-green-500" />
                {t("form.country")} 
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.quocGia}
                onChange={(e) => setFormData({ ...formData, quocGia: e.target.value })}
                placeholder="VD: Việt Nam, Thailand..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Hình ảnh */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <ImageIcon size={16} className="text-purple-500" />
              {t("form.image")}
            </label>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-rose-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                id="location-image-upload"
                className="hidden"
              />
              
              {imagePreview ? (
                <div className="relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <label
                      htmlFor="location-image-upload"
                      className="bg-white text-gray-900 px-6 py-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors font-medium"
                    >
                      Đổi ảnh khác
                    </label>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="location-image-upload"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <ImageIcon size={32} className="text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Click để chọn ảnh vị trí
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF tối đa 10MB
                  </p>
                </label>
              )}
            </div>
          </div>

          {/* Preview thông tin */}
          <div className="bg-gradient-to-r from-rose-50 to-blue-50 p-4 rounded-lg border border-rose-200">
            <p className="text-xs font-semibold text-gray-600 mb-2">PREVIEW</p>
            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-rose-600" />
              <div>
                <p className="font-bold text-gray-900">
                  {formData.tenViTri || "Tên vị trí"}
                </p>
                <p className="text-sm text-gray-600">
                  {formData.tinhThanh || "Tỉnh/TP"}, {formData.quocGia || "Quốc gia"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
