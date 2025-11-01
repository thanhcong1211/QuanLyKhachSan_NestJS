"use client";

import useUserManager from "@/hooks/User/useUserManager";
import { Spin, Modal } from "antd";
import { useTranslations } from "@/lib/i18n";

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("title")}</h1>
              <p className="text-gray-600">{t("totalCount").replace("{count}", String(totalRows))}</p>
            </div>
            <button onClick={openCreate} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">{t("createButton")}</button>
          </div>

          {/* Search */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder={t("placeholders.search")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{t("table.name")}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{t("table.email")}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{t("table.phone")}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{t("table.birthday")}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{t("table.role")}</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">{t("table.actions")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.length > 0 ? (
                      users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-900">{user.id}</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{user.phone}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{user.birthday}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{user.role}</td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button onClick={() => openEdit(user)} className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition-colors">{tc("actions.edit")}</button>
                              <button onClick={() => handleDelete(user)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">{tc("actions.delete")}</button>
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    {t("pagination").replace("{page}", String(pageIndex)).replace("{total}", String(totalPages)).replace("{count}", String(totalRows))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPageIndex(Math.max(1, pageIndex - 1))}
                      disabled={pageIndex === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {tc("actions.previous") || "Previous"}
                    </button>
                    <button
                      onClick={() => setPageIndex(Math.min(totalPages, pageIndex + 1))}
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