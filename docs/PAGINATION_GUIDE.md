# Hướng dẫn sử dụng Pagination Components

## Tổng quan
Project có 3 components phân trang có thể tái sử dụng:

1. **Pagination** - Cho client-side pagination (SearchPage, HomePage)
2. **AdminPagination** - Cho admin pages với server-side pagination
3. **usePagination** - Hook để quản lý logic phân trang

---

## 1. Pagination Component (Client-side)

### Đường dẫn
`@/components/ui/pagination`

### Khi nào sử dụng
- Khi có tất cả dữ liệu ở client
- Tự động tính toán và chia trang
- Dùng với hook `usePagination`

### Ví dụ: SearchPage

```tsx
import Pagination from "@/components/ui/pagination";
import { usePagination } from "@/hooks/usePagination";

// Component
const { 
  currentPage, 
  totalPages, 
  paginatedItems, 
  goToPage,
  totalItems,
  itemsPerPage 
} = usePagination({
  items: filteredRooms,        // Dữ liệu gốc
  itemsPerPage: 8,             // Số item mỗi trang
  dependencies: [searchTerm]   // Reset về trang 1 khi thay đổi
});

// Render
<div>
  {paginatedItems.map(item => <Item key={item.id} {...item} />)}
  
  <Pagination
    currentPage={currentPage}
    totalPages={totalPages}
    onPageChange={goToPage}
    totalItems={totalItems}
    itemsPerPage={itemsPerPage}
  />
</div>
```

### Props

| Prop | Type | Bắt buộc | Mô tả |
|------|------|----------|-------|
| currentPage | number | ✅ | Trang hiện tại |
| totalPages | number | ✅ | Tổng số trang |
| onPageChange | (page: number) => void | ✅ | Callback khi đổi trang |
| totalItems | number | ❌ | Tổng số items (hiển thị info) |
| itemsPerPage | number | ❌ | Số items/trang (hiển thị info) |

---

## 2. usePagination Hook

### Đường dẫn
`@/hooks/usePagination`

### Features
- ✅ Tự động tính toán pagination
- ✅ Memoization để optimize performance
- ✅ Auto reset về trang 1 khi dependencies thay đổi

### Cú pháp

```tsx
const pagination = usePagination<T>({
  items: T[],                    // Mảng dữ liệu
  itemsPerPage?: number,         // Mặc định: 8
  dependencies?: unknown[]       // Auto reset triggers
});
```

### Return values

```tsx
{
  currentPage: number;           // Trang hiện tại
  totalPages: number;            // Tổng số trang
  paginatedItems: T[];          // Items của trang hiện tại
  goToPage: (page: number) => void;
  setCurrentPage: (page: number) => void;
  totalItems: number;           // Tổng số items
  itemsPerPage: number;
}
```

### Ví dụ đầy đủ

```tsx
function MyPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter data
  const filteredRooms = useMemo(() => 
    rooms.filter(r => r.name.includes(searchTerm)),
    [rooms, searchTerm]
  );
  
  // Pagination
  const {
    paginatedItems: displayRooms,
    currentPage,
    totalPages,
    goToPage,
  } = usePagination({
    items: filteredRooms,
    itemsPerPage: 12,
    dependencies: [searchTerm], // Reset khi search
  });
  
  return (
    <div>
      <input onChange={e => setSearchTerm(e.target.value)} />
      
      <div className="grid grid-cols-4 gap-4">
        {displayRooms.map(room => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
        totalItems={filteredRooms.length}
      />
    </div>
  );
}
```

---

## 3. AdminPagination Component (Server-side)

### Đường dẫn
`@/components/ui/admin-pagination`

### Khi nào sử dụng
- Admin pages với API pagination
- Server trả về: `pageIndex`, `totalPages`, `totalRows`
- Dark theme phù hợp với admin layout

### Ví dụ: UserManagement

