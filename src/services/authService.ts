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
    }
    
    return res;
  },
  register: (data: RegisterRequest) => authApi.register(data),
};
