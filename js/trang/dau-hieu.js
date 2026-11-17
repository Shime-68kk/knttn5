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
      batKhi(cauHoi, dong.at(-1).classList.contains('bat'));
    },
  };
}
