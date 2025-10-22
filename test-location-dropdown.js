// 🧪 TEST LOCATION API - Copy đoạn code này vào Browser Console (F12)

// ===== TEST 1: Lấy tất cả vị trí =====
async function testAllLocations() {
  console.log('🔄 Đang gọi API /vi-tri...');
  
  try {
    const response = await fetch('https://airbnbnew.cybersoft.edu.vn/api/vi-tri');
    const data = await response.json();
    
    console.log('✅ API /vi-tri thành công!');
    console.log('📊 Status Code:', data.statusCode);
    console.log('📍 Tổng số địa điểm:', data.content?.length || 0);
    console.log('📦 Dữ liệu đầy đủ:', data);
    
    // Hiển thị 5 địa điểm đầu tiên
    if (data.content && data.content.length > 0) {
      console.log('\n🔍 5 địa điểm đầu tiên:');
      data.content.slice(0, 5).forEach((loc, index) => {
        console.log(`${index + 1}. ID: ${loc.id} - ${loc.tenViTri}, ${loc.quocGia}`);
      });
    }
    
    return data;
  } catch (error) {
    console.error('❌ Lỗi khi gọi API:', error);
  }
}

// ===== TEST 2: Lấy vị trí theo ID =====
async function testLocationById(locationId) {
  console.log(`🔄 Đang gọi API /vi-tri/${locationId}...`);
  
  try {
    const response = await fetch(`https://airbnbnew.cybersoft.edu.vn/api/vi-tri/${locationId}`);
    const data = await response.json();
    
    console.log('✅ API thành công!');
    console.log('📦 Dữ liệu:', data);
    
    return data;
  } catch (error) {
    console.error('❌ Lỗi khi gọi API:', error);
  }
}

// ===== TEST 3: Filter locations (giống code trong app) =====
function testFilterLocations(locations, searchQuery) {
  console.log(`🔍 Filter với query: "${searchQuery}"`);
  
  if (!searchQuery.trim()) {
    console.log('📍 Không có query → Hiển thị tất cả', locations.length, 'địa điểm');
    return locations;
  }
  
  const query = searchQuery.toLowerCase().trim();
  const filtered = locations.filter(
    (location) =>
      location.tenViTri.toLowerCase().includes(query) ||
      location.tinhThanh?.toLowerCase().includes(query) ||
      location.quocGia?.toLowerCase().includes(query)
  );
  
  console.log('✅ Tìm thấy', filtered.length, 'địa điểm');
  filtered.forEach((loc, index) => {
    console.log(`${index + 1}. ID: ${loc.id} - ${loc.tenViTri}, ${loc.quocGia}`);
  });
  
  return filtered;
}

// ===== HƯỚNG DẪN SỬ DỤNG =====
console.log(`
╔══════════════════════════════════════════╗
║  🧪 LOCATION API TEST FUNCTIONS         ║
╚══════════════════════════════════════════╝

📝 Sử dụng các lệnh sau trong Console:

1️⃣ Test lấy tất cả vị trí:
   await testAllLocations()

2️⃣ Test lấy vị trí theo ID (ví dụ: ID = 5):
   await testLocationById(5)

3️⃣ Test filter (cần có data trước):
   const data = await testAllLocations()
   testFilterLocations(data.content, "Hà Nội")
   testFilterLocations(data.content, "Việt Nam")
   testFilterLocations(data.content, "Paris")

4️⃣ Test full flow:
   // Bước 1: Lấy tất cả locations
   const allLocations = await testAllLocations()
   
   // Bước 2: Filter giống khi user gõ "Hà Nội"
   const filtered = testFilterLocations(allLocations.content, "Hà Nội")
   
   // Bước 3: Lấy thông tin chi tiết địa điểm đầu tiên
   if (filtered.length > 0) {
     await testLocationById(filtered[0].id)
   }

════════════════════════════════════════════

🎯 Kết quả mong đợi:
✅ Status 200
✅ Có danh sách locations trong response.content
✅ Filter hoạt động chính xác
✅ Mỗi location có: id, tenViTri, tinhThanh, quocGia, hinhAnh

════════════════════════════════════════════
`);

// Export functions để có thể dùng
window.testLocationAPI = {
  testAllLocations,
  testLocationById,
  testFilterLocations
};

console.log('✅ Test functions đã sẵn sàng! Copy và paste vào Console để chạy.');
