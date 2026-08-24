"use client";

import { SearchOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import { useTranslations } from '@/lib/i18n';

interface SearchButtonProps {
  onClick: () => void;
  loading?: boolean;
  size?: "small" | "middle" | "large";
  shape?: "circle" | "round" | "default";
  tooltip?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * Component nút tìm kiếm có thể tái sử dụng
 * 
 * @example
 * ```tsx
 * <SearchButton 
 *   onClick={handleSearch} 
 *   loading={isSearching}
 *   tooltip="Tìm kiếm ngay"
 * />
 * ```
 */
export default function SearchButton({
  onClick,
  loading = false,
  size = "middle",
  shape = "circle",
  tooltip,
  className = "",
  disabled = false,
}: SearchButtonProps) {
  const t = useTranslations('common');
  const title = tooltip ?? t('actions.search');
  return (
    <Tooltip title={title}>
      <Button
        onClick={onClick}
        loading={loading}
        disabled={disabled}
        type="primary"
        shape={shape}
        size={size}
        aria-label={title}
        className={className}
        icon={<SearchOutlined />}
        style={{ 
          backgroundColor: '#ec4899', 
          borderColor: '#ec4899',
          width: shape === 'circle' ? '48px' : 'auto',
          height: '48px',
          fontSize: '18px',
        }}
      />
    </Tooltip>
  );
}
