"use client";
import '@ant-design/v5-patch-for-react-19';

import useUserManager from "@/hooks/User/useUserManager";
import { Spin, Modal } from "antd";
import { useTranslations } from "@/lib/i18n";
import { useState, useMemo } from "react";
import { Search, Mail, UserCircle, Edit, Trash2, Phone, Calendar, Shield } from "lucide-react";
import AdminPagination from "@/components/ui/admin-pagination";

export default function UserManagement() {
  const t = useTranslations("userManagement");
  const tc = useTranslations("common");

  const {
    users,
    loading,
    searchKeyword,
    pageIndex,
    pageSize,
    totalPages,
    totalRows,
    isModalOpen,
    modalMode,
    formData,
    setFormData,
    setIsModalOpen,
    setPageIndex,
    setSearchKeyword,
    handleSearch,
  openCreate,
  openEdit,
  handleDelete,
  submit,
  } = useUserManager();

  // State cho loại tìm kiếm
  const [searchType, setSearchType] = useState<"name" | "email" | "role">("name");

  // Lọc users theo loại tìm kiếm
  const filteredUsers = useMemo(() => {
    if (!searchKeyword.trim()) {
      return users;
    }
    if (searchType === "email") {
      return users.filter((user) =>
        user.email.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }
    if (searchType === "role") {
      return users.filter((user) =>
        (user.role || "").toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }
    // Mặc định tìm theo tên (hoặc có thể tìm theo nhiều field)
    return users.filter((user) =>
      user.name.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }, [users, searchKeyword, searchType]);

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
              className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all font-semibold shadow-lg shadow-rose-500/30"
            >
              {t("createButton")}
            </button>
          </div>

          {/* Unified Search */}
          <div className="flex gap-3">
            {/* Search Type Selector */}
            <div className="w-48">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as "name" | "email" | "role")}
                className="w-full h-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
              >
                <option value="name">{t("search.name")}</option>
                <option value="email">{t("search.email")}</option>
                <option value="role">{t("search.role")}</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="flex-1 relative">
              {searchType === "name" ? (
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              ) : searchType === "email" ? (
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" size={20} />
              ) : (
                <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" size={20} />
              )}
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder={
                  searchType === "name" 
                    ? t("search.placeholderName")
                    : searchType === "email"
                    ? t("search.placeholderEmail")
                    : t("search.placeholderRole")
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <UserCircle size={18} />
                <span className="font-medium">{t("resultsCount", { count: filteredUsers.length })}</span>
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
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{t("table.name")}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{t("table.email")}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{t("table.phone")}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{t("table.birthday")}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{t("table.role")}</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">{t("table.actions")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-900">{user.id}</td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex items-center gap-2">
                              <UserCircle size={16} className="text-rose-500" />
                              {searchKeyword && searchType === "name" && user.name.toLowerCase().includes(searchKeyword.toLowerCase()) ? (
                                <span className="bg-yellow-200 px-1 rounded font-medium text-gray-900">
                                  {user.name}
                                </span>
                              ) : (
                                <span className="font-medium text-gray-900">{user.name}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Mail size={16} className="text-blue-500" />
                              {searchKeyword && searchType === "email" && user.email.toLowerCase().includes(searchKeyword.toLowerCase()) ? (
                                <span className="bg-yellow-200 px-1 rounded font-medium text-gray-900">
                                  {user.email}
                                </span>
                              ) : (
                                <span className="text-gray-700">{user.email}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Phone size={16} className="text-green-500" />
                              <span className="text-gray-700">{user.phone}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar size={16} className="text-purple-500" />
                              <span className="text-gray-700">{user.birthday}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Shield size={16} className="text-orange-500" />
                              {searchKeyword && searchType === "role" && (user.role || "").toLowerCase().includes(searchKeyword.toLowerCase()) ? (
                                <span className="bg-yellow-200 px-2 py-1 rounded font-medium text-gray-900">
                                  {user.role}
                                </span>
                              ) : (
                                <span className="text-gray-700">{user.role}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => openEdit(user)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title={tc("actions.edit")}
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(user)}
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
                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">{t("noData.title")}</td>
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

      {/* Modal Create/Edit */}
      <Modal title={modalMode === 'create' ? t("modal.createTitle") : t("modal.editTitle")} open={isModalOpen} onOk={submit} onCancel={() => setIsModalOpen(false)} okText={modalMode === 'create' ? t("modal.createButton") : t("modal.updateButton")} cancelText={tc("actions.cancel")} confirmLoading={loading}>
        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t("form.name")}</label>
            <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border rounded" placeholder={t("form.namePlaceholder")} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t("form.email")}</label>
            <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 border rounded" placeholder={t("form.emailPlaceholder")} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t("form.phone")}</label>
            <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-2 border rounded" placeholder={t("form.phonePlaceholder")} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t("form.birthday")}</label>
            <input type="date" value={formData.birthday} onChange={e => setFormData({ ...formData, birthday: e.target.value })} className="w-full px-4 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t("form.role")}</label>
            <input type="text" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full px-4 py-2 border rounded" placeholder={t("form.rolePlaceholder")} />
          </div>
        </div>
      </Modal>
    </div>
  );
}