```tsx
import AdminPagination from "@/components/ui/admin-pagination";

function UserManagement() {
  const {
    users,
    pageIndex,      // Từ hook
    totalPages,     // Từ API
    totalRows,      // Từ API
    setPageIndex,   // Update page
  } = useUserManager();
  
  return (
    <div>
      <table>
        {users.map(user => <UserRow key={user.id} {...user} />)}
      </table>
      
      <AdminPagination
        currentPage={pageIndex}
        totalPages={totalPages}
        totalItems={totalRows}
        onPageChange={setPageIndex}
        previousLabel="Trước"
        nextLabel="Tiếp"
        infoLabel="Trang {page} / {total} ({count} người dùng)"
      />
    </div>
  );
}
```

### Props

| Prop | Type | Bắt buộc | Default | Mô tả |
|------|------|----------|---------|-------|
| currentPage | number | ✅ | - | Trang hiện tại từ API |
| totalPages | number | ✅ | - | Tổng số trang từ API |
| totalItems | number | ✅ | - | Tổng số items từ API |
| onPageChange | (page: number) => void | ✅ | - | Callback đổi trang |
| previousLabel | string | ❌ | "Trước" | Label nút Previous |
| nextLabel | string | ❌ | "Tiếp" | Label nút Next |
| infoLabel | string | ❌ | "Trang {page} / {total} ({count} mục)" | Template hiển thị info |

### Template variables
- `{page}` - Trang hiện tại
- `{total}` - Tổng số trang  
- `{count}` - Tổng số items

---

## 4. Styling & Theme

### Client Pagination (Pagination)
- Light theme
- Rose/Pink gradient cho active page
- White background

### Admin Pagination (AdminPagination)
- Dark theme (gray-900, gray-800)
- Rose/Pink gradient cho active page
- Phù hợp với AdminLayout

### Customization

```tsx
// Override màu active page trong component
<Pagination 
  currentPage={1}
  totalPages={5}
  onPageChange={setPage}
  className="custom-pagination" // Thêm class riêng
/>
```

```css
/* globals.css */
.custom-pagination button[data-active="true"] {
  background: linear-gradient(to right, #3b82f6, #8b5cf6);
}
```

---

## 5. Features chung

### ✅ Smart Ellipsis
Tự động hiển thị "..." khi có nhiều trang:
- Trang 1: `[1] 2 3 ... 10`
- Trang 5: `1 ... 4 [5] 6 ... 10`
- Trang 10: `1 ... 8 9 [10]`

### ✅ Auto Scroll
Tự động scroll lên đầu trang khi chuyển trang

### ✅ Disable States
Nút Previous/Next tự động disable ở trang đầu/cuối

### ✅ Responsive
Mobile-friendly với các breakpoint

---

## 6. Best Practices

### ❌ Tránh

```tsx
// KHÔNG tự tính toán pagination thủ công
const currentItems = items.slice(
  (page - 1) * pageSize, 
  page * pageSize
);
```

### ✅ Nên

```tsx
// SỬ DỤNG hook
const { paginatedItems } = usePagination({ items });
```

### Performance Tips

1. **Memoize filtered data**
```tsx
const filteredItems = useMemo(() => 
  items.filter(condition),
  [items, dependencies]
);
```

2. **Debounce search**
```tsx
const debouncedSearch = useDebounce(searchTerm, 300);
```

3. **Virtual scrolling** cho lists rất dài (>1000 items)

---

## 7. Migration Guide

### Từ custom pagination → usePagination

**Trước:**
```tsx
const [page, setPage] = useState(1);
const pageSize = 10;
const total = Math.ceil(items.length / pageSize);
const start = (page - 1) * pageSize;
const current = items.slice(start, start + pageSize);
```

**Sau:**
```tsx
const { paginatedItems, currentPage, totalPages, goToPage } = 
  usePagination({ items, itemsPerPage: 10 });
```

### Từ Ant Design Pagination → AdminPagination

**Trước:**
```tsx
<Table
  dataSource={users}
  pagination={{
    current: page,
    total: totalRows,
    pageSize: 10,
    onChange: setPage
  }}
/>
```

**Sau:**
```tsx
<table>{/* Render users */}</table>
<AdminPagination
  currentPage={page}
  totalPages={totalPages}
  totalItems={totalRows}
  onPageChange={setPage}
/>
```

