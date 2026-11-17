/* Một buổi tối: cuộn tới đâu, dòng thời gian và màn hình điện thoại chạy tới mốc giờ đó. */
import { hoatCanh, batKhi } from '../tien-ich.js';

const MOC = [['20:00', 0], ['20:05', 5], ['21:40', 100], ['23:30', 210]];

const docPhut = (p) => {
  if (p < 60) return `${p} phút`;
  const du = p % 60;
  return `${Math.floor(p / 60)} giờ${du ? ` ${du} phút` : ''}`;
};

export default function taoBuoiToi() {
  const phan = document.getElementById('buoi-toi');
  const dong = [...phan.querySelectorAll('.dong-thoi-gian li')];
  const gio = document.getElementById('dt-gio');
  const suDung = document.getElementById('dt-su-dung');
  const thongBao = [...phan.querySelectorAll('.tb')];
  const cauChot = phan.querySelector('.cau-chot');
  let buocCu = 0, phut = 0, dungDem = () => {};

  return {
    tien(p) {
      // 5 nấc: 4 mốc giờ rồi câu chốt
      const buoc = Math.min(5, 1 + Math.floor(p * 5));
      if (buoc === buocCu) return;
      buocCu = buoc;
      dong.forEach((li, i) => {
        li.classList.toggle('hien', i < buoc);
        li.classList.toggle('dang', i === Math.min(buoc, 4) - 1);
      });
      const [g, phutMoi] = MOC[Math.min(buoc, 4) - 1];
      if (gio.textContent !== g) {
        gio.textContent = g;
        gio.classList.remove('doi'); void gio.offsetWidth; gio.classList.add('doi');
      }
      const tu = phut;
      phut = phutMoi;
      dungDem();
      dungDem = hoatCanh(700, (e) => { suDung.textContent = docPhut(Math.round(tu + (phutMoi - tu) * e)); });
      thongBao.forEach((tb) => tb.classList.toggle('bat', buoc > +tb.dataset.tb));
      batKhi(cauChot, buoc >= 5);
      // Càng về khuya, nền càng tối
      phan.style.setProperty('--dem', [0, 0, .2, .4, .6, .7][buoc]);
    },
    roi() { buocCu = 0; },
  };
}
