/* Chữ ký "để mai tính" đi theo suốt bài, mỗi phần bị bút đỏ đánh dấu thêm một lần:
   1 nguyên vẹn · 2 gạch chân lượn sóng · 3 khoanh tròn, thêm dấu hỏi · 4 gạch ngang · 5 xoá hẳn, thay bằng "bắt đầu ngay". */
const THEO_PHAN = {
  'mo-dau': 0,
  'buoi-toi': 1, 'noi-dung': 1,
  'ban-chat': 2, 'con-so': 2, 'the-gioi': 2, 'dau-hieu': 2,
  'hoc-tap': 3, 'cuoc-song': 3,
  'cong-thuc': 4, 'giai-phap': 4,
  'ket': 5,
  'cam-on': 0,   // trang cảm ơn đã khép lại bằng "Hôm nay làm, không để mai"
};

export function ganChuKyBay() {
  const chuKy = document.getElementById('chu-ky-bay');
  document.addEventListener('doi-phan', (e) => {
    const moi = String(THEO_PHAN[e.detail.id] ?? 1);
    if (moi === chuKy.dataset.trangThai) return;
    const nay = +moi > +chuKy.dataset.trangThai && chuKy.dataset.trangThai !== '0';
    chuKy.dataset.trangThai = moi;
    if (nay) { chuKy.classList.remove('nay'); void chuKy.offsetWidth; chuKy.classList.add('nay'); }
  });
}
