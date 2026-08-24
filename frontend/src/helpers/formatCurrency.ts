// ✅ Format currency utilities

export const formatCurrency = {
  // Format VND: 1.000.000₫
  toVND: (amount: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  },

  // Format VND compact: 1.5M₫, 2.3K₫
  toVNDCompact: (amount: number): string => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M₫`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K₫`;
    }
    return `${amount}₫`;
  },

  // Format số với dấu phẩy: 1,000,000
  toFormatted: (amount: number): string => {
    return amount.toLocaleString("vi-VN");
  },

  // Format USD: $1,000.00
  toUSD: (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  },

  // Parse string to number (remove formatting)
  parse: (formattedAmount: string): number => {
    return parseFloat(formattedAmount.replace(/[^0-9.-]+/g, ""));
  },

  // Format percentage: 15%
  toPercent: (value: number, decimals: number = 0): string => {
    return `${value.toFixed(decimals)}%`;
  },
};
