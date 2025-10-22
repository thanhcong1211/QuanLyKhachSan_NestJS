"use client";

import useUserManager from "@/hooks/User/useUserManager";
import { Spin, Modal } from "antd";

export default function UserManagement() {
  const {
    users,
    loading,
    isModalOpen,
    modalMode,
    formData,
    setFormData,
    setIsModalOpen,
  openCreate,
  openEdit,
  handleDelete,
  submit,
  } = useUserManager();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-6">Quản lý Người dùng</h1>
        <button onClick={openCreate} className="bg-blue-600 text-white px-6 py-3 rounded-lg mb-4">Thêm người dùng</button>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Spin size="large" />
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left">ID</th>
                  <th className="px-6 py-4 text-left">Tên</th>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">SĐT</th>
                  <th className="px-6 py-4 text-left">Ngày sinh</th>
                  <th className="px-6 py-4 text-left">Role</th>
                  <th className="px-6 py-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4">{user.id}</td>
                      <td className="px-6 py-4">{user.name}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">{user.phone}</td>
                      <td className="px-6 py-4">{user.birthday}</td>
                      <td className="px-6 py-4">{user.role}</td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => openEdit(user)} className="px-3 py-1 bg-yellow-400 text-white rounded mr-2">Sửa</button>
                        <button onClick={() => handleDelete(user)} className="px-3 py-1 bg-red-500 text-white rounded">Xóa</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">Không có dữ liệu</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <Modal title={modalMode === 'create' ? 'Thêm người dùng' : 'Chỉnh sửa người dùng'} open={isModalOpen} onOk={submit} onCancel={() => setIsModalOpen(false)} okText={modalMode === 'create' ? 'Tạo mới' : 'Cập nhật'} cancelText="Hủy" confirmLoading={loading}>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tên</label>
              <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Số điện thoại</label>
              <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Ngày sinh</label>
              <input type="date" value={formData.birthday} onChange={e => setFormData({ ...formData, birthday: e.target.value })} className="w-full px-4 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <input type="text" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full px-4 py-2 border rounded" />
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
