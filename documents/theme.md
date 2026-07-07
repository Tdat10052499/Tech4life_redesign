# Tech4life 2026 - Design System & Theme Guidelines

Tài liệu này định nghĩa hệ thống thiết kế (Design System) chuẩn mực dựa trên bản thiết kế tổng thể của sự kiện Tech4life 2026. Vui lòng tuân thủ nghiêm ngặt các quy tắc dưới đây trong quá trình chuyển đổi sang HTML/Tailwind CSS.

## 1. Bảng màu cốt lõi (Color Palette)

Dựa trên phân tích hình ảnh thiết kế, dưới đây là các mã màu Hex chính xác sẽ được sử dụng cho toàn bộ dự án.

### Cấu hình Tailwind CSS (`tailwind.config.js`)
Bạn có thể copy trực tiếp Object dưới đây vào file `tailwind.config.js` của dự án:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB', // Xanh hoàng gia (Royal Blue) - Dùng cho nút bấm, icon, điểm nhấn
          dark: '#1E3A8A',    // Xanh dương đậm (Deep Blue) - Dùng cho Heading chính, header
        },
        secondary: {
          DEFAULT: '#60A5FA', // Xanh lam sáng - Dùng cho các chi tiết phụ
          gradientStart: '#E0E7FF', // Tím nhạt - Dùng cho gradient đầu trang
          gradientEnd: '#DBEAFE',   // Xanh nhạt - Dùng cho gradient đầu trang
        },
        background: {
          DEFAULT: '#FFFFFF', // Trắng - Nền mặc định
          alt: '#F8FAFC',     // Xám nhạt - Dùng cho các section xen kẽ
          footer: '#0F172A',  // Xanh đen đậm - Nền của footer
        },
        text: {
          main: '#334155',    // Xám đậm - Dùng cho body text
          muted: '#64748B',   // Xám nhạt hơn - Dùng cho text phụ, chú thích
          heading: '#1E3A8A', // Xanh dương đậm - Dùng cho tiêu đề (H1, H2, H3)
        }
      }
    }
  }
}
```

## 2. Kiểu chữ (Typography)

Dự án ưu tiên sử dụng font chữ Sans-serif hiện đại, rõ ràng và mang đậm chất công nghệ.

- **Font chữ đề xuất:** **Inter** (Lựa chọn số 1) hoặc **Roboto**.
- **Cấu hình Google Fonts:** `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">`

### Tailwind Classes chuẩn cho Typography:

- **H1 (Tiêu đề trang):**
  `text-4xl md:text-5xl font-bold text-primary-dark tracking-tight leading-tight`
- **H2 (Tiêu đề Section):**
  `text-3xl md:text-4xl font-bold text-primary-dark mb-6`
- **H3 (Tiêu đề Card/Mục nhỏ):**
  `text-xl md:text-2xl font-semibold text-primary mb-4`
- **Body Text (Nội dung thông thường):**
  `text-base text-text-main leading-relaxed`
- **Text phụ (Caption/Muted):**
  `text-sm text-text-muted`

## 3. Thành phần UI (UI Components Style)

Đảm bảo tính đồng nhất cho các thành phần UI xuyên suốt các trang.

### Nút bấm (Buttons)
Các nút bấm kêu gọi hành động (Call to action) cần nổi bật và đồng nhất:
- **Primary Button (Nút chính):**
  `bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-8 rounded-full shadow-md hover:shadow-lg transition-all duration-300`
- **Secondary Button (Nút phụ):**
  `bg-white text-primary border border-primary hover:bg-background-alt font-semibold py-3 px-8 rounded-full shadow-sm transition-all duration-300`

*(Lưu ý: Sử dụng `rounded-full` để tạo độ bo góc mềm mại, phù hợp với phong cách thiết kế hiện đại của sự kiện).*

### Thẻ (Cards)
Dùng cho các khối thông tin như: Diễn giả, Lịch trình, Gian hàng triển lãm...
- **Card tiêu chuẩn:**
  `bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.15)] border border-gray-100 p-6 md:p-8 transition-shadow duration-300`

### Khoảng cách (Spacing & Layout)
- **Container chính:**
  Sử dụng class `container mx-auto px-4 md:px-8 lg:px-12` để căn giữa và tạo khoảng cách 2 bên.
- **Khoảng cách giữa các Section lớn:**
  Bắt buộc sử dụng `py-16 md:py-20` (padding top & bottom) để tạo không gian thở (white-space) rộng rãi, sang trọng.
- **Khoảng cách giữa các phần tử bên trong Section:**
  Sử dụng các class `gap-6`, `gap-8` (cho grid/flex) và `mb-8`, `mb-12` để phân tách nội dung.

## 4. Quy định quản lý tài nguyên (Strict Asset Rules)

> [!CAUTION]
> **QUY TẮC BẤT DI BẤT DỊCH - BẮT BUỘC TUÂN THỦ:**

1. **Logo Sự Kiện & Đơn Vị Tổ Chức:** Trong mọi section (header, footer, đối tác), **BẮT BUỘC** phải sử dụng đúng bộ logo chuẩn của **VINASA** và **Tech4life** được cung cấp trong thư mục tài nguyên dự án (`assets/images/logos/`).
2. **Mã QR Code:** Bắt buộc sử dụng **Mã QR code gốc** của dự án (nếu có trong `assets/images/qr/`). **TUYỆT ĐỐI KHÔNG** tự ý chèn ảnh placeholder hoặc sinh mã QR giả lập/fake thông qua các thư viện bên ngoài trong quá trình code HTML.
3. **Hình ảnh minh họa:** Nếu chưa có hình ảnh thực tế, chỉ được sử dụng các hình ảnh chuẩn từ kho tài nguyên (`assets/images/`) hoặc để trống cấu trúc HTML. **KHÔNG** sử dụng các ảnh placeholder (như `via.placeholder.com` hay Unsplash) không liên quan đến sự kiện.
