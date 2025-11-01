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
    
    console.log("🔍 [axiosClient] Request interceptor:", {
      url: config.url,
      method: config.method,
      hasUserToken: !!userToken,
      userTokenLength: userToken?.length || 0
    });

    // ✅ Bắt buộc gửi cả 2 token trong mọi request
    // tokenCybersoft - token cố định của khóa học (luôn phải có)
    (config.headers as unknown as HeaderMap)["tokenCybersoft"] =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJOb2RlanMgNTIiLCJIZXRIYW5TdHJpbmciOiIyNy8wNC8yMDI2IiwiSGV0SGFuVGltZSI6IjE3NzcyNDgwMDAwMDAiLCJuYmYiOjE3NTg5MDk2MDAsImV4cCI6MTc3NzM5OTIwMH0._b9cEhCuhW5AQ7TsywHkbc2NkdJDSmQZYCxkjTSbv3I";

    // token - token động từ đăng nhập (nếu có)
    if (userToken) {
      // Thử cả 2 cách gửi token để chắc chắn backend nhận được
      (config.headers as unknown as HeaderMap)["token"] = userToken;
      // Một số backend yêu cầu Authorization header với Bearer prefix
      // (config.headers as unknown as HeaderMap)["Authorization"] = `Bearer ${userToken}`;
      
      console.log("✅ [axiosClient] Sending both tokens:", {
        tokenCybersoft: "present (fixed)",
        userToken: "present (from login, length: " + userToken.length + ")",
        userTokenPreview: userToken.substring(0, 50) + "...",
        headerName: "token" // hoặc "Authorization" nếu dùng Bearer
      });
    } else {
      console.warn("⚠️ [axiosClient] Only tokenCybersoft sent, no user token found (user not logged in)");
      console.warn("⚠️ [axiosClient] Checking localStorage for token...");
      console.warn("⚠️ [axiosClient] localStorage.getItem('accessToken'):", localStorage.getItem('accessToken'));
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
      console.error('[axiosClient] Response error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers,
        url: error.config?.url,
        method: error.config?.method,
      });

      // If backend indicates user token expired / invalid (common shape: { statusCode: 403, content: '...' })
      const body = error.response.data;
      const statusCode = body?.statusCode ?? body?.status ?? error.response.status;
      
      if (statusCode === 403) {
        console.warn('[axiosClient] 403 Forbidden - Token invalid or expired. Clearing auth data...');
        // Clear stored auth data (non-invasive: remove token + user key if present)
        try {
          storage.removeToken();
          // many modules store user under 'user' or 'userInfo'
          storage.remove('user');
          storage.remove('userInfo');
        } catch (errClear) {
          console.warn('[axiosClient] Failed to clear storage after 403:', errClear);
        }
      }

      // ✅ Reject với full error object thay vì chỉ response.data
      // Điều này giúp catch block có thể truy cập error.response, error.message, etc.
      return Promise.reject(error);
    }
    console.error('[axiosClient] Network error:', error.message);
    return Promise.reject(error);
  }
);

export default axiosClient;
