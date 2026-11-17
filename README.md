# Sự trì hoãn ở giới trẻ — Nhóm 05

Bài thuyết trình dạng trang cuộn cho môn Kỹ năng thuyết trình.

## Chạy thử trên máy

Trình duyệt chặn module JS khi mở thẳng file, nên cần một máy chủ tĩnh:

```bash
python3 -m http.server 8000
```

Rồi mở http://localhost:8000. Cần có mạng để tải font từ Google Fonts.

## Đưa lên GitHub Pages

Đẩy cả thư mục lên một repo, vào **Settings → Pages**, chọn nhánh `main`, thư mục `/ (root)`.

## Điều khiển khi trình chiếu

Bài là một trang cuộn dài. Chỉ cần lăn chuột: các phần quan trọng được ghim lại và hiệu ứng chạy theo đúng độ lăn (điện thoại đổi giờ, mốc chạy quanh vòng lặp, hình người tô dần, biểu đồ vẽ ra, thẻ giải pháp trượt ngang…). Lăn ngược lên thì mọi thứ chạy lùi theo.

Bàn phím cũng dùng được: `↓` `PageDown` `Space` để cuộn xuống, `↑` `PageUp` để cuộn lên, `Home` / `End` về đầu / cuối trang, `F11` để toàn màn hình.

## Cấu trúc

```
index.html              nội dung 13 phần
css/goc.css             màu, chữ, bút dạ quang, câu số liệu
css/khung.css           thanh trên cùng, khung trang, phần được ghim khi cuộn
css/hieu-ung.css        ý chờ hiện khi cuộn tới, nét bút viết tay
css/trang/*.css         giao diện riêng của từng phần
js/main.js              điểm khởi động
js/cuon.js              bộ máy cuộn: tính tiến độ từng phần, báo cho hiệu ứng
js/but.js               nét bút viết tay: khoanh tròn, gạch chân, gạch xoá
js/tien-ich.js          số nhảy, hoạt cảnh, hàm tính tiến độ
js/trang/*.js           hiệu ứng theo cuộn của từng phần
js/du-lieu/ban-do.js    lưới chấm bản đồ thế giới (Natural Earth)
anh/                    ảnh minh hoạ (CC0, nguồn ghi trong anh/nguon.json)
```

## Thay ảnh

Ảnh nằm trong thư mục `anh/`. Muốn dùng ảnh của nhóm thì chép ảnh mới đè lên đúng tên tệp cũ (ví dụ `anh/co-don.jpg`), nên dùng ảnh ngang, rộng khoảng 1200–1800px.

## Thêm tên thành viên

Trong `index.html`, tìm `<ul class="thanh-vien">` ở phần Cảm ơn và thêm mỗi người một dòng `<li>Họ và tên</li>`.
