"use client";
import '@ant-design/v5-patch-for-react-19';
import useRoomManager from "@/hooks/Room/useRoomManager";
import type { Room } from "@/types/room.type";
import { Modal, Spin } from "antd";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Image as ImageIcon,
  Home,
  DollarSign,
} from "lucide-react";

export default function RoomManagement() {
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Phòng</h1>
              <p className="text-gray-600">Tổng số: {totalRows} phòng</p>
            </div>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 bg-rose-500 text-white px-6 py-3 rounded-lg hover:bg-rose-600 transition-colors font-semibold"
            >
              <Plus size={20} />
              Thêm phòng mới
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
                placeholder="Tìm kiếm theo tên phòng, id vị trí, giá..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <button
              onClick={() => handleSearch()}
              className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
            >
              Tìm kiếm
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
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Hình ảnh</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tên phòng</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Vị trí</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Giá</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {rooms && rooms.length > 0 ? (
                      rooms.map((room: Room) => (
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
                          <td className="px-6 py-4 text-sm text-gray-700">{room.maViTri}</td>
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
                                title="Chỉnh sửa"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(room)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Xóa"
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
                            <p className="text-lg font-medium">Không có dữ liệu</p>
                            <p className="text-sm">Vui lòng thêm phòng mới hoặc thử tìm kiếm khác</p>
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
                    Trang {pageIndex} / {totalPages} (Tổng {totalRows} phòng)
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPageIndex((prev: number) => Math.max(1, prev - 1))}
                      disabled={pageIndex === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Trước
                    </button>
                    <button
                      onClick={() => setPageIndex((prev: number) => Math.min(totalPages, prev + 1))}
                      disabled={pageIndex === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Sau
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
        title={modalMode === "create" ? "Thêm phòng mới" : "Chỉnh sửa phòng"}
        open={isModalOpen}
        onOk={submit}
        onCancel={() => setIsModalOpen(false)}
        okText={modalMode === "create" ? "Tạo mới" : "Cập nhật"}
        cancelText="Hủy"
        width={700}
        confirmLoading={loading}
      >
        <div className="space-y-4 py-4">
          {/* Tên phòng */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tên phòng <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.tenPhong}
              onChange={(e) => setFormData({ ...formData, tenPhong: e.target.value })}
              placeholder="VD: Phòng Studio gần trung tâm"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Vị trí */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mã vị trí <span className="text-red-500">*</span></label>
            <input
              type="number"
              value={formData.maViTri}
              onChange={(e) => setFormData({ ...formData, maViTri: Number(e.target.value) })}
              placeholder="ID vị trí (ví dụ: 1)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Giá */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Giá tiền</label>
            <input
              type="number"
              value={formData.giaTien}
              onChange={(e) => setFormData({ ...formData, giaTien: Number(e.target.value) })}
              placeholder="Giá theo đêm"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Hình ảnh */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500" />
            {imagePreview && (
              <div className="mt-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
