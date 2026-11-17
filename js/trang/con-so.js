/* Con số: lăn chuột tô dần 10 hình người, rồi gắn ngoặc số liệu và chuyển 5 người sang đỏ. */
import { doan, batKhi } from '../tien-ich.js';
import { veNetBut, xoaNetBut } from '../but.js';

export default function taoConSo() {
  const phan = document.getElementById('con-so');
  const dinh = phan.querySelector('.dinh');
  const nguoi = [...phan.querySelectorAll('.bieu-nguoi > svg')];
  const [ngoacTren, ngoacDuoi] = phan.querySelectorAll('.ngoac');

  return {
    tien(p) {
      const to = doan(p, 0, .4) * 8.6;
      nguoi.forEach((n, i) => {
        n.classList.toggle('to', i < 8 && i < Math.floor(to));
        n.classList.toggle('mo', i === 8 && to > 8.3);
        n.classList.toggle('do', i < 5 && p > .72);
      });
      batKhi(ngoacTren, p > .42, (bat) => (bat ? requestAnimationFrame(() => veNetBut(dinh)) : xoaNetBut(dinh)));
      batKhi(ngoacDuoi, p > .72);
    },
  };
}
