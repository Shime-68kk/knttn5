/* Dấu hiệu: mỗi dòng được bút đỏ tick khi cuộn qua giữa màn hình. */
import { batKhi } from '../tien-ich.js';

export default function taoDauHieu() {
  const phan = document.getElementById('dau-hieu');
  const dong = [...phan.querySelectorAll('.ds-dau-hieu li')];
  const cauHoi = phan.querySelector('.cau-hoi');
  const tuDap = phan.querySelector('.tu-dap');
  const haiCot = matchMedia('(min-width: 900px)'); // khớp bố cục trong dau-hieu.css

  return {
    tien() {
      const vach = innerHeight * .62;
      dong.forEach((li) => li.classList.toggle('bat', li.getBoundingClientRect().top < vach));
      // Màn rộng: câu hỏi hiện sau dòng cuối. Màn hẹp xếp câu hỏi lên trên danh sách, nên hiện khi chính nó vào màn hình.
      const q = cauHoi.getBoundingClientRect().top;
      const hoiTruoc = !haiCot.matches; // màn hẹp: câu hỏi xếp trên danh sách
      batKhi(cauHoi, dong.at(-1).classList.contains('bat') || (hoiTruoc && q < innerHeight * .8));
      // Lăn thêm một chút sau câu hỏi thì hiện câu tự trả lời
      const cuoi = dong.at(-1).getBoundingClientRect().top;
      batKhi(tuDap, cauHoi.classList.contains('bat') && (hoiTruoc ? tuDap.getBoundingClientRect().top < innerHeight * .6 : cuoi < innerHeight * .45));
    },
  };
}
