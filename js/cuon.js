/* Bộ máy cuộn: mỗi khung hình tính tiến độ cuộn của từng phần (0 → 1) và báo cho hiệu ứng của phần đó.
   Phần ghim: 0 khi phần chạm đỉnh màn hình, 1 khi sắp cuộn qua hết.
   Phần thường: 0 khi mép trên vừa ló khỏi đáy màn hình, 1 khi mép dưới vừa khuất ở đỉnh. */
import { kep, chayDem, datLaiDem } from './tien-ich.js';
import { xoaNetBut } from './but.js';

export function khoiDong(hieuUng) {
  const cacPhan = [...document.querySelectorAll('.phan')];
  const thanhTienDo = document.getElementById('tien-do');
  const thanhPhan = document.getElementById('thanh-phan');
  const thanhTren = document.querySelector('.thanh-tren');
  const hieu = (phan) => hieuUng[phan.dataset.hieuUng] || {};
  let cho = false;
  let phanGiua = null;

  // Độ mượt nằm ở chính việc cuộn (js/cuon-muot.js), nên hiệu ứng bám đúng vị trí cuộn, không trễ thêm
  function capNhat() {
    cho = false;
    const cao = innerHeight;
    let giua = null, toiDuoiThanh = false, toiDuoiGoc = false;
    for (const phan of cacPhan) {
      const r = phan.getBoundingClientRect();
      const ghim = phan.classList.contains('ghim');
      const p = ghim ? kep(-r.top / Math.max(1, r.height - cao)) : kep((cao - r.top) / (cao + r.height));
      const thay = r.bottom > 0 && r.top < cao;
      const chuoi = p.toFixed(3);
      if (thay && phan._pGhi !== chuoi) { phan._pGhi = chuoi; phan.style.setProperty('--p', chuoi); }

      // Vào phần: chạy số nhảy, nét dạ quang, hiệu ứng riêng. Ra hẳn khỏi màn hình thì đặt lại để lần sau chạy lại.
      const trongMan = r.bottom > cao * .25 && r.top < cao * .75;
      if (trongMan && !phan.classList.contains('dang-xem')) {
        phan.classList.add('dang-xem');
        phan.querySelectorAll('.dem').forEach((el) => { if (!el.closest('[data-cho]')) chayDem(el); });
        hieu(phan).vao?.(phan);
      } else if ((r.bottom < 0 || r.top > cao) && phan.classList.contains('dang-xem')) {
        phan.classList.remove('dang-xem');
        phan.querySelectorAll('.dem').forEach(datLaiDem);
        phan.querySelectorAll('[data-cho].bat').forEach((el) => el.classList.remove('bat'));
        xoaNetBut(phan.querySelector('.dinh') || phan);
        hieu(phan).roi?.(phan);
      }
      if (r.bottom > 0 && r.top < cao) hieu(phan).tien?.(p, phan);
      if (r.top <= cao / 2 && r.bottom > cao / 2) giua = phan;
      // Phần nằm ngay dưới thanh trên cùng có nền tối (ảnh đêm) thì chữ thanh chuyển trắng
      const toi = phan.classList.contains('toi') || (phan.id === 'mo-dau' && p > .55);
      if (r.top <= 30 && r.bottom > 30) toiDuoiThanh = toi;
      if (r.top <= cao - 40 && r.bottom > cao - 40) toiDuoiGoc = toi;
    }
    const tong = document.documentElement.scrollHeight - cao;
    thanhTienDo.style.setProperty('--tien-do', tong > 0 ? (scrollY / tong).toFixed(4) : 0);
    if (giua && thanhPhan.textContent !== giua.dataset.ten) thanhPhan.textContent = giua.dataset.ten;
    if (giua && giua !== phanGiua) { phanGiua = giua; document.dispatchEvent(new CustomEvent('doi-phan', { detail: giua })); }
    document.getElementById('chu-ky-bay')?.classList.toggle('sang', toiDuoiGoc);
    thanhTren.classList.toggle('sang', toiDuoiThanh);
  }

  // Phần ghim có nội dung cao hơn màn hình (máy nhỏ, thanh công cụ trình duyệt chiếm chỗ): thu nhỏ cho vừa
  function doVua() {
    document.querySelectorAll('.phan.ghim .dinh > .khung').forEach((khung) => {
      const dinh = khung.parentElement;
      khung.style.setProperty('--vua', 1);
      const cs = getComputedStyle(dinh);
      const cho = dinh.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      const can = khung.scrollHeight;
      if (can > cho + 1) khung.style.setProperty('--vua', ((cho / can) * .96).toFixed(3));
    });
  }

  const hen = () => { if (!cho) { cho = true; requestAnimationFrame(capNhat); } };
  addEventListener('scroll', hen, { passive: true });
  addEventListener('resize', () => { cacPhan.forEach((p) => hieu(p).doKich?.(p)); doVua(); hen(); });
  cacPhan.forEach((p) => hieu(p).doKich?.(p));
  doVua();
  capNhat();
  document.fonts?.ready.then(() => { cacPhan.forEach((p) => hieu(p).doKich?.(p)); doVua(); capNhat(); });
}
