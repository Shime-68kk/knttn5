/* Toàn cầu: lăn chuột làm bản đồ chấm hiện dần từ trái sang phải, rồi kéo đường nối các nơi nghiên cứu về Việt Nam. */
import { BAN_DO } from '../du-lieu/ban-do.js';
import { doan } from '../tien-ich.js';

const VIET_NAM = [106, 15];
const SO_HANG = BAN_DO.hang.length;
const SO_COT = BAN_DO.hang[0].length;
const doiToaDo = ([kd, vd]) => [kd + 180, (BAN_DO.vido0 - vd) + BAN_DO.buoc / 2];

export default function taoTheGioi() {
  const phan = document.getElementById('the-gioi');
  const canvas = phan.querySelector('canvas');
  const svg = phan.querySelector('.duong-noi');
  const diem = [...phan.querySelectorAll('.diem li')].map((li) => ({
    li, kd: parseFloat(li.style.getPropertyValue('--kd')), vd: parseFloat(li.style.getPropertyValue('--vd')),
  }));

  const cham = [];
  BAN_DO.hang.forEach((hang, r) => {
    for (let c = 0; c < SO_COT; c++) {
      if (hang[c] !== '1') continue;
      const kd = -180 + c * BAN_DO.buoc + (r % 2 ? BAN_DO.buoc / 2 : 0);
      const vd = BAN_DO.vido0 - r * BAN_DO.buoc;
      const gan = Math.min(...diem.map((d) => Math.hypot(d.kd - kd, d.vd - vd)));
      const vn = Math.hypot(VIET_NAM[0] - kd, VIET_NAM[1] - vd) < 7;
      cham.push({ x: (kd + 180) / 360, y: (r + .5) / SO_HANG, gan, vn, nguong: (kd + 180) / 360 * .85 + Math.random() * .15 });
    }
  });

  const [vx, vy] = doiToaDo(VIET_NAM);
  svg.innerHTML = diem.filter((d) => !d.li.classList.contains('diem-vn')).map((d) => {
    const [x, y] = doiToaDo([d.kd, d.vd]);
    const cy = Math.min(y, vy) - 22 - Math.abs(x - vx) * .08;
    return `<path pathLength="1" d="M${x} ${y} Q${(x + vx) / 2} ${cy} ${vx} ${vy}" />`;
  }).join('');
  const duong = [...svg.querySelectorAll('path')];

  let veCu = -1;
  function ve(tienDo) {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w) return;
    const tl = Math.min(devicePixelRatio || 1, 2);
    if (canvas.width !== Math.round(w * tl)) { canvas.width = Math.round(w * tl); canvas.height = Math.round(h * tl); veCu = -1; }
    if (Math.abs(tienDo - veCu) < .002) return;
    veCu = tienDo;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(tl, 0, 0, tl, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const banKinh = (w / SO_COT) * .3;
    for (const d of cham) {
      const hien = Math.max(0, Math.min(1, (tienDo - d.nguong) / .08));
      if (!hien) continue;
      ctx.fillStyle = d.vn ? '#D7351C' : d.gan < 9 ? 'rgba(22,20,58,.75)' : 'rgba(22,20,58,.22)';
      ctx.beginPath();
      ctx.arc(d.x * w, d.y * h, banKinh * hien, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  return {
    tien(p) {
      const quet = doan(p, 0, .45) * 1.1;
      ve(quet);
      diem.forEach((d) => d.li.classList.toggle('hien', quet > (d.kd + 180) / 360 * .85 + .1));
      duong.forEach((path, i) => { path.style.strokeDashoffset = 1 - doan(p, .45 + i * .04, .72 + i * .04); });
    },
    doKich() { veCu = -1; },
  };
}
