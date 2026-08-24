import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface SearchParams {
  searchQuery?: string;
  locationId?: number | null;
  checkInDate?: string;
  checkOutDate?: string;
  guests?: number;
}

export function buildSearchUrl(params: SearchParams): string {
  const urlParams = new URLSearchParams();
  
  // Ưu tiên locationId từ API
  if (params.locationId) {
    urlParams.append("locationId", params.locationId.toString());
  } else if (params.searchQuery?.trim()) {
    urlParams.append("q", params.searchQuery.trim());
  }
  
  if (params.checkInDate) {
    urlParams.append("checkIn", params.checkInDate);
  }
  if (params.checkOutDate) {
    urlParams.append("checkOut", params.checkOutDate);
  }
  if (params.guests && params.guests > 1) {
    urlParams.append("guests", params.guests.toString());
  }

  return `/search?${urlParams.toString()}`;
}

export function navigateToSearch(router: AppRouterInstance, params: SearchParams) {
  const url = buildSearchUrl(params);
  router.push(url);
}
