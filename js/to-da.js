/* Bút dạ quang tự tô: chữ được đánh dấu (.da) quét một nét ngang từ trái sang phải
   khi đã lên tới vùng nhìn chính của màn hình, hoặc khi slide chứa nó đã đứng yên (phần ghim).
   Khuất khỏi màn hình thì xoá nét, lăn quay lại sẽ tô lại. */
import { giamChuyenDong } from './tien-ich.js';

const VUNG_NHIN = .68; // mép dưới chữ phải lên trên 68% chiều cao màn hình

export function ganToDa() {
  const cacNet = [...document.querySelectorAll('.phan .da')].map((el) => ({ el, phan: el.closest('.phan') }));
  if (giamChuyenDong) { cacNet.forEach(({ el }) => el.classList.add('da-chay')); return; }

  let cho = false;
  function kiem() {
    cho = false;
    const cao = innerHeight;
    const cuoiTrang = scrollY >= document.documentElement.scrollHeight - cao - 2;
    for (const { el, phan } of cacNet) {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > cao) { el.classList.remove('da-chay'); continue; }
      if (el.classList.contains('da-chay')) continue;
      const dungYen = phan.classList.contains('ghim') && phan.getBoundingClientRect().top <= 1;
      if (r.top >= 0 && (r.bottom <= cao * VUNG_NHIN || dungYen || cuoiTrang)) el.classList.add('da-chay');
    }
  }
  const hen = () => { if (!cho) { cho = true; requestAnimationFrame(kiem); } };
  addEventListener('scroll', hen, { passive: true });
  addEventListener('resize', hen);
  kiem();
}
