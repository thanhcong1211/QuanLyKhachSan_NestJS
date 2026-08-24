import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/user.entity';
import { Location } from '../locations/location.entity';
import { Room } from '../rooms/room.entity';
import { Booking } from '../bookings/booking.entity';
import { Comment } from '../comments/comment.entity';

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_DATABASE || 'airbnb_clone',
  entities: [User, Location, Room, Booking, Comment],
  synchronize: true,
});

const ADMIN_EMAIL = 'admin@airbnb-clone.local';
const ADMIN_PASSWORD = 'Admin@123';

// Ảnh thật từ Unsplash (đã curl kiểm tra HTTP 200 từng ID trước khi dùng)
const unsplash = (id: string, w = 900) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

const LOCATION_PHOTOS = [
  '1508009603885-50cf7c579365', // Hà Nội - phố
  '1528127269322-539801943592', // TP.HCM - đô thị
  '1524492412937-b28074a5d7da', // Đà Nẵng - biển
  '1528181304800-259b08848526', // Đà Lạt - đồi núi
  '1583417319070-4a69db38a482', // Hội An - phố cổ
  '1470004914212-05527e49370b', // Nha Trang - biển
  '1500835556837-99ac94a94552', // Phú Quốc - đảo
  '1476514525535-07fb3b4ae5f1', // Sa Pa - núi
];

const ROOM_PHOTOS = [
  '1560448204-e02f11c3d0e2', '1522708323590-d24dbb6b0267', '1502672260266-1c1ef2d93688',
  '1493809842364-78817add7ffb', '1512918728675-ed5a9ecdebfd', '1484154218962-a197022b5858',
  '1512917774080-9991f1c4c750', '1493663284031-b7e3aefcae8e', '1600585154340-be6161a56a0c',
  '1571003123894-1f0594d2b5d9', '1583608205776-bfd35f0d9f83', '1522771739844-6a9f6d5f14af',
  '1556020685-ae41abfc9365', '1502005229762-cf1b2da7c5d6', '1505691938895-1758d7feb511',
  '1620626011761-996317b8d101', '1615873968403-89e068629265', '1613977257363-707ba9348227',
  '1523217582562-09d0def993a6', '1560185127-6ed189bf02f4', '1505873242700-f289a29e1e0f',
  '1554995207-c18c203602cb', '1615529182904-14819c35db37', '1615874959474-d609969a20ed',
];

type Tier = 'budget' | 'mid' | 'lux';

const TIER_AMENITIES: Record<Tier, Omit<Room, 'id' | 'tenPhong' | 'khach' | 'phongNgu' | 'giuong' | 'phongTam' | 'moTa' | 'giaTien' | 'maViTri' | 'hinhAnh'>> = {
  budget: { wifi: true, dieuHoa: true, tivi: true, mayGiat: false, banLa: false, bep: false, doXe: false, hoBoi: false, banUi: false },
  mid: { wifi: true, dieuHoa: true, tivi: true, mayGiat: true, banLa: true, bep: true, doXe: true, hoBoi: false, banUi: true },
  lux: { wifi: true, dieuHoa: true, tivi: true, mayGiat: true, banLa: true, bep: true, doXe: true, hoBoi: true, banUi: true },
};

interface LocationSeed {
  tenViTri: string;
  tinhThanh: string;
  quocGia: string;
  rooms: {
    tenPhong: string;
    moTa: string;
    giaTien: number;
    tier: Tier;
    khach: number;
    phongNgu: number;
    giuong: number;
    phongTam: number;
  }[];
}

