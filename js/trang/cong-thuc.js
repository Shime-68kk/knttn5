/* Công thức: lăn chuột lần lượt tô xanh tử số, rồi tô đỏ mẫu số. */
import { batKhi } from '../tien-ich.js';

export default function taoCongThuc() {
  const phan = document.getElementById('cong-thuc');
  const len = phan.querySelector('.huong-len');
  const xuong = phan.querySelector('.huong-xuong');
  return {
    tien(p) {
      phan.classList.toggle('bat-len', p > .3);
      phan.classList.toggle('bat-xuong', p > .62);
      batKhi(len, p > .3);
      batKhi(xuong, p > .62);
    },
  };
}
