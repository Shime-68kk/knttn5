/* Học tập: lăn chuột vẽ hai đường căng thẳng, rồi hiện ghi chú bút đỏ và số liệu tổng hợp. */
import { doan, batKhi } from '../tien-ich.js';

export default function taoHocTap() {
  const phan = document.getElementById('hoc-tap');
  const bieuDo = phan.querySelector('.bieu-do');
  const duongOn = bieuDo.querySelector('.duong-on');
  const duongTre = bieuDo.querySelector('.duong-tre');
  const giao = bieuDo.querySelector('#diem-giao');
  const ghiCuoi = phan.querySelector('.ghi-cuoi');
  const soBen = phan.querySelector('.so-ben');
  let daTinh = false;

  // Dò theo trục ngang: y của một đường tại x
  const yTai = (duong, x) => {
    let thap = 0, cao = duong.getTotalLength();
    for (let k = 0; k < 24; k++) {
      const giua = (thap + cao) / 2;
      if (duong.getPointAtLength(giua).x < x) thap = giua; else cao = giua;
    }
    return duong.getPointAtLength(thap).y;
  };

  return {
    vao() {
      if (daTinh) return;
      for (let x = 31; x < 500; x += 2) {
        if (yTai(duongTre, x) <= yTai(duongOn, x)) {
          giao.setAttribute('transform', `translate(${x} ${yTai(duongOn, x)})`);
          daTinh = true;
          break;
        }
      }
    },
    tien(p) {
      duongOn.style.strokeDashoffset = 1 - doan(p, 0, .45);
      duongTre.style.strokeDashoffset = 1 - doan(p, .05, .5);
      bieuDo.classList.toggle('xong', p > .5);
      batKhi(ghiCuoi, p > .58);
      batKhi(soBen, p > .74);
    },
  };
}