const LOCATIONS: LocationSeed[] = [
  {
    tenViTri: 'Hà Nội', tinhThanh: 'Hà Nội', quocGia: 'Việt Nam',
    rooms: [
      { tenPhong: 'Phòng trọ nhỏ gần Hồ Gươm', moTa: 'Phòng nhỏ gọn cách Hồ Gươm 5 phút đi bộ, phù hợp khách du lịch bụi muốn khám phá phố cổ.', giaTien: 280000, tier: 'budget', khach: 2, phongNgu: 1, giuong: 1, phongTam: 1 },
      { tenPhong: 'Căn hộ 2 phòng ngủ view Hồ Tây', moTa: 'Căn hộ thoáng mát nhìn ra Hồ Tây, đầy đủ bếp và máy giặt, thích hợp cho gia đình nhỏ ở vài ngày.', giaTien: 750000, tier: 'mid', khach: 4, phongNgu: 2, giuong: 2, phongTam: 1 },
      { tenPhong: 'Penthouse cao cấp phố cổ Hà Nội', moTa: 'Penthouse sang trọng giữa lòng phố cổ, ban công rộng ngắm toàn cảnh Hà Nội về đêm, dịch vụ 5 sao.', giaTien: 2200000, tier: 'lux', khach: 6, phongNgu: 3, giuong: 3, phongTam: 2 },
    ],
  },
  {
    tenViTri: 'TP. Hồ Chí Minh', tinhThanh: 'TP. Hồ Chí Minh', quocGia: 'Việt Nam',
    rooms: [
      { tenPhong: 'Studio giá rẻ Quận 1 gần chợ Bến Thành', moTa: 'Studio nhỏ xinh ngay trung tâm Quận 1, đi bộ tới chợ Bến Thành và phố đi bộ Nguyễn Huệ.', giaTien: 320000, tier: 'budget', khach: 2, phongNgu: 1, giuong: 1, phongTam: 1 },
      { tenPhong: 'Căn hộ hiện đại view Landmark 81', moTa: 'Căn hộ nội thất hiện đại, cửa sổ lớn nhìn thẳng ra Landmark 81, gần nhiều quán cà phê và trung tâm thương mại.', giaTien: 950000, tier: 'mid', khach: 4, phongNgu: 2, giuong: 2, phongTam: 2 },
      { tenPhong: 'Villa sang trọng Thảo Điền có hồ bơi riêng', moTa: 'Villa biệt lập tại khu Thảo Điền yên tĩnh, hồ bơi riêng, sân vườn rộng, phù hợp nhóm bạn hoặc gia đình lớn.', giaTien: 3200000, tier: 'lux', khach: 8, phongNgu: 4, giuong: 4, phongTam: 3 },
    ],
  },
  {
    tenViTri: 'Đà Nẵng', tinhThanh: 'Đà Nẵng', quocGia: 'Việt Nam',
    rooms: [
      { tenPhong: 'Phòng đơn giá tốt gần cầu Rồng', moTa: 'Phòng đơn giản, sạch sẽ, cách cầu Rồng vài phút đi xe, gần khu ăn uống về đêm.', giaTien: 260000, tier: 'budget', khach: 2, phongNgu: 1, giuong: 1, phongTam: 1 },
      { tenPhong: 'Căn hộ 2 phòng ngủ sát biển Mỹ Khê', moTa: 'Căn hộ cách bãi biển Mỹ Khê chỉ vài bước chân, ban công đón gió biển, đầy đủ tiện nghi nấu ăn.', giaTien: 820000, tier: 'mid', khach: 4, phongNgu: 2, giuong: 2, phongTam: 1 },
      { tenPhong: 'Villa biển 4 phòng ngủ hồ bơi vô cực', moTa: 'Villa mặt biển với hồ bơi vô cực nhìn ra Thái Bình Dương, không gian sang trọng cho kỳ nghỉ gia đình.', giaTien: 2800000, tier: 'lux', khach: 8, phongNgu: 4, giuong: 4, phongTam: 3 },
    ],
  },
  {
    tenViTri: 'Đà Lạt', tinhThanh: 'Lâm Đồng', quocGia: 'Việt Nam',
    rooms: [
      { tenPhong: 'Homestay nhỏ xinh giữa rừng thông', moTa: 'Homestay ấm cúng nằm giữa rừng thông, không khí trong lành, thích hợp trốn phố về với thiên nhiên.', giaTien: 240000, tier: 'budget', khach: 2, phongNgu: 1, giuong: 1, phongTam: 1 },
      { tenPhong: 'Nhà gỗ 2 tầng view đồi chè Cầu Đất', moTa: 'Nhà gỗ ấm áp view đồi chè Cầu Đất bạt ngàn, sáng sớm có sương mù bảng lảng rất thơ mộng.', giaTien: 680000, tier: 'mid', khach: 4, phongNgu: 2, giuong: 2, phongTam: 1 },
      { tenPhong: 'Villa Đà Lạt phong cách châu Âu sân vườn rộng', moTa: 'Villa kiến trúc châu Âu cổ điển, sân vườn hoa rộng rãi, lò sưởi ấm cúng cho những đêm se lạnh.', giaTien: 1900000, tier: 'lux', khach: 6, phongNgu: 3, giuong: 3, phongTam: 2 },
    ],
  },
  {
    tenViTri: 'Hội An', tinhThanh: 'Quảng Nam', quocGia: 'Việt Nam',
    rooms: [
      { tenPhong: 'Phòng trọ yên tĩnh gần phố cổ', moTa: 'Phòng nhỏ yên tĩnh cách phố cổ Hội An 10 phút đi bộ, giá hợp lý cho khách đi một mình.', giaTien: 220000, tier: 'budget', khach: 2, phongNgu: 1, giuong: 1, phongTam: 1 },
      { tenPhong: 'Nhà vườn truyền thống gần chùa Cầu', moTa: 'Nhà vườn kiến trúc truyền thống, sân trong rợp bóng cây, chỉ vài bước chân tới Chùa Cầu nổi tiếng.', giaTien: 700000, tier: 'mid', khach: 4, phongNgu: 2, giuong: 2, phongTam: 1 },
      { tenPhong: 'Biệt thự ven sông Hoài đèn lồng lung linh', moTa: 'Biệt thự view sông Hoài, buổi tối ngắm đèn lồng lung linh ngay từ ban công, không gian lãng mạn.', giaTien: 2100000, tier: 'lux', khach: 6, phongNgu: 3, giuong: 3, phongTam: 2 },
    ],
  },
  {
    tenViTri: 'Nha Trang', tinhThanh: 'Khánh Hòa', quocGia: 'Việt Nam',
    rooms: [
      { tenPhong: 'Phòng nghỉ tiết kiệm cách biển 5 phút', moTa: 'Phòng nghỉ đơn giản, sạch sẽ, chỉ mất 5 phút đi bộ ra bãi biển Trần Phú.', giaTien: 270000, tier: 'budget', khach: 2, phongNgu: 1, giuong: 1, phongTam: 1 },
      { tenPhong: 'Căn hộ view biển 2 phòng ngủ Trần Phú', moTa: 'Căn hộ cao tầng view trọn vịnh biển Nha Trang, gần công viên và các nhà hàng hải sản nổi tiếng.', giaTien: 880000, tier: 'mid', khach: 4, phongNgu: 2, giuong: 2, phongTam: 1 },
      { tenPhong: 'Penthouse Nha Trang view toàn cảnh vịnh biển', moTa: 'Penthouse tầng cao nhất toà nhà, tầm nhìn 180 độ ra vịnh Nha Trang, hồ bơi trên sân thượng.', giaTien: 2600000, tier: 'lux', khach: 6, phongNgu: 3, giuong: 3, phongTam: 2 },
    ],
  },
  {
    tenViTri: 'Phú Quốc', tinhThanh: 'Kiên Giang', quocGia: 'Việt Nam',
    rooms: [
      { tenPhong: 'Bungalow đơn giản gần chợ đêm Dương Đông', moTa: 'Bungalow nhỏ gọn gần chợ đêm Dương Đông, thuận tiện ăn uống và mua sắm đặc sản.', giaTien: 300000, tier: 'budget', khach: 2, phongNgu: 1, giuong: 1, phongTam: 1 },
      { tenPhong: 'Villa 2 phòng ngủ gần bãi Sao', moTa: 'Villa nhỏ cách bãi Sao vài phút chạy xe, sân vườn nhiệt đới, không gian riêng tư yên tĩnh.', giaTien: 1100000, tier: 'mid', khach: 4, phongNgu: 2, giuong: 2, phongTam: 2 },
      { tenPhong: 'Resort villa 4 phòng ngủ riêng tư sát biển', moTa: 'Villa nghỉ dưỡng cao cấp nằm sát bãi biển, hồ bơi riêng, dịch vụ quản gia, tiêu chuẩn resort 5 sao.', giaTien: 3500000, tier: 'lux', khach: 8, phongNgu: 4, giuong: 4, phongTam: 3 },
    ],
  },
  {
    tenViTri: 'Sa Pa', tinhThanh: 'Lào Cai', quocGia: 'Việt Nam',
    rooms: [
      { tenPhong: "Homestay người H'Mông giữa ruộng bậc thang", moTa: "Homestay truyền thống của người H'Mông, nằm giữa ruộng bậc thang xanh mướt, trải nghiệm văn hoá bản địa.", giaTien: 230000, tier: 'budget', khach: 2, phongNgu: 1, giuong: 1, phongTam: 1 },
      { tenPhong: 'Nhà sàn gỗ view thung lũng Mường Hoa', moTa: 'Nhà sàn gỗ ấm cúng, cửa sổ lớn nhìn xuống thung lũng Mường Hoa mờ sương, yên bình tuyệt đối.', giaTien: 650000, tier: 'mid', khach: 4, phongNgu: 2, giuong: 2, phongTam: 1 },
      { tenPhong: 'Villa núi cao cấp ngắm mây Fansipan', moTa: 'Villa cao cấp trên sườn núi, sáng sớm có thể ngắm biển mây và đỉnh Fansipan từ phòng ngủ.', giaTien: 1800000, tier: 'lux', khach: 6, phongNgu: 3, giuong: 3, phongTam: 2 },
    ],
  },
];

