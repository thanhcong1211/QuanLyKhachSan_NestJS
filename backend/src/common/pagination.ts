// Cybersoft trả kết quả phân trang với content là MẢNG trực tiếp,
// còn pageIndex/pageSize/totalRow nằm cùng cấp với content (không lồng bên trong).
// Xem HomePage.tsx (fetchRooms/fetchLocations) của frontend: `data.content` được
// dùng thẳng như mảng, `data.totalRow`/`data.pageSize` đọc ở cấp ngoài.
export interface PaginatedResult<T> {
  __paginated: true;
  data: T[];
  currentPage: number;
  pageSize: number;
  totalRow: number;
  totalPage: number;
}

export function paginate<T>(
  data: T[],
  totalRow: number,
  pageIndex: number,
  pageSize: number,
): PaginatedResult<T> {
  return {
    __paginated: true,
    data,
    currentPage: pageIndex,
    pageSize,
    totalRow,
    totalPage: Math.max(1, Math.ceil(totalRow / pageSize)),
  };
}
