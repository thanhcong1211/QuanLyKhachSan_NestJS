// ✅ Format date utilities

export const formatDate = {
  // Format: DD/MM/YYYY
  toShortDate: (date: string | Date): string => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  },

  // Format: DD/MM/YYYY HH:mm
  toDateTime: (date: string | Date): string => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  },

  // Format: YYYY-MM-DD (for input date)
  toInputFormat: (date: string | Date): string => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  },

  // Format: DD Tháng MM, YYYY
  toLongDate: (date: string | Date): string => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.toLocaleString("vi-VN", { month: "long" });
    const year = d.getFullYear();
    return `${day} ${month}, ${year}`;
  },

  // Tính số ngày giữa 2 ngày
  getDaysBetween: (startDate: string | Date, endDate: string | Date): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  },

  // Check xem có phải ngày hôm nay không
  isToday: (date: string | Date): boolean => {
    const d = new Date(date);
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  },

  // Format relative time (2 giờ trước, 3 ngày trước)
  toRelativeTime: (date: string | Date): string => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return formatDate.toShortDate(date);
  },
};
