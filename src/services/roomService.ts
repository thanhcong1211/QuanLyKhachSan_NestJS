import { roomApi } from "@/api/room.api";

export const roomService = {
  getAll: roomApi.getAll,
  getById: roomApi.getById,
  create: roomApi.create,
  update: roomApi.update,
  delete: roomApi.delete,
  uploadImage: async (roomId: number, file: File) => {
    const formData = new FormData();
    formData.append('formFile', file);
    formData.append('maPhong', roomId.toString());
    return await roomApi.uploadImage(formData);
  },
};
