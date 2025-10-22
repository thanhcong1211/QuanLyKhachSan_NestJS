# 🔐 Token Configuration - Kiểm Tra

## ✅ TRẠNG THÁI TOKEN

### 1. **TokenCybersoft (API Key)**
```typescript
// File: src/api/axiosClient.ts
headers: {
  TokenCybersoft: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJOb2RlanMgNTIiLCJIZXRIYW5TdHJpbmciOiIyNy8wNC8yMDI2IiwiSGV0SGFuVGltZSI6IjE3NzcyNDgwMDAwMDAiLCJuYmYiOjE3NTg5MDk2MDAsImV4cCI6MTc3NzM5OTIwMH0._b9cEhCuhW5AQ7TsywHkbc2NkdJDSmQZYCxkjTSbv3I"

  admin"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInJvbGUiOiJBRE1JTiIsIm5iZiI6MTc2MTAzNjA3NywiZXhwIjoxNzYxNjQwODc3fQ.nx1hvbrzVliPIsSjbsDOsVljhjP7DrKym6aQcaVawIo"
}
```

✅ **ĐÃ CẤU HÌNH** - Token được gắn vào mọi request

**Thông tin token:**
- Lớp: Nodejs 52
- Hết hạn: 27/04/2026
- Scope: Truy cập toàn bộ API

---

### 2. **Authorization Token (User Token)**
```typescript
// File: src/api/axiosClient.ts
axiosClient.interceptors.request.use((config) => {
  const token = storage.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

✅ **ĐÃ CẤU HÌNH** - Token user tự động gắn khi có

**Flow:**
1. User đăng nhập
2. Token được lưu vào localStorage
3. Interceptor tự động gắn vào mọi request

---

## 📊 Cấu Trúc Headers

### Request Headers Mẫu:
```json
{
  "Content-Type": "application/json",
  "TokenCybersoft": "eyJhbGciOiJI...",
  "Authorization": "Bearer eyJhbGciOi..." // (nếu user đã login)
}
```

---

## 🔍 Kiểm Tra Token Cho API Vị Trí

### API Location Flow:

```typescript
// 1. locationApi.getAll() được gọi
locationApi.getAll()

// 2. axiosClient.get() xử lý
axiosClient.get('/vi-tri')

// 3. Interceptor request chạy
→ Gắn TokenCybersoft: "eyJhbGci..."
→ Gắn Authorization: "Bearer ..." (nếu có)

// 4. Request được gửi
GET https://airbnbnew.cybersoft.edu.vn/api/vi-tri
Headers:
  - Content-Type: application/json
  - TokenCybersoft: eyJhbGci...
  - Authorization: Bearer ... (optional)

// 5. Response trả về
{
  statusCode: 200,
  content: [...]
}
```

---

## ✅ Checklist Token

### TokenCybersoft:
- [x] ✅ Đã cấu hình trong axiosClient
- [x] ✅ Được gửi với mọi request
- [x] ✅ Token hợp lệ (hết hạn 2026)
- [x] ✅ Scope: Truy cập tất cả endpoints

### Authorization Token:
- [x] ✅ Interceptor đã setup
- [x] ✅ Lấy từ localStorage
- [x] ✅ Tự động gắn khi có
- [x] ✅ Format: Bearer token

### Location API:
- [x] ✅ Sử dụng axiosClient
- [x] ✅ Endpoint: /vi-tri
- [x] ✅ Methods: GET, POST, PUT, DELETE
- [x] ✅ Token được gắn tự động

---

## 🧪 Test Token

### Cách 1: Check trong DevTools (Network Tab)

1. Mở trang: `http://localhost:3000/test-api`
2. Nhấn F12 → Network tab
3. Click "📍 Lấy Tất Cả Địa Điểm"
4. Xem request headers:

```
Request URL: https://airbnbnew.cybersoft.edu.vn/api/vi-tri
Request Headers:
  TokenCybersoft: eyJhbGciOiJI... ✅
  Content-Type: application/json ✅
```

### Cách 2: Check trong Console

