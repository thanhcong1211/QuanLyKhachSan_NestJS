# Tài liệu: Cấu trúc & Logic - Quản lý Vị trí

Ngày tạo: 2025-10-22

Tài liệu này mô tả cấu trúc code và logic tái sử dụng cho phần Quản lý Vị trí (Location Management). Mục tiêu: giúp dev hiểu luồng dữ liệu, các hàm/contract chính, các điểm cần tái sử dụng (pattern) khi tạo các bộ quản lý tương tự (ví dụ: Room Management).

---

## Tóm tắt nhanh

Module Quản lý Vị trí gồm 3 lớp chính:
- API layer: `src/api/location.api.ts` — wrapper axios cho các endpoint (getAll, search, create, update, delete, uploadImage).
- Service layer: `src/services/locationService.ts` — gọi API, thực hiện logic bổ trợ (ví dụ: upload sau khi tạo), chuẩn hóa kết quả.
- Hook / UI: `src/hooks/Location/useLocationManager.ts` và trang quản trị `src/pages/admin/LocationManagement.tsx` (cùng 1 view mirror `src/app/(admin)/admin/locations/page.tsx`) — quản lý state, modal/form, pagination, tìm kiếm, thao tác CRUD và upload ảnh.

Từ pattern này có thể tái sử dụng để viết `useRoomManager` hoặc các manager khác.

---

## Các file quan trọng (path)

- `src/api/location.api.ts`
- `src/services/locationService.ts`
- `src/hooks/Location/useLocationManager.ts`
- `src/pages/admin/LocationManagement.tsx` (Pages router copy) — trang quản trị
- `src/app/(admin)/admin/locations/page.tsx` — App Router admin page (nếu đang dùng App Router, ưu tiên file này)
- `src/types/location.type.ts` — định nghĩa kiểu `Location`, `CreateLocationRequest`, `UpdateLocationRequest` (dùng làm contract)
- `src/helpers/storage.ts` — helper lưu token (được hook dùng để kiểm tra khi submit)

---

## Contract & Data shape (tóm tắt từ code)

Các trường thường dùng của `Location`:
- `id: number`
- `tenViTri: string` (tên vị trí)
- `tinhThanh: string` (tỉnh/TP)
- `quocGia: string` (quốc gia)
- `hinhAnh?: string` (URL ảnh)

Requests:
- `CreateLocationRequest` ~ `{ tenViTri, tinhThanh, quocGia, hinhAnh? }`
- `UpdateLocationRequest` ~ `{ tenViTri?, tinhThanh?, quocGia?, hinhAnh? }`

API responses: backend thường trả dạng envelope `{ content: ... }`, nhưng có nơi có thể trả trực tiếp; service layer hy sinhu để đọc `response?.content || response`.

---

## Luồng chính (fetch, search, pagination)

1. Khi hook mount (useEffect) gọi `fetchLocations()`:
   - `locationService.getAll()` được gọi (gọi `locationApi.getAll` qua `axiosClient`).
   - Hook nhận response, lấy `data.content` (nếu có) hoặc mặc định `[]`.
2. Tìm kiếm (`searchKeyword`):
   - Hook áp dụng filter client-side trên mảng `locations` nếu `searchKeyword` khác rỗng. (Pattern này đơn giản, phù hợp khi dữ liệu nhỏ; với dataset lớn cần backend pagination/search.)
3. Pagination:
   - Hook tính `start = (pageIndex-1) * pageSize` và trả `slice(start, start + pageSize)` để hiển thị trang hiện tại.

Ghi chú: pattern này thực hiện pagination & search trên client sau khi tải toàn bộ danh sách — tái sử dụng khi backend không cung cấp endpoint phân trang phù hợp.

---

## Logic Create / Update / Delete / Upload ảnh

- Create (modalMode === 'create'):
  1. Kiểm tra token: `storage.getToken()` — nếu không có token hiển thị Modal chuyển tới login.
  2. Gọi `locationService.createWithImage(formData, imageFile?)`:
     - service thực hiện `locationApi.create(data)` để tạo bản ghi.
     - Nếu backend trả về object created với `id` và `imageFile` tồn tại: service gọi `locationService.uploadImage(createdId, file)` (FormData với `formFile` và `maViTri`).
  3. Sau khi thành công: đóng modal, reload list (fetchLocations), show `message.success`.

- Update (modalMode === 'edit'):
  1. Kiểm tra `selectedLocation` tồn tại.
  2. Gọi `locationService.updateWithImage(selectedLocation.id, formData, imageFile?)`:
     - service gọi `locationApi.update(id, data)`.
     - Nếu có `imageFile`, upload ảnh sau khi update.
  3. Sau khi thành công: đóng modal, refetch list, show success.

