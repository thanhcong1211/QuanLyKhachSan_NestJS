# Quản Lý Khách Sạn (Airbnb Clone) — FullStack

Hệ thống quản lý đặt phòng khách sạn trực tuyến, mô phỏng theo Airbnb: tìm kiếm/lọc phòng, đặt phòng, quản lý người dùng, bình luận đánh giá, dashboard thống kê cho admin, hỗ trợ đa ngôn ngữ (Việt/Anh).

Repo là **monorepo** gồm 2 phần độc lập:

```
.
├── frontend/   # Next.js 16 + React 18 + TypeScript
└── backend/    # NestJS + TypeORM + MySQL
```

## Công nghệ chính

| | |
|---|---|
| **Frontend** | Next.js (App Router, Turbopack), React 18, TypeScript, Ant Design, Tailwind CSS, Redux Toolkit, TanStack Query, next-intl (i18n) |
| **Backend** | NestJS, TypeORM, MySQL, JWT Auth, Multer (upload ảnh) |

## Chạy nhanh

### 1. Backend

```bash
cd backend
docker compose up -d       # khởi động MySQL
npm install
npm run seed                # tạo dữ liệu mẫu (user admin, vị trí, phòng, booking...)
npm run start:dev           # http://localhost:3001/api
```

Tài khoản admin mẫu sau khi seed: `admin@airbnb-clone.local` / `Admin@123`.

Chi tiết cấu trúc backend, các resource (auth, users, locations, rooms, bookings, comments...): xem [backend/README.md](backend/README.md).

### 2. Frontend

```bash
cd frontend
npm install
npm run dev                 # http://localhost:3000
```

Đảm bảo `frontend/.env.local` trỏ đúng backend:

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Tính năng chính

- Quản lý phòng cho thuê (CRUD, upload ảnh, phân loại theo vị trí)
- Tìm kiếm & lọc phòng theo giá, vị trí, số khách, tiện ích
- Đặt phòng theo ngày check-in/check-out, quản lý booking (user + admin)
- Xác thực JWT, quản lý hồ sơ, lịch sử đặt phòng cá nhân
- Bình luận & đánh giá sao cho từng phòng
- Dashboard admin: thống kê doanh thu, biểu đồ booking
- Đa ngôn ngữ: Tiếng Việt / English