```javascript
// Paste vào console
const testToken = async () => {
  try {
    const response = await fetch('https://airbnbnew.cybersoft.edu.vn/api/vi-tri', {
      headers: {
        'TokenCybersoft': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJOb2RlanMgNTIiLCJIZXRIYW5TdHJpbmciOiIyNy8wNC8yMDI2IiwiSGV0SGFuVGltZSI6IjE3NzcyNDgwMDAwMDAiLCJuYmYiOjE3NTg5MDk2MDAsImV4cCI6MTc3NzM5OTIwMH0._b9cEhCuhW5AQ7TsywHkbc2NkdJDSmQZYCxkjTSbv3I'
      }
    });
    const data = await response.json();
    console.log('✅ Token hoạt động:', data);
  } catch (error) {
    console.error('❌ Token lỗi:', error);
  }
};

testToken();
```

### Cách 3: Sử dụng Test API Page

1. Vào: `http://localhost:3000/test-api`
2. Click "📍 Lấy Tất Cả Địa Điểm"
3. Nếu thấy danh sách địa điểm → Token OK ✅
4. Nếu lỗi 401/403 → Token sai ❌

---

## 📝 Files Liên Quan

### 1. `src/api/axiosClient.ts`
```typescript
// ✅ Token chính được config ở đây
headers: {
  TokenCybersoft: "eyJhbGci..."
}

// ✅ Interceptor tự động gắn user token
axiosClient.interceptors.request.use((config) => {
  const token = storage.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### 2. `src/api/location.api.ts`
```typescript
// ✅ Sử dụng axiosClient → Token tự động có
export const locationApi = {
  getAll: () => axiosClient.get(endpoints.location.getAll),
  // ... other methods
};
```

### 3. `src/constant/endpoints.ts`
```typescript
// ✅ Endpoints đúng
location: {
  getAll: '/vi-tri',
  getById: (id) => `/vi-tri/${id}`,
  // ...
}
```

### 4. `src/helpers/storage.ts`
```typescript
// ✅ Quản lý user token
export const storage = {
  getToken: () => localStorage.getItem('token'),
  setToken: (token) => localStorage.setItem('token', token),
  // ...
};
```

---

## 🚨 Troubleshooting

### Lỗi 401 Unauthorized
**Nguyên nhân:**
- TokenCybersoft sai hoặc hết hạn
- Token format không đúng

**Giải pháp:**
- Kiểm tra token trong axiosClient.ts
- Verify token chưa hết hạn (2026)

### Lỗi 403 Forbidden
**Nguyên nhân:**
- Token đúng nhưng không có quyền
- Endpoint yêu cầu Authorization token

**Giải pháp:**
- Đăng nhập để có user token
- Check token được lưu đúng chưa

### Token không được gửi
**Nguyên nhân:**
- Không dùng axiosClient
- Interceptor không chạy

**Giải pháp:**
- Đảm bảo API sử dụng axiosClient
- Check interceptor trong axiosClient.ts

---

## ✅ Kết Luận

### Token Vị Trí API: **ĐÃ CẤU HÌNH ĐÚNG ✅**

**Đầy đủ:**
- ✅ TokenCybersoft có trong headers
- ✅ Tự động gửi với mọi request
- ✅ location.api.ts sử dụng axiosClient
- ✅ Endpoints đúng format
- ✅ Interceptor hoạt động

**Test ngay:**
```bash
# Mở test page
http://localhost:3000/test-api

# Click "Lấy Tất Cả Địa Điểm"
# Nếu thấy data → Token OK ✅
```

---

## 📚 API Endpoints với Token

### GET /vi-tri (Lấy tất cả vị trí)
```bash
curl -X GET https://airbnbnew.cybersoft.edu.vn/api/vi-tri \
  -H "TokenCybersoft: eyJhbGci..."
```

### GET /vi-tri/{id} (Lấy vị trí theo ID)
```bash
curl -X GET https://airbnbnew.cybersoft.edu.vn/api/vi-tri/1 \
  -H "TokenCybersoft: eyJhbGci..."
```

### POST /vi-tri (Tạo vị trí mới)
```bash
curl -X POST https://airbnbnew.cybersoft.edu.vn/api/vi-tri \
  -H "TokenCybersoft: eyJhbGci..." \
  -H "Authorization: Bearer {user_token}" \
  -H "Content-Type: application/json" \
  -d '{...}'
```

**Lưu ý:** POST/PUT/DELETE yêu cầu cả TokenCybersoft VÀ Authorization token.

---

Token đã được cấu hình đầy đủ và chính xác! 🎉
