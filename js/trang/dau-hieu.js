/* Dấu hiệu: mỗi dòng được bút đỏ tick khi cuộn qua giữa màn hình. */
import { batKhi } from '../tien-ich.js';

export default function taoDauHieu() {
  const phan = document.getElementById('dau-hieu');
  const dong = [...phan.querySelectorAll('.ds-dau-hieu li')];
  const cauHoi = phan.querySelector('.cau-hoi');

  return {
    tien() {
      const vach = innerHeight * .62;
      dong.forEach((li) => li.classList.toggle('bat', li.getBoundingClientRect().top < vach));
      // Máy tính: câu hỏi hiện sau dòng cuối. Điện thoại xếp câu hỏi lên trên danh sách, nên hiện khi chính nó vào màn hình.
      const q = cauHoi.getBoundingClientRect().top;
      batKhi(cauHoi, dong.at(-1).classList.contains('bat') || (q < dong[0].getBoundingClientRect().top && q < innerHeight * .8));
    },
  };
}