interface UserSeed {
  name: string;
  email: string;
  phone: string;
  birthday: string;
  gender: boolean;
  avatarImg: number;
}

const REGULAR_USERS: UserSeed[] = [
  { name: 'Nguyễn Văn An', email: 'nguyenvanan@example.com', phone: '0912345671', birthday: '1995-03-12', gender: true, avatarImg: 12 },
  { name: 'Trần Thị Bình', email: 'tranthibinh@example.com', phone: '0912345672', birthday: '1997-07-22', gender: false, avatarImg: 47 },
  { name: 'Lê Hoàng Cường', email: 'lehoangcuong@example.com', phone: '0912345673', birthday: '1992-11-05', gender: true, avatarImg: 32 },
  { name: 'Phạm Thị Dung', email: 'phamthidung@example.com', phone: '0912345674', birthday: '1999-01-18', gender: false, avatarImg: 45 },
  { name: 'Hoàng Văn Em', email: 'hoangvanem@example.com', phone: '0912345675', birthday: '1994-09-30', gender: true, avatarImg: 33 },
  { name: 'Vũ Thị Phương', email: 'vuthiphuong@example.com', phone: '0912345676', birthday: '1998-05-14', gender: false, avatarImg: 44 },
  { name: 'Đặng Minh Giang', email: 'dangminhgiang@example.com', phone: '0912345677', birthday: '1996-12-08', gender: true, avatarImg: 15 },
  { name: 'Bùi Thị Hoa', email: 'buithihoa@example.com', phone: '0912345678', birthday: '2000-02-25', gender: false, avatarImg: 49 },
  { name: 'Ngô Quốc Huy', email: 'ngoquochuy@example.com', phone: '0912345679', birthday: '1993-06-19', gender: true, avatarImg: 53 },
];

