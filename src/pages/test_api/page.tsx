"use client";

import { useState } from "react";
import axiosClient from "@/api/axiosClient";
import { endpoints } from "@/constant/endpoints";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Play,
  Trash2,
  Copy,
  Eye,
  EyeOff
} from "lucide-react";

type ApiTest = {
  id: string;
  name: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  endpoint: string;
  requiresAuth: boolean;
  requiresId?: boolean;
  bodyExample?: Record<string, unknown>;
  description: string;
};

type TestResult = {
  id: string;
  status: "success" | "error" | "loading";
  data?: unknown;
  error?: string;
  timestamp: number;
  duration?: number;
};

export default function TestAPIPage() {
  const [results, setResults] = useState<Record<string, TestResult>>({});
  const [testInputs, setTestInputs] = useState<Record<string, unknown>>({});
  const [authToken, setAuthToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [expandedResults, setExpandedResults] = useState<Record<string, boolean>>({});

  // ==================== API TEST DEFINITIONS ====================
  const apiTests: ApiTest[] = [
    // AUTH APIs
    {
      id: "auth-login",
      name: "Đăng nhập",
      method: "POST",
      endpoint: endpoints.auth.login,
      requiresAuth: false,
      description: "Đăng nhập để lấy token (Dùng token này để test các API khác)",
      bodyExample: {
        email: "admin@example.com",
        password: "123456"
      }
    },
    {
      id: "auth-register",
      name: "Đăng ký",
      method: "POST",
      endpoint: endpoints.auth.register,
      requiresAuth: false,
      description: "Tạo tài khoản mới (Email phải unique)",
      bodyExample: {
        id: 0,
        name: "Test User " + Date.now(),
        email: `user${Date.now()}@test.com`,
        password: "123456",
        phone: "0123456789",
        birthday: "1990-01-01",
        gender: true,
        role: "USER"
      }
    },

    // USER APIs
    {
      id: "user-getAll",
      name: "Lấy danh sách users",
      method: "GET",
      endpoint: endpoints.user.getAll,
      requiresAuth: true,
      description: "Lấy tất cả users trong hệ thống"
    },
    {
      id: "user-getById",
      name: "Lấy user theo ID",
      method: "GET",
      endpoint: endpoints.user.getById(1),
      requiresAuth: true,
      requiresId: true,
      description: "Lấy thông tin chi tiết 1 user"
    },
    {
      id: "user-update",
      name: "Cập nhật user",
      method: "PUT",
      endpoint: endpoints.user.update(1),
      requiresAuth: true,
      requiresId: true,
      description: "Cập nhật thông tin user (Chỉ gửi fields cần update)",
      bodyExample: {
        id: 1,
        name: "Updated Name",
        email: "updated@example.com",
        password: "123456",
        phone: "0987654321",
        birthday: "1990-01-01",
        gender: true,
        role: "USER"
      }
    },
    {
      id: "user-delete",
      name: "Xóa user",
      method: "DELETE",
      endpoint: endpoints.user.delete(2),
      requiresAuth: true,
      requiresId: true,
      description: "Xóa user khỏi hệ thống"
    },

    // ROOM APIs
    {
      id: "room-getAll",
      name: "Lấy danh sách phòng",
      method: "GET",
      endpoint: endpoints.room.getAll,
      requiresAuth: false,
      description: "Lấy tất cả phòng thuê"
    },
    {
      id: "room-getById",
      name: "Lấy phòng theo ID",
      method: "GET",
      endpoint: endpoints.room.getById(1),
      requiresAuth: false,
      requiresId: true,
      description: "Lấy chi tiết 1 phòng"
    },
    {
      id: "room-create",
      name: "Tạo phòng mới",
      method: "POST",
      endpoint: endpoints.room.create,
      requiresAuth: true,
      description: "Tạo phòng thuê mới (Cần token Admin)",
      bodyExample: {
        id: 1,
        tenPhong: "Phòng Test API " + Date.now(),
        khach: 4,
        phongNgu: 2,
        giuong: 2,
        phongTam: 1,
        moTa: "Phòng được tạo từ Test API",
        giaTien: 500000,
        mayGiat: true,
        banLa: true,
        tivi: true,
        dieuHoa: true,
        wifi: true,
        bep: true,
        doXe: true,
        hoBoi: false,
        banUi: false,
        maViTri: 1,
        hinhAnh: "https://picsum.photos/400/300"
      }
    },
    {
      id: "room-update",
      name: "Cập nhật phòng",
      method: "PUT",
      endpoint: endpoints.room.update(1),
      requiresAuth: true,
      requiresId: true,
      description: "Cập nhật thông tin phòng",
      bodyExample: {
        tenPhong: "Phòng updated",
        giaTien: 600000
      }
    },
    {
      id: "room-delete",
      name: "Xóa phòng",
      method: "DELETE",
      endpoint: endpoints.room.delete(1),
      requiresAuth: true,
      requiresId: true,
      description: "Xóa phòng khỏi hệ thống"
    },

    // LOCATION APIs
    {
      id: "location-getAll",
      name: "Lấy danh sách vị trí",
      method: "GET",
      endpoint: endpoints.location.getAll,
      requiresAuth: false,
      description: "Lấy tất cả vị trí"
    },
    {
      id: "location-getById",
      name: "Lấy vị trí theo ID",
      method: "GET",
      endpoint: endpoints.location.getById(1),
      requiresAuth: false,
      requiresId: true,
      description: "Lấy chi tiết 1 vị trí"
    },
    {
      id: "location-create",
      name: "Tạo vị trí mới",
      method: "POST",
      endpoint: endpoints.location.create,
      requiresAuth: true,
      description: "Tạo vị trí mới (Cần token Admin)",
      bodyExample: {
        id: 0,
        tenViTri: "Vị trí Test " + Date.now(),
        tinhThanh: "Hà Nội",
        quocGia: "Việt Nam",
        hinhAnh: "https://picsum.photos/400/300"
      }
    },
    {
      id: "location-update",
      name: "Cập nhật vị trí",
      method: "PUT",
      endpoint: endpoints.location.update(1),
      requiresAuth: true,
      requiresId: true,
      description: "Cập nhật thông tin vị trí (Cần token Admin)",
      bodyExample: {
        id: 0,
        tenViTri: "Hà Nội Updated",
        tinhThanh: "Hà Nội",
        quocGia: "Việt Nam",
        hinhAnh: "https://picsum.photos/400/300"
      }
    },
    {
      id: "location-delete",
      name: "Xóa vị trí",
      method: "DELETE",
      endpoint: endpoints.location.delete(1),
      requiresAuth: true,
      requiresId: true,
      description: "Xóa vị trí"
    },

    // BOOKING APIs
    {
      id: "booking-getAll",
      name: "Lấy danh sách đặt phòng",
      method: "GET",
      endpoint: endpoints.booking.getAll,
      requiresAuth: true,
      description: "Lấy tất cả booking"
    },
    {
      id: "booking-getById",
      name: "Lấy booking theo ID",
      method: "GET",
      endpoint: endpoints.booking.getById(1),
      requiresAuth: true,
      requiresId: true,
      description: "Lấy chi tiết 1 booking"
    },
    {
      id: "booking-create",
      name: "Tạo booking mới",
      method: "POST",
      endpoint: endpoints.booking.create,
      requiresAuth: true,
      description: "Đặt phòng mới (Cần đăng nhập)",
      bodyExample: {
        id: 0,
        maPhong: 1,
        ngayDen: "2025-12-01",
        ngayDi: "2025-12-05",
        soLuongKhach: 2,
        maNguoiDung: 1
      }
    },
    {
      id: "booking-update",
      name: "Cập nhật booking",
      method: "PUT",
      endpoint: endpoints.booking.update(1),
      requiresAuth: true,
      requiresId: true,
      description: "Cập nhật booking (Cần đăng nhập)",
      bodyExample: {
        id: 0,
        maPhong: 1,
        ngayDen: "2025-12-01",
        ngayDi: "2025-12-06",
        soLuongKhach: 3,
        maNguoiDung: 1
      }
    },
    {
      id: "booking-delete",
      name: "Xóa booking",
      method: "DELETE",
      endpoint: endpoints.booking.delete(1),
      requiresAuth: true,
      requiresId: true,
      description: "Hủy booking"
    },

    // COMMENT APIs
    {
      id: "comment-getAll",
      name: "Lấy danh sách bình luận",
      method: "GET",
      endpoint: endpoints.comment.getAll,
      requiresAuth: false,
      description: "Lấy tất cả comments"
    },
    {
      id: "comment-getById",
      name: "Lấy comment theo ID",
      method: "GET",
      endpoint: endpoints.comment.getById(1),
      requiresAuth: false,
      requiresId: true,
      description: "Lấy chi tiết 1 comment"
    },
    {
      id: "comment-create",
      name: "Tạo comment mới",
      method: "POST",
      endpoint: endpoints.comment.create,
      requiresAuth: true,
      description: "Tạo bình luận mới (Cần đăng nhập)",
      bodyExample: {
        id: 0,
        maPhong: 1,
        maNguoiBinhLuan: 1,
        ngayBinhLuan: "2025-10-20",
        noiDung: "Phòng rất đẹp và sạch sẽ!",
        saoBinhLuan: 5
      }
    },
    {
      id: "comment-update",
      name: "Cập nhật comment",
      method: "PUT",
      endpoint: endpoints.comment.update(1),
      requiresAuth: true,
      requiresId: true,
      description: "Cập nhật comment (Cần đăng nhập)",
      bodyExample: {
        id: 0,
        maPhong: 1,
        maNguoiBinhLuan: 1,
        ngayBinhLuan: "2025-10-20",
        noiDung: "Phòng rất tốt, đáng giá tiền!",
        saoBinhLuan: 4
      }
    },
    {
      id: "comment-delete",
      name: "Xóa comment",
      method: "DELETE",
      endpoint: endpoints.comment.delete(1),
      requiresAuth: true,
      requiresId: true,
      description: "Xóa comment"
    }
  ];

  // ==================== TEST FUNCTIONS ====================
  const runTest = async (test: ApiTest) => {
    const startTime = Date.now();
    
    setResults(prev => ({
      ...prev,
      [test.id]: {
        id: test.id,
        status: "loading",
        timestamp: startTime
      }
    }));

    try {
      // Prepare endpoint with ID if needed
      let endpoint = test.endpoint;
      if (test.requiresId && testInputs[`${test.id}-id`]) {
        const id = testInputs[`${test.id}-id`];
        endpoint = endpoint.replace(/\/\d+$/, `/${id}`);
      }

      // Temporarily override token in localStorage if provided
      const originalToken = localStorage.getItem("token");
      if (authToken && test.requiresAuth) {
        localStorage.setItem("token", authToken);
      }

      // Make API call
      let response;
      const body = testInputs[`${test.id}-body`] || test.bodyExample;

      try {
        switch (test.method) {
          case "GET":
            response = await axiosClient.get(endpoint);
            break;
          case "POST":
            response = await axiosClient.post(endpoint, body);
            break;
          case "PUT":
            response = await axiosClient.put(endpoint, body);
            break;
          case "DELETE":
            response = await axiosClient.delete(endpoint);
            break;
        }
      } finally {
        // Restore original token
        if (originalToken) {
          localStorage.setItem("token", originalToken);
        } else if (authToken && test.requiresAuth) {
          localStorage.removeItem("token");
        }
      }

      const duration = Date.now() - startTime;

      setResults(prev => ({
        ...prev,
        [test.id]: {
          id: test.id,
          status: "success",
          data: response,
          timestamp: startTime,
          duration
        }
      }));
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);

      setResults(prev => ({
        ...prev,
        [test.id]: {
          id: test.id,
          status: "error",
          error: errorMessage,
          timestamp: startTime,
          duration
        }
      }));
    }
  };

  const runAllTests = async () => {
    for (const test of apiTests) {
      await runTest(test);
      // Delay between tests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const clearResults = () => {
    setResults({});
    setExpandedResults({});
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const toggleExpanded = (id: string) => {
    setExpandedResults(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // ==================== STATS ====================
  const stats = {
    total: apiTests.length,
    success: Object.values(results).filter(r => r.status === "success").length,
    error: Object.values(results).filter(r => r.status === "error").length,
    loading: Object.values(results).filter(r => r.status === "loading").length
  };

  // ==================== RENDER ====================
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            API Testing Dashboard
          </h1>
          <p className="text-gray-600 mb-4">
            Test tất cả các API endpoints của Airbnb Clone
          </p>

          {/* Quick Guide Alert */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800 mb-2">
                  🚀 Hướng dẫn nhanh - Fix lỗi APIs
                </h3>
                <div className="text-sm text-blue-700 space-y-2">
                  <p><strong>Bước 1:</strong> Test API &quot;Đăng nhập&quot; → Copy token từ response</p>
                  <p><strong>Bước 2:</strong> Paste token vào ô &quot;Auth Token&quot; bên dưới</p>
                  <p><strong>Bước 3:</strong> Với APIs cần ID (PUT/DELETE) → Test &quot;Get All&quot; trước để lấy ID hợp lệ</p>
                  <p className="pt-2 border-t border-blue-200">
                    <strong>⚠️ Lỗi thường gặp:</strong><br/>
                    • &quot;Unauthorized&quot; → Chưa có token (làm bước 1-2)<br/>
                    • &quot;Not found&quot; → ID không tồn tại (làm bước 3)<br/>
                    • &quot;Forbidden&quot; → Cần quyền Admin (test APIs khác)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Auth Token Input */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Auth Token (Required cho API cần authentication)
              </label>
              <div className="text-xs text-gray-500">
                💡 Tip: Login trước, copy token từ response, paste vào đây
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  type={showToken ? "text" : "password"}
                  value={authToken}
                  onChange={(e) => setAuthToken(e.target.value)}
                  placeholder="Paste token sau khi login thành công"
                  className="pr-10"
                />
                <button
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showToken ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <Button
                onClick={() => {
                  const token = localStorage.getItem("token");
                  if (token) {
                    setAuthToken(token);
                    alert("✅ Đã load token từ localStorage");
                  } else {
                    alert("❌ Không tìm thấy token trong localStorage. Vui lòng login trước!");
                  }
                }}
                variant="outline"
              >
                Load từ localStorage
              </Button>
              <Button
                onClick={() => {
                  setAuthToken("");
                  alert("🗑️ Đã xóa token");
                }}
                variant="outline"
              >
                Clear
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={runAllTests} className="gap-2">
              <Play size={20} />
              Chạy tất cả tests
            </Button>
            <Button onClick={clearResults} variant="outline" className="gap-2">
              <Trash2 size={20} />
              Xóa kết quả
            </Button>
          </div>

          {/* Stats */}
          {Object.keys(results).length > 0 && (
            <div className="mt-6 grid grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-blue-700">Tổng số tests</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.success}</div>
                <div className="text-sm text-green-700">Thành công</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{stats.error}</div>
                <div className="text-sm text-red-700">Thất bại</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{stats.loading}</div>
                <div className="text-sm text-yellow-700">Đang chạy</div>
              </div>
            </div>
          )}
        </div>

        {/* API Tests */}
        <div className="space-y-4">
          {apiTests.map((test) => {
            const result = results[test.id];
            const isExpanded = expandedResults[test.id];

            return (
              <div
                key={test.id}
                className="bg-white rounded-lg shadow-sm p-6 border-l-4"
                style={{
                  borderColor:
                    result?.status === "success"
                      ? "#10b981"
                      : result?.status === "error"
                      ? "#ef4444"
                      : result?.status === "loading"
                      ? "#f59e0b"
                      : "#e5e7eb"
                }}
              >
                {/* Test Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          test.method === "GET"
                            ? "bg-blue-100 text-blue-700"
                            : test.method === "POST"
                            ? "bg-green-100 text-green-700"
                            : test.method === "PUT"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {test.method}
                      </span>
                      <h3 className="font-semibold text-gray-900">{test.name}</h3>
                      {test.requiresAuth && (
                        <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                          Requires Auth
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{test.description}</p>
                    <code className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                      {test.endpoint}
                    </code>
                  </div>

                  {/* Status Icon */}
                  <div className="ml-4">
                    {result?.status === "loading" && (
                      <Loader2 className="w-6 h-6 text-yellow-500 animate-spin" />
                    )}
                    {result?.status === "success" && (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    )}
                    {result?.status === "error" && (
                      <XCircle className="w-6 h-6 text-red-500" />
                    )}
                  </div>
                </div>

                {/* Input Fields */}
                <div className="space-y-3 mb-4">
                  {test.requiresId && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ID
                      </label>
                      <Input
                        type="number"
                        placeholder="Nhập ID"
                        value={String(testInputs[`${test.id}-id`] || "")}
                        onChange={(e) =>
                          setTestInputs((prev) => ({
                            ...prev,
                            [`${test.id}-id`]: e.target.value
                          }))
                        }
                      />
                    </div>
                  )}

                  {test.bodyExample && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Request Body (JSON)
                      </label>
                      <textarea
                        className="w-full p-3 border rounded-lg font-mono text-sm"
                        rows={6}
                        value={
                          testInputs[`${test.id}-body`]
                            ? JSON.stringify(testInputs[`${test.id}-body`], null, 2)
                            : JSON.stringify(test.bodyExample, null, 2)
                        }
                        onChange={(e) => {
                          try {
                            const parsed = JSON.parse(e.target.value);
                            setTestInputs((prev) => ({
                              ...prev,
                              [`${test.id}-body`]: parsed
                            }));
                          } catch {}
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Run Button */}
                <Button
                  onClick={() => runTest(test)}
                  size="sm"
                  disabled={result?.status === "loading"}
                  className="gap-2"
                >
                  <Play size={16} />
                  Chạy test
                </Button>

                {/* Result */}
                {result && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Kết quả:</span>
                        {result.duration && (
                          <span className="text-xs text-gray-500">
                            ({result.duration}ms)
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleExpanded(test.id)}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {isExpanded ? "Thu gọn" : "Xem chi tiết"}
                        </button>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              JSON.stringify(result.data || result.error, null, 2)
                            )
                          }
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <Copy size={14} />
                          Copy
                        </button>
                      </div>
                    </div>

                    {result.status === "success" && (
                      <div className="bg-green-50 p-4 rounded-lg">
                        <pre
                          className={`text-sm text-green-800 overflow-auto ${
                            isExpanded ? "" : "max-h-32"
                          }`}
                        >
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </div>
                    )}

                    {result.status === "error" && (
                      <div className="bg-red-50 p-4 rounded-lg">
                        <pre className="text-sm text-red-800 whitespace-pre-wrap">
                          {result.error}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}