/* Bộ máy cuộn: mỗi khung hình tính tiến độ cuộn của từng phần (0 → 1) và báo cho hiệu ứng của phần đó.
   Phần ghim: 0 khi phần chạm đỉnh màn hình, 1 khi sắp cuộn qua hết.
   Phần thường: 0 khi mép trên vừa ló khỏi đáy màn hình, 1 khi mép dưới vừa khuất ở đỉnh. */
import { kep, chayDem, datLaiDem, giamChuyenDong } from './tien-ich.js';
import { xoaNetBut } from './but.js';

export function khoiDong(hieuUng) {
  const cacPhan = [...document.querySelectorAll('.phan')];
  const thanhTienDo = document.getElementById('tien-do');
  const thanhPhan = document.getElementById('thanh-phan');
  const hieu = (phan) => hieuUng[phan.dataset.hieuUng] || {};
  let cho = false;
  let tCu = performance.now();

  function capNhat(bayGio = performance.now()) {
    cho = false;
    const cao = innerHeight;
    let giua = null, conTroi = false;
    // Bánh xe chuột nhảy từng nấc: tiến độ hiển thị đuổi theo tiến độ thật, mỗi khung hình đi 20% quãng còn lại
    const dt = Math.min(64, Math.max(0, bayGio - tCu));
    tCu = bayGio;
    const he = giamChuyenDong ? 1 : 1 - Math.pow(.8, dt / 16.7);
    for (const phan of cacPhan) {
      const r = phan.getBoundingClientRect();
      const ghim = phan.classList.contains('ghim');
      const muc = ghim ? kep(-r.top / Math.max(1, r.height - cao)) : kep((cao - r.top) / (cao + r.height));
      const thay = r.bottom > 0 && r.top < cao;
      if (phan._p === undefined || !thay) phan._p = muc;
      else phan._p += (muc - phan._p) * he;
      if (Math.abs(muc - phan._p) < .0004) phan._p = muc; else conTroi = true;
      const p = phan._p;
      phan.style.setProperty('--p', p.toFixed(4));

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
    }
    const tong = document.documentElement.scrollHeight - cao;
    thanhTienDo.style.setProperty('--tien-do', tong > 0 ? (scrollY / tong).toFixed(4) : 0);
    if (giua && thanhPhan.textContent !== giua.dataset.ten) thanhPhan.textContent = giua.dataset.ten;
    if (conTroi) hen();
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
