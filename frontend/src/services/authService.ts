import { authApi } from "@/api/auth.api";
import type { LoginRequest, RegisterRequest } from "@/types/auth.type";
import { storage } from "@/helpers/storage";
import { store } from "@/redux/store";
import { setUser, setToken } from "@/redux/slices/authSlice";

export const authService = {
  login: async (data: LoginRequest) => {
    const res = await authApi.login(data);
    
    console.log("🔐 authService.login - Full response:", res);
    
    // ✅ axiosClient đã unwrap response.data rồi
    // Structure: { statusCode, content: { token, user }, message }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = res as { content?: { token?: string; user?: any } };
    const token = responseData?.content?.token;
    const user = responseData?.content?.user;
    
    console.log("🔍 Extracted:", { token: !!token, user });
    console.log("👤 User role:", user?.role);
    console.log("📧 User email:", user?.email);
    console.log("� User id:", user?.id);
    console.log("�🎫 Token preview:", token?.substring(0, 50) + "...");
    
    if (token) {
      storage.setToken(token);
      store.dispatch(setToken(token));
      console.log("✅ Token saved to localStorage & dispatched to Redux");
    }
    
    if (user) {
      storage.set("user", JSON.stringify(user));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      store.dispatch(setUser(user as any));
      console.log("✅ User saved to localStorage & dispatched to Redux");
      console.log("📢 Redux store updated → Navbar will auto re-render with new user");
      
      // ⚠️ Kiểm tra quyền
      if (user.role !== "ADMIN") {
        console.error("❌❌❌ WARNING: User is NOT ADMIN! ❌❌❌");
        console.error("Current role:", user.role);
        console.error("You will NOT be able to delete/update locations!");
        alert(`⚠️ Tài khoản của bạn có role: "${user.role}"\n\nChỉ tài khoản ADMIN mới có thể xóa/sửa location!\n\nVui lòng đăng nhập bằng tài khoản ADMIN.`);
      } else {
        console.log("✅✅✅ User is ADMIN - Full permissions granted! ✅✅✅");
      }
    }
    
    return res;
  },
  register: (data: RegisterRequest) => authApi.register(data),
};
