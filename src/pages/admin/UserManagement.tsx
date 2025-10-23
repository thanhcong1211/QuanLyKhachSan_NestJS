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
        <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
        <button onClick={openCreate} className="bg-blue-600 text-white px-6 py-3 rounded-lg mb-4">{t("createButton")}</button>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Spin size="large" />
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left">{t("table.id")}</th>
                  <th className="px-6 py-4 text-left">{t("table.name")}</th>
                  <th className="px-6 py-4 text-left">{t("table.email")}</th>
                  <th className="px-6 py-4 text-left">{t("table.phone")}</th>
                  <th className="px-6 py-4 text-left">{t("table.birthday")}</th>
                  <th className="px-6 py-4 text-left">{t("table.role")}</th>
                  <th className="px-6 py-4 text-center">{t("table.actions")}</th>
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
                        <button onClick={() => openEdit(user)} className="px-3 py-1 bg-yellow-400 text-white rounded mr-2">{tc("actions.edit")}</button>
                        <button onClick={() => handleDelete(user)} className="px-3 py-1 bg-red-500 text-white rounded">{tc("actions.delete")}</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">{t("noData")}</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

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
    </div>
  );
}
