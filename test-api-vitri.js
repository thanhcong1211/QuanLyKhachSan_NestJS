/* eslint-disable */
/**
 * TEST API VỊ TRÍ - HƯỚNG DẪN DEBUG
 * 
 * Mở file này trong browser console và copy/paste các function để test
 */

// 1. Test lấy tất cả vị trí
async function testGetAllLocations() {
  const response = await fetch('https://airbnbnew.cybersoft.edu.vn/api/vi-tri');
  const data = await response.json();
  console.log('📍 All Locations:', data);
  return data;
}

// 2. Test lấy phòng theo vị trí
async function testGetRoomsByLocation(locationId) {
  const response = await fetch(`https://airbnbnew.cybersoft.edu.vn/api/phong-thue/lay-phong-theo-vi-tri?maViTri=${locationId}`);
  const data = await response.json();
  console.log(`🏠 Rooms for Location ${locationId}:`, data);
  return data;
}

// 3. Test search phòng
async function testSearchRooms(locationId, guests) {
  const params = new URLSearchParams();
  if (locationId) params.append('maViTri', locationId);
  if (guests) params.append('soKhach', guests);
  
  const response = await fetch(`https://airbnbnew.cybersoft.edu.vn/api/phong-thue/phan-trang-tim-kiem?${params}`);
  const data = await response.json();
  console.log('🔍 Search Results:', data);
  return data;
}

// CÁCH SỬ DỤNG:
// 1. Mở Browser Console (F12)
// 2. Copy toàn bộ file này vào console
// 3. Chạy:
//    await testGetAllLocations()
//    await testGetRoomsByLocation(1)  // Thay 1 bằng locationId thực tế
//    await testSearchRooms(1, 2)

console.log('✅ API Test Functions loaded!');
console.log('Run: await testGetAllLocations()');
console.log('Run: await testGetRoomsByLocation(1)');
console.log('Run: await testSearchRooms(1, 2)');
