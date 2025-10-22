import axios from "axios";
import { storage } from "@/helpers/storage";

type HeaderMap = Record<string, string | number | boolean | undefined>;

const axiosClient = axios.create({
  baseURL: "https://airbnbnew.cybersoft.edu.vn/api",
  headers: {
    "Content-Type": "application/json",
    tokenCybersoft:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJOb2RlanMgNTIiLCJIZXRIYW5TdHJpbmciOiIyNy8wNC8yMDI2IiwiSGV0SGFuVGltZSI6IjE3NzcyNDgwMDAwMDAiLCJuYmYiOjE3NTg5MDk2MDAsImV4cCI6MTc3NzM5OTIwMH0._b9cEhCuhW5AQ7TsywHkbc2NkdJDSmQZYCxkjTSbv3I",
  },
});

// ✅ Thêm interceptor để tự động gắn token người dùng
axiosClient.interceptors.request.use(
  (config) => {
    // Ensure headers object exists so assignments below don't throw
  if (!config.headers) (config as unknown as { headers: HeaderMap }).headers = {} as HeaderMap;

    const userToken = storage.getToken();

    // Gắn thêm token người dùng vào header 'token' nếu có
    if (userToken) {
    // use string index to avoid TS complaining about unknown header fields
    (config.headers as unknown as HeaderMap)["token"] = userToken;
    }

    // Bắt buộc giữ tokenCybersoft trong mọi request (do một số request có thể override headers)
    if (!(config.headers as unknown as HeaderMap)["tokenCybersoft"]) {
      (config.headers as unknown as HeaderMap)["tokenCybersoft"] =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInJvbGUiOiJBRE1JTiIsIm5iZiI6MTc2MTAzNjA3NywiZXhwIjoxNzYxNjQwODc3fQ.nx1hvbrzVliPIsSjbsDOsVljhjP7DrKym6aQcaVawIo";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Log lỗi chi tiết
    if (error.response) {
      console.error('[axiosClient] Response error:', error.response.status, error.response.data);

      // If backend indicates user token expired / invalid (common shape: { statusCode: 403, content: '...' })
      const body = error.response.data;
      const statusCode = body?.statusCode ?? body?.status;
      if (statusCode === 403) {
        // Clear stored auth data (non-invasive: remove token + user key if present)
        try {
          storage.removeToken();
          // many modules store user under 'user' or 'userInfo'
          storage.remove('user');
          storage.remove('userInfo');
          // fallback: clear everything if needed
          // (keeps behavior non-destructive by preferring targeted removals first)
          // storage.clear(); // uncomment only if you want to wipe all localStorage
        } catch (errClear) {
          console.warn('[axiosClient] Failed to clear storage after 403:', errClear);
        }
      }

      return Promise.reject(error.response.data);
    }
    console.error('[axiosClient] Error:', error.message);
    return Promise.reject(error.message);
  }
);

export default axiosClient;