const COMMENT_POOL: { text: string; rating: number }[] = [
  { text: 'Phòng sạch sẽ, đúng như hình, chủ nhà nhiệt tình hỗ trợ.', rating: 5 },
  { text: 'Vị trí thuận tiện, gần trung tâm, dễ di chuyển.', rating: 5 },
  { text: 'Không gian thoáng mát, view đẹp, chắc chắn sẽ quay lại.', rating: 5 },
  { text: 'Giá hợp lý so với chất lượng phòng, rất đáng tiền.', rating: 4 },
  { text: 'Wifi mạnh, tiện nghi đầy đủ, phù hợp cho cả gia đình.', rating: 5 },
  { text: 'Phòng hơi nhỏ nhưng sạch sẽ, chủ nhà thân thiện.', rating: 4 },
  { text: 'Checkin nhanh gọn, hướng dẫn chi tiết, rất chuyên nghiệp.', rating: 5 },
  { text: 'Giường êm, phòng tắm sạch, đáng để trải nghiệm thử.', rating: 4 },
  { text: 'Hơi ồn một chút vào buổi tối nhưng nhìn chung ổn.', rating: 3 },
  { text: 'Đồ đạc hơi cũ nhưng vẫn dùng tốt, giá cả phù hợp.', rating: 3 },
  { text: 'Tuyệt vời! Đúng như mong đợi, sẽ giới thiệu cho bạn bè.', rating: 5 },
  { text: 'View từ ban công siêu đẹp, chụp ảnh cực chill.', rating: 5 },
  { text: 'Bếp đầy đủ dụng cụ, nấu ăn thoải mái cho cả nhóm.', rating: 4 },
  { text: 'Hồ bơi sạch, an ninh tốt, rất phù hợp để nghỉ dưỡng.', rating: 5 },
  { text: 'Phòng ở tạm ổn nhưng điều hòa hơi yếu vào buổi trưa.', rating: 3 },
  { text: 'Chủ nhà phản hồi tin nhắn rất nhanh, hỗ trợ nhiệt tình.', rating: 5 },
  { text: 'Không gian ấm cúng, rất phù hợp cho kỳ nghỉ gia đình.', rating: 5 },
  { text: 'Địa điểm hơi xa trung tâm nhưng bù lại yên tĩnh, dễ chịu.', rating: 4 },
  { text: 'Rất hài lòng, phòng đẹp hơn cả hình chụp trên web.', rating: 5 },
  { text: 'Dịch vụ ổn, giá tốt, sẽ cân nhắc quay lại vào dịp khác.', rating: 4 },
  { text: 'Nệm hơi cứng nhưng tổng thể trải nghiệm vẫn tốt.', rating: 3 },
  { text: 'Ban quản lý hỗ trợ tốt, khu vực an ninh, đỗ xe thoải mái.', rating: 4 },
];

