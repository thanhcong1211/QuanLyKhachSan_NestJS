"use client";

export default function Footer() {
  return (
    <>
    <section className="px-10 py-16 bg-white text-black">
        <h2 className="text-2xl font-semibold mb-6">Ở bất cứ đâu</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { img: "/ngoinha1.jpg", title: "Toàn bộ nhà" },
            { img: "/cho_o.jpg", title: "Chỗ ở độc đáo" },
            { img: "/trang_trai.jpg", title: "Trang trại và thiên nhiên" },
            { img: "/thucung.jpg", title: "Cho phép mang theo thú cưng" },
          ].map((item, i) => (
            <div key={i} className="cursor-pointer hover:opacity-80 transition">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.img}
                alt={item.title}
                className="rounded-xl w-full h-52 object-cover mb-2"
              />
              <p className="text-sm font-medium">{item.title}</p>
            </div>
          ))}
        </div>
      </section>

    <footer className="bg-gray-100 text-gray-600 text-sm mt-10 border-t">
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <h4 className="font-semibold mb-3">Hỗ trợ</h4>
          <ul className="space-y-2">
            <li>Trung tâm trợ giúp</li>
            <li>Thông tin an toàn</li>
            <li>Hỗ trợ người khuyết tật</li>
            <li>Tuỳ chọn hủy</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Cộng đồng</h4>
          <ul className="space-y-2">
            <li>Airbnb.org</li>
            <li>Chống phân biệt đối xử</li>
            <li>Đối tác du lịch</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Đón tiếp khách</h4>
          <ul className="space-y-2">
            <li>Thử cho thuê nhà</li>
            <li>Trung tâm tài nguyên</li>
            <li>Diễn đàn cộng đồng</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Giới thiệu</h4>
          <ul className="space-y-2">
            <li>Tin tức Airbnb</li>
            <li>Tính năng mới</li>
            <li>Nhà đầu tư</li>
            <li>Việc làm</li>
          </ul>
        </div>
      </div>

      <div className="border-t py-4 px-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Airbnb clone - Made with ❤️ by You.
      </div>
    </footer>
    </>
  );
}
