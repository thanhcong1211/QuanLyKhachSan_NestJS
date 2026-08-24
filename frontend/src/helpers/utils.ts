// ✅ General utility functions

export const utils = {
  // Debounce function
  debounce: <T extends (...args: unknown[]) => unknown>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  },

  // Truncate text with ellipsis
  truncate: (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  },

  // Generate random ID
  generateId: (): string => {
    return Math.random().toString(36).substring(2, 9);
  },

  // Check if object is empty
  isEmpty: (obj: object): boolean => {
    return Object.keys(obj).length === 0;
  },

  // Sleep function
  sleep: (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },

  // Copy to clipboard
  copyToClipboard: async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  },

  // Get file extension
  getFileExtension: (filename: string): string => {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  },

  // Format file size
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  },

  // Remove accents (Vietnamese)
  removeAccents: (str: string): string => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  },

  // Slugify (for URLs)
  slugify: (text: string): string => {
    return utils
      .removeAccents(text)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  },
};
