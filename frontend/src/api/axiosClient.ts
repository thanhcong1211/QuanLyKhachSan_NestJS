import axios from "axios";
import { storage } from "@/helpers/storage";

type HeaderMap = Record<string, string | number | boolean | undefined>;

// API Configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://airbnbnew.cybersoft.edu.vn/api";
const TOKEN_CYBERSOFT = process.env.NEXT_PUBLIC_TOKEN_CYBERSOFT || 
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJOb2RlanMgNTIiLCJIZXRIYW5TdHJpbmciOiIyNy8wNC8yMDI2IiwiSGV0SGFuVGltZSI6IjE3NzcyNDgwMDAwMDAiLCJuYmYiOjE3NTg5MDk2MDAsImV4cCI6MTc3NzM5OTIwMH0._b9cEhCuhW5AQ7TsywHkbc2NkdJDSmQZYCxkjTSbv3I";

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    tokenCybersoft: TOKEN_CYBERSOFT,
  },
});

// Request interceptor - Tự động gắn token người dùng
axiosClient.interceptors.request.use(
  (config) => {
    if (!config.headers) (config as unknown as { headers: HeaderMap }).headers = {} as HeaderMap;

    const userToken = storage.getToken();
    
    // Gắn tokenCybersoft (bắt buộc)
    (config.headers as unknown as HeaderMap)["tokenCybersoft"] = TOKEN_CYBERSOFT;

    // Gắn token user nếu đã đăng nhập
    if (userToken) {
      (config.headers as unknown as HeaderMap)["token"] = userToken;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const body = error.response.data;
      const statusCode = body?.statusCode ?? body?.status ?? error.response.status;
      
      // 401: Token không hợp lệ/hết hạn → Xóa auth data
      if (statusCode === 401) {
        storage.removeToken();
        storage.remove('user');
        storage.remove('userInfo');
      }
      
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
