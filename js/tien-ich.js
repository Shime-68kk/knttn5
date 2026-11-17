/* Các hàm dùng chung cho mọi trang. */

// Tắt chuyển động khi người xem chọn giảm chuyển động, hoặc khi chụp ảnh kiểm tra (?chup)
export const giamChuyenDong = matchMedia('(prefers-reduced-motion: reduce)').matches
  || document.documentElement.classList.contains('chup');

export const haiSo = (n) => String(n).padStart(2, '0');

/* ---------- Số nhảy: <span class="dem" data-den="95" data-tu="0" data-tg="1800" data-thap-phan="0"> ---------- */
const dinhDang = (so, thapPhan) =>
  so.toLocaleString('vi-VN', { minimumFractionDigits: thapPhan, maximumFractionDigits: thapPhan });

export function chayDem(el) {
  const den = parseFloat(el.dataset.den);
  const tu = parseFloat(el.dataset.tu || 0);
  const thapPhan = parseInt(el.dataset.thapPhan || 0, 10);
  const thoiGian = parseInt(el.dataset.tg || 1800, 10);
  cancelAnimationFrame(el._raf);
  if (giamChuyenDong) { el.textContent = dinhDang(den, thapPhan); return; }
  const batDau = performance.now();
  const buoc = (bayGio) => {
    const t = Math.min(1, (bayGio - batDau) / thoiGian);
    const e = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    el.textContent = dinhDang(tu + (den - tu) * e, thapPhan);
    if (t < 1) el._raf = requestAnimationFrame(buoc);
  };
  el._raf = requestAnimationFrame(buoc);
}

export function datLaiDem(el) {
  cancelAnimationFrame(el._raf);
  el.textContent = dinhDang(parseFloat(el.dataset.tu || 0), parseInt(el.dataset.thapPhan || 0, 10));
}

/** Chạy một hàm theo khung hình trong `thoiGian` ms, truyền vào tiến độ đã làm mượt (0 → 1). */
export function hoatCanh(thoiGian, moiKhung, lamMuot = (t) => 1 - Math.pow(1 - t, 3)) {
  const batDau = performance.now();
  let raf;
  const chay = (bayGio) => {
    const t = giamChuyenDong ? 1 : Math.min(1, (bayGio - batDau) / thoiGian);
    moiKhung(lamMuot(t));
    if (t < 1) raf = requestAnimationFrame(chay);
  };
  raf = requestAnimationFrame(chay);
  return () => cancelAnimationFrame(raf);
}

export const kep = (x, thap = 0, cao = 1) => Math.min(cao, Math.max(thap, x));

/** Tiến độ con trong một đoạn [tu, den] của tiến độ cha, kết quả 0 → 1. */
export const doan = (p, tu, den) => kep((p - tu) / (den - tu));

/** Hiện hoặc ẩn một ý chờ (data-cho). Lần đầu hiện thì chạy số nhảy và vẽ nét bút bên trong. */
export function batKhi(el, dieuKien, veBut) {
  const dangBat = el.classList.contains('bat');
  if (dieuKien === dangBat) return;
  el.classList.toggle('bat', dieuKien);
  el.querySelectorAll('.dem').forEach(dieuKien ? chayDem : datLaiDem);
  veBut?.(dieuKien);
}