- Delete:
  - Dùng `Modal.confirm` (Antd) để hỏi xác nhận, gọi `locationService.delete(id)`, refetch và show success/error.

- Upload ảnh:
  - `handleImageChange` đọc File từ input, tạo preview bằng `FileReader.readAsDataURL` (để hiển thị preview client-side).
  - Upload thực tế dùng `FormData` với key `formFile` và `maViTri`.

---

## State & UI pattern trong `useLocationManager`

Tham khảo các state chính (pattern để tái sử dụng):
- `locations: Location[]` — danh sách trang hiện tại (sau slice)
- `loading: boolean` — loading flag cho toàn bộ action
- `searchKeyword: string` — từ khóa tìm kiếm
- `pageIndex`, `pageSize`, `totalPages`, `totalRows` — pagination
- Modal & form:
  - `isModalOpen: boolean`
  - `modalMode: 'create' | 'edit'`
  - `selectedLocation: Location | null`
  - `formData` (object với trường form hợp lệ)
  - `imageFile: File | null` và `imagePreview: string` (base64)

Hàm/handler tái sử dụng:
- `fetchLocations()` — tải & áp dụng search/pagination
- `handleSearch(keyword?)` — set keyword, reset pageIndex, gọi fetch
- `openCreate()`, `openEdit(location)` — thiết lập modal và formData
- `handleDelete(location)` — confirm + delete
- `submit()` — create/update với logic kiểm tra token và upload ảnh
- `handleImageChange(e)` — set imageFile + preview

Khi tái sử dụng cho `useRoomManager`:
- Giữ nguyên pattern modal/form/imagePreview/upload nhưng thay `formData` thành fields của `CreateRoomRequest`.
- Reuse `fetch -> client filter -> slice` nếu bộ dữ liệu nhỏ; nếu lớn, chuyển sang `locationApi.search` / backend pagination.

---

## Các rào cản & edge cases cần chú ý

- Backend trả response không đồng nhất (envelope `{ content }` vs raw): luôn kiểm tra `response?.content || response`.
- Nếu response của `create` không trả `id` (created object), flow upload sẽ không có `maViTri` để gửi — service hiện tại giả định backend trả `content.id`. Nếu không, cần thay đổi:
  - upload tách riêng (admin upload chọn vị trí đã có id) hoặc backend trả id sau create.
- Upload ảnh lớn: cần kiểm tra kích thước file và show progress (hiện không có progress handler).
- Race conditions: nếu user bấm nhiều lần submit, cần disable nút khi đang `loading`.
- SSR: các hàm dùng `localStorage` (storage.getToken) phải guard `typeof window !== 'undefined'` (đã có trong helper storage).
- Nếu dataset lớn: hiện tại hook tải toàn bộ danh sách — chuyển sang `locationApi.search` (endpoint `phan-trang-tim-kiem`) để pagination/search phía server.

---

## Kiểm thử / Verify nhanh

1. Môi trường dev: chạy app bằng `npm run dev` trong thư mục `airbnb-clone`.
2. Mở trang admin Vị trí (`/admin/locations` hoặc `/admin/locations` trên App Router) — kiểm tra bảng hiển thị.
3. Test create:
   - Click "Thêm vị trí mới" -> nhập tên/tỉnh/quốc gia -> chọn ảnh -> nhấn tạo.
   - Nếu chưa login, Modal confirm sẽ đề nghị chuyển tới login.
   - Sau tạo, bảng refresh và hiện thông báo thành công.
4. Test update: mở edit, sửa dữ liệu/ảnh -> xác nhận -> bảng refresh
5. Test delete: nhấn xóa -> confirm -> bảng refresh
6. Test tìm kiếm & phân trang: nhập từ khóa, nhấn tìm kiếm; thử next/prev trang.

---

## Gợi ý tái sử dụng (checklist khi copy pattern sang module khác)

- Tái dùng state pattern: `isModalOpen, modalMode, selectedItem, formData, imageFile, imagePreview`.
- Tái dùng handlers: `openCreate/openEdit/handleDelete/handleImageChange/submit/fetchList`.
- Giữ nguyên kiểm tra token `storage.getToken()` nếu thao tác yêu cầu auth.
- Sử dụng `service.createWithImage` / `updateWithImage` pattern: thực hiện create/update trước, upload ảnh sau khi có id.
- Nếu backend hỗ trợ pagination/search: ưu tiên 구현 server-side để tránh tải toàn bộ dữ liệu.

---

Nếu bạn muốn, tôi có thể:
- Sinh phiên bản Mermaid diagram mô tả flow (API ↔ Service ↔ Hook ↔ Component).
- Tạo template `useXManager.ts` (generic) để nhanh chóng scaffold các manager khác.