---

## 8. Troubleshooting

### Pagination không reset khi search?
Thêm `dependencies`:
```tsx
usePagination({ 
  items, 
  dependencies: [searchTerm, filters] 
});
```

### Trang trống sau khi filter?
Kiểm tra `totalPages > 0` và `filteredItems.length > 0`

### Màu không đúng?
- Client → Dùng `Pagination`
- Admin → Dùng `AdminPagination`

---

## Tổng kết

| Trang | Component | Hook | Loại | Status |
|-------|-----------|------|------|--------|
| SearchPage | Pagination | usePagination | Client-side | ✅ Hoàn thành |
| HomePage | - | - | N/A | ❌ Không cần |
| UserManagement | AdminPagination | useUserManager | Server-side | ✅ Hoàn thành |
| RoomManagement | AdminPagination | useRoomManager | Server-side | ✅ Hoàn thành |
| LocationManagement | AdminPagination | useLocationManager | Server-side | ✅ Hoàn thành |
| BookingManagement | Ant Design Table (Custom Styled) | - | Client-side | ✅ Hoàn thành |
| bookingPage | Ant Design Table (Custom Styled) | - | Client-side | ✅ Hoàn thành |

**Đã áp dụng:** ✅ Tất cả các trang có pagination
**Sẵn sàng dùng:** AdminPagination, usePagination, Pagination

---

## Ant Design Table Pagination

Các trang dùng Ant Design Table đã được custom style để đồng bộ với theme:

### BookingManagement (Admin Dark Theme)

```tsx
<Table
  dataSource={data}
  className="admin-table-pagination"
  pagination={{
    pageSize: 10,
    showTotal: (total) => `Tổng ${total} mục`,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50', '100'],
    locale: {
      items_per_page: '/ trang',
      jump_to: 'Đến',
      page: '',
      prev_page: 'Trang trước',
      next_page: 'Trang sau',
    },
  }}
/>

<style jsx global>{`
  .admin-table-pagination .ant-pagination {
    background-color: rgba(17, 24, 39, 0.5);
    border-top: 1px solid rgb(55, 65, 81);
  }
  
  .admin-table-pagination .ant-pagination-item-active {
    background: linear-gradient(to right, #ec4899, #f472b6);
    border-color: transparent;
  }
  
  /* ... more dark theme styles */
`}</style>
```

### bookingPage (User Light Theme)

```tsx
<Table
  dataSource={data}
  className="user-booking-table-pagination"
  pagination={{
    pageSize: 6,
    showTotal: (total) => `Tổng ${total} mục`,
    showSizeChanger: true,
    pageSizeOptions: ['6', '12', '24'],
    locale: {
      items_per_page: '/ trang',
      jump_to: 'Đến',
      page: '',
      prev_page: 'Trang trước',
      next_page: 'Trang sau',
    },
  }}
/>

<style jsx global>{`
  .user-booking-table-pagination .ant-pagination {
    background-color: #fafafa;
  }
  
  .user-booking-table-pagination .ant-pagination-item-active {
    background: linear-gradient(to right, #ec4899, #f472b6);
    box-shadow: 0 4px 6px -1px rgba(236, 72, 153, 0.3);
  }
  
  /* ... more light theme styles */
`}</style>
```

**Features:**
- ✅ Dark theme cho admin pages
- ✅ Light theme cho user pages
- ✅ Rose/pink gradient cho active page (đồng bộ với layout)
- ✅ Hiển thị số lượng items
- ✅ Thay đổi số items mỗi trang
- ✅ Locale tiếng Việt
- ✅ Hover effects
- ✅ Tích hợp sẵn với Table

**Tại sao dùng Ant Design Table:**
- Có sẵn sorting, filtering
- Search và filter tích hợp
- Responsive scroll
- Column resizing
- Row selection (nếu cần)

**Custom styling:**
- AdminPagination: Dark gray background (gray-900/gray-800)
- UserPagination: Light gray background (#fafafa)
- Active page: Rose/pink gradient (#ec4899 to #f472b6)
- Rounded corners: 8px
- Smooth hover transitions