function iso(y: number, m: number, d: number, h = 9) {
  return new Date(Date.UTC(y, m - 1, d, h, 0, 0)).toISOString();
}
function ymd(y: number, m: number, d: number) {
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

async function seed() {
  await dataSource.initialize();
  console.log('Đã kết nối MySQL, xoá dữ liệu cũ và seed lại từ đầu...');

  const userRepo = dataSource.getRepository(User);
  const locationRepo = dataSource.getRepository(Location);
  const roomRepo = dataSource.getRepository(Room);
  const bookingRepo = dataSource.getRepository(Booking);
  const commentRepo = dataSource.getRepository(Comment);

  // Xoá sạch + reset AUTO_INCREMENT về 1 (TRUNCATE, không phải DELETE) — đây
  // chỉ là dữ liệu demo cục bộ, và các cột maPhong/maViTri/... chỉ là int
  // thường (không có FK constraint thật) nên TRUNCATE không bị chặn.
  await commentRepo.query('TRUNCATE TABLE binh_luan');
  await bookingRepo.query('TRUNCATE TABLE dat_phong');
  await roomRepo.query('TRUNCATE TABLE phong_thue');
  await locationRepo.query('TRUNCATE TABLE vi_tri');
  await userRepo.query('TRUNCATE TABLE users');

  // --- Users ---
  const admin = await userRepo.save(
    userRepo.create({
      name: 'Quản trị viên',
      email: ADMIN_EMAIL,
      password: await bcrypt.hash(ADMIN_PASSWORD, 10),
      phone: '0900000000',
      birthday: '1990-01-01',
      role: 'ADMIN',
      gender: true,
      avatar: 'https://i.pravatar.cc/150?img=68',
    }),
  );
  console.log(`✔ Tạo tài khoản ADMIN: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);

  const users: User[] = [admin];
  for (const u of REGULAR_USERS) {
    const saved = await userRepo.save(
      userRepo.create({
        name: u.name,
        email: u.email,
        password: await bcrypt.hash('User@123', 10),
        phone: u.phone,
        birthday: u.birthday,
        gender: u.gender,
        role: 'USER',
        avatar: `https://i.pravatar.cc/150?img=${u.avatarImg}`,
      }),
    );
    users.push(saved);
  }
  console.log(`✔ Tạo ${users.length} người dùng (1 admin + ${users.length - 1} user thường)`);

  // --- Locations ---
  const locations: Location[] = [];
  for (let i = 0; i < LOCATIONS.length; i++) {
    const l = LOCATIONS[i];
    const saved = await locationRepo.save(
      locationRepo.create({
        tenViTri: l.tenViTri,
        tinhThanh: l.tinhThanh,
        quocGia: l.quocGia,
        hinhAnh: unsplash(LOCATION_PHOTOS[i], 1000),
      }),
    );
    locations.push(saved);
  }
  console.log(`✔ Tạo ${locations.length} vị trí`);

  // --- Rooms ---
  const rooms: Room[] = [];
  let photoIdx = 0;
  for (let i = 0; i < LOCATIONS.length; i++) {
    const l = LOCATIONS[i];
    const location = locations[i];
    for (const r of l.rooms) {
      const amenities = TIER_AMENITIES[r.tier];
      const saved = await roomRepo.save(
        roomRepo.create({
          tenPhong: r.tenPhong,
          khach: r.khach,
          phongNgu: r.phongNgu,
          giuong: r.giuong,
          phongTam: r.phongTam,
          moTa: r.moTa,
          giaTien: r.giaTien,
          maViTri: location.id,
          hinhAnh: unsplash(ROOM_PHOTOS[photoIdx % ROOM_PHOTOS.length]),
          ...amenities,
        }),
      );
      rooms.push(saved);
      photoIdx++;
    }
  }
  console.log(`✔ Tạo ${rooms.length} phòng trải đều ${locations.length} vị trí`);

  // --- Bookings: rải Feb-Jul 2026 (quá khứ gần, để biểu đồ dashboard có dữ liệu) + vài booking tương lai ---
  const pastMonths = [2, 3, 4, 5, 6, 7]; // Feb -> Jul 2026
  const bookingsToCreate: { checkInY: number; checkInM: number; checkInD: number; nights: number }[] = [];
  let dayCursor = 3;
  for (const m of pastMonths) {
    for (let k = 0; k < 5; k++) {
      const d = Math.min(26, dayCursor + k * 4);
      bookingsToCreate.push({ checkInY: 2026, checkInM: m, checkInD: d, nights: 2 + (k % 4) });
    }
  }
  // vài booking tương lai gần (tháng 8)
  for (let k = 0; k < 4; k++) {
    bookingsToCreate.push({ checkInY: 2026, checkInM: 8, checkInD: 3 + k * 6, nights: 2 + k });
  }

  let bi = 0;
  for (const b of bookingsToCreate) {
    const room = rooms[bi % rooms.length];
    const user = users[(bi * 3 + 1) % users.length];
    const checkInDate = new Date(Date.UTC(b.checkInY, b.checkInM - 1, b.checkInD));
    const checkOutDate = new Date(checkInDate.getTime() + b.nights * 24 * 60 * 60 * 1000);
    await bookingRepo.save(
      bookingRepo.create({
        maPhong: room.id,
        ngayDen: ymd(checkInDate.getUTCFullYear(), checkInDate.getUTCMonth() + 1, checkInDate.getUTCDate()),
        ngayDi: ymd(checkOutDate.getUTCFullYear(), checkOutDate.getUTCMonth() + 1, checkOutDate.getUTCDate()),
        soLuongKhach: Math.max(1, Math.min(room.khach, 1 + (bi % 4))),
        maNguoiDung: user.id,
      }),
    );
    bi++;
  }
  console.log(`✔ Tạo ${bookingsToCreate.length} booking (rải Feb-Jul 2026 + vài booking tháng 8)`);

  // --- Comments: 2-4 bình luận / phòng ---
  let commentCount = 0;
  let poolCursor = 0;
  let userCursor = 1; // bỏ qua admin làm người bình luận chính
  for (let ri = 0; ri < rooms.length; ri++) {
    const room = rooms[ri];
    const numComments = 2 + (ri % 3); // 2..4
    for (let c = 0; c < numComments; c++) {
      const template = COMMENT_POOL[poolCursor % COMMENT_POOL.length];
      const user = users[userCursor % users.length];
      const month = 2 + ((ri + c) % 6); // Feb..Jul
      const day = 5 + ((ri * 3 + c * 7) % 22);
      await commentRepo.save(
        commentRepo.create({
          maPhong: room.id,
          maNguoiBinhLuan: user.id,
          ngayBinhLuan: iso(2026, month, day, 10 + (c % 8)),
          noiDung: template.text,
          saoBinhLuan: template.rating,
        }),
      );
      poolCursor++;
      userCursor++;
      commentCount++;
    }
  }
  console.log(`✔ Tạo ${commentCount} bình luận rải đều ${rooms.length} phòng`);

  console.log('Seed hoàn tất.');
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('Seed thất bại:', err);
  process.exit(1);
});
