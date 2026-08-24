# airbnb-clone-backend

Backend riêng (NestJS + TypeORM + MySQL) cho project `airbnb-clone`, thay thế
cho API dùng chung của lớp học (`airbnbnew.cybersoft.edu.vn`). Giữ nguyên
toàn bộ đường dẫn, tên field và format response mà frontend đang gọi, nên
**không cần sửa code frontend** — chỉ đổi biến môi trường.

## Chạy lần đầu

```bash
# 1. Khởi động MySQL bằng Docker
docker compose up -d

# 2. Cài dependency
npm install

# 3. Seed dữ liệu mẫu (user admin, vị trí, phòng, booking, bình luận)
npm run seed

# 4. Chạy backend (watch mode)
npm run start:dev
```

Backend chạy tại `http://localhost:3001/api`.

## Tài khoản admin mẫu (sau khi seed)

- Email: `admin@airbnb-clone.local`
- Mật khẩu: `Admin@123`

## Trỏ frontend sang backend này

Trong `airbnb-clone/.env.local`, đổi:

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

rồi chạy lại `npm run dev` trong `airbnb-clone/`. Không cần đổi gì khác —
`axiosClient` của frontend đã đọc base URL từ biến môi trường này.

## Cấu trúc

- `auth/` — đăng nhập/đăng ký, JWT ký qua header `token` (không phải `Authorization: Bearer`).
- `users/`, `locations/` (`vi-tri`), `rooms/` (`phong-thue`), `bookings/` (`dat-phong`), `comments/` (`binh-luan`) — CRUD + phân trang + upload ảnh tương ứng từng resource.
- `common/` — interceptor bọc response theo format `{statusCode, message, content, dateTime}`, exception filter, auth guard.
- `seed/seed.ts` — script tạo dữ liệu mẫu, chạy lại an toàn (không tạo trùng).

## Lưu ý

- `synchronize: true` trong TypeORM (phù hợp giai đoạn dev/đồ án, tự tạo bảng theo entity — không dùng cho production thật).
- Ảnh upload lưu tại `uploads/` và được serve tĩnh tại `/uploads/...`.
