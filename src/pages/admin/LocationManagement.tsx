
"use client";
import '@ant-design/v5-patch-for-react-19';
import useLocationManager from "@/hooks/Location/useLocationManager";
import { useTranslations } from "@/lib/i18n";
import type { Location } from "@/types/location.type";
import { Modal, Spin } from "antd";
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <MapPin size={28} className="text-rose-500" />
                <span>{t("title")}</span>
              </h1>
              <p className="text-gray-600">{t("totalCount").replace("{count}", String(totalRows))}</p>
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                    {t("pagination").replace("{page}", String(pageIndex)).replace("{total}", String(totalPages)).replace("{count}", String(totalRows))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPageIndex((prev: number) => Math.max(1, prev - 1))}
                      disabled={pageIndex === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {tc("actions.previous") || "Prev"}
                    </button>
                    <button
                      onClick={() => setPageIndex((prev: number) => Math.min(totalPages, prev + 1))}
                      disabled={pageIndex === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {tc("actions.next") || "Next"}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal Create/Edit */}
      <Modal
        title={modalMode === "create" ? t("modal.createTitle") : t("modal.editTitle")}
        open={isModalOpen}
        onOk={submit}
        onCancel={() => setIsModalOpen(false)}
        okText={modalMode === "create" ? t("modal.createButton") : t("modal.updateButton")}
        cancelText={tc("actions.cancel")}
        width={600}
        confirmLoading={loading}
      >
        <div className="space-y-4 py-4">
          {/* Tên vị trí */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("form.name")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.tenViTri}
              onChange={(e) => setFormData({ ...formData, tenViTri: e.target.value })}
              placeholder={t("form.namePlaceholder")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Tỉnh thành */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("form.province")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.tinhThanh}
              onChange={(e) => setFormData({ ...formData, tinhThanh: e.target.value })}
              placeholder={t("form.provincePlaceholder")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Quốc gia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("form.country")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.quocGia}
              onChange={(e) => setFormData({ ...formData, quocGia: e.target.value })}
              placeholder={t("form.countryPlaceholder")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Hình ảnh */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("form.image")}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            {imagePreview && (
              <div className="mt-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
