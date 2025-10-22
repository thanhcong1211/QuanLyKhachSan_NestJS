# 🔍 HƯỚNG DẪN TEST API VỊ TRÍ

## ✅ ĐÃ CÀI ĐẶT

1. **Location Dropdown** - Hiển thị danh sách địa điểm từ API `/vi-tri`
2. **Console Logs** - Debug logging trong console
3. **Debug Panel** - Hiển thị thông tin location khi chọn

---

## 🧪 CÁCH TEST

### Bước 1: Mở trang web
```
http://localhost:3000
```

### Bước 2: Mở Browser Console
- Press `F12` hoặc `Ctrl + Shift + I`
- Chọn tab "Console"

### Bước 3: Nhập địa điểm vào search box
1. Click vào ô "Địa điểm"
**Dropdown sẽ hiển thị danh sách địa điểm từ API**
2. Gõ "Hà Nội" hoặc tên thành phố
3. **Dropdown sẽ hiển thị danh sách địa điểm từ API**
4. Chọn một địa điểm từ dropdown

### Bước 4: Quan sát
- **Console logs** sẽ hiển thị:
  ```
  🔍 DEBUG HomePage - Locations: {
    locationsData: {...},
    searchQuery: "Hà Nội",
    selectedLocationId: 5
  }
  � Selected location: { id: 5, tenViTri: "Hà Nội", ... }
  ```

- **Debug Panel** (góc dưới phải) sẽ hiển thị:
  - Location ID
  - Search Query  
  - Total Locations (tổng số địa điểm từ API)
  - Filtered Locations (số địa điểm sau khi filter)

---

## 🔎 KIỂM TRA NETWORK

### Trong DevTools:
1. Chọn tab "Network"
2. Reload trang (Ctrl + R)
3. Tìm request có URL:
   ```
   GET /api/vi-tri
   ```
4. Click vào request để xem:
   - Status: 200 OK
   - Response: Danh sách tất cả vị trí
   - Timing

---

## 📊 DỮ LIỆU API VỊ TRÍ

### API Endpoint:
```
GET https://airbnbnew.cybersoft.edu.vn/api/vi-tri
```

### Response Format:
```json
{
  "statusCode": 200,
  "content": [
    {
      "id": 1,
      "tenViTri": "Hồ Chí Minh",
      "tinhThanh": "Việt Nam",
      "quocGia": "Việt Nam",
      "hinhAnh": "https://..."
    },
    {
      "id": 5,
      "tenViTri": "Hà Nội",
      "tinhThanh": "Việt Nam",
      "quocGia": "Việt Nam",
      "hinhAnh": "https://..."
    }
  ],
  "dateTime": "2025-10-21T..."
}
```

---

## 🐛 TROUBLESHOOTING

### Vấn đề 1: Dropdown không hiển thị
**Kiểm tra:**
- Console có log "🔍 DEBUG HomePage - Locations" không?
- locationsData có dữ liệu không?
- Network tab có request `/vi-tri` không?

**Nguyên nhân có thể:**
- API chưa được gọi khi load trang
- API trả về lỗi
- locationsList = [] (rỗng)

### Vấn đề 2: Dropdown rỗng khi search
**Kiểm tra:**
```javascript
// Trong console
console.log('filteredLocations:', filteredLocations);
```

**Nguyên nhân có thể:**
- Search query không match với tên địa điểm
- Filter logic có vấn đề
- Gõ sai tên địa điểm

### Vấn đề 3: Chọn location không có gì xảy ra
**Kiểm tra Console có log:**
```javascript
🎯 Selected location: { id: 5, tenViTri: "Hà Nội", ... }
```

**Nguyên nhân có thể:**
- handleLocationSelect không được gọi
- selectLocation function có lỗi

---

## 🎯 TEST MANUAL VỚI CURL

### Test API trực tiếp:
```bash
# Lấy tất cả vị trí
curl https://airbnbnew.cybersoft.edu.vn/api/vi-tri

# Lấy phòng theo vị trí ID 5
curl https://airbnbnew.cybersoft.edu.vn/api/phong-thue/lay-phong-theo-vi-tri?maViTri=5

# Search phòng
curl "https://airbnbnew.cybersoft.edu.vn/api/phong-thue/phan-trang-tim-kiem?maViTri=5&soKhach=2"
```

---

## 📝 CHECKLIST DEBUG

- [ ] Server đang chạy (localhost:3000)
- [ ] Console không có lỗi red
- [ ] Chọn được địa điểm từ dropdown
- [ ] selectedLocationId > 0 sau khi chọn
- [ ] Thấy log "🌐 API Call: getByLocation" trong console
- [ ] Thấy Debug Panel góc dưới phải
- [ ] Debug Panel hiển thị "Using: 📍 Location API"
- [ ] Rooms Count > 0
- [ ] Danh sách phòng thay đổi sau khi chọn địa điểm

---

## 🚀 KẾT QUẢ MONG ĐỢI

Khi chọn "Hà Nội" (ID: 5):

1. **Console logs:**
   ```
   🎯 Selected location: {id: 5, tenViTri: "Hà Nội", ...}
   🔄 useRoomByLocation query state: {locationId: 5, enabled: true, ...}
   🌐 API Call: getByLocation 5
   ✅ API Response: {data: {content: [...], statusCode: 200}}
   ```

2. **Debug Panel:**
   ```
   Location ID: 5
   Search Query: Hà Nội
   API Loading: ✅ No
   Has Data: ✅ Yes
   Rooms Count: 15
   Using: 📍 Location API
   ```

3. **UI Changes:**
   - Title: "Phòng tại Hà Nội"
   - Count: "Tìm thấy 15 phòng"
   - Button "Xóa bộ lọc" xuất hiện
   - Danh sách phòng cập nhật

---

## 📞 NẾU VẪN CÒN VẤN ĐỀ

Gửi cho tôi screenshot của:
1. Browser Console (tab Console)
2. Network tab (request /lay-phong-theo-vi-tri)
3. Debug Panel (góc dưới phải)
4. Danh sách phòng hiển thị
