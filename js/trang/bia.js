/* Bìa: canvas phủ một lớp giấy lên ảnh đêm, chữ tiêu đề được khoét rỗng để lộ ảnh.
   Lăn chuột thì chữ phóng to quanh nét dọc của chữ "Ì" cho tới khi ảnh tràn màn hình.
   Vẽ lại từng khung hình nên phóng lớn đến đâu, lăn xuôi hay ngược cũng không bị vỡ hình. */
import { haiSo, doan, giamChuyenDong } from '../tien-ich.js';

const DONG_NGANG = ['SỰ TRÌ HOÃN', 'Ở GIỚI TRẺ'];
const DONG_DOC = ['SỰ TRÌ', 'HOÃN', 'Ở GIỚI TRẺ'];
const GIAY = '#FAFAF7';

export default function taoBia() {
  const phan = document.getElementById('mo-dau');
  const canvas = phan.querySelector('.bia-mat-na');
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, co = 0, ox = 0, oy = 0, tiLe = 1, sCu = -1, dong = DONG_NGANG;

  const dongHo = document.getElementById('dem-nguoc');
  let conLai = 10 * 60 - 1;
  setInterval(() => {
    conLai = conLai > 0 ? conLai - 1 : 10 * 60 - 1;
    dongHo.textContent = `${haiSo(Math.floor(conLai / 60))}:${haiSo(conLai % 60)}`;
  }, 1000);

  const datPhong = () => { ctx.font = `900 ${co}px Archivo, 'Arial Narrow', sans-serif`; ctx.fontStretch = 'extra-condensed'; };
  const yDong = (i) => h / 2 + (i - (dong.length - 1) / 2) * co * .92 + co * .05;

  function veLai(s) {
    sCu = s;
    ctx.setTransform(tiLe, 0, 0, tiLe, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = GIAY;
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.translate(ox, oy);
    ctx.scale(s, s);
    ctx.translate(-ox, -oy);
    datPhong();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    dong.forEach((chu, i) => ctx.fillText(chu, w / 2, yDong(i)));
    ctx.globalCompositeOperation = 'source-over';
  }

  const dat = (ten, gt) => phan.style.setProperty(ten, gt.toFixed(4));

  return {
    // Đo lại khi đổi cỡ màn hình: cỡ chữ và tâm phóng (giữa nét dọc chữ "Ì", hơi thấp để tránh dấu huyền)
    doKich() {
      w = canvas.clientWidth; h = canvas.clientHeight;
      if (!w) return;
      tiLe = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * tiLe); canvas.height = Math.round(h * tiLe);
      // Màn dọc (điện thoại): chia 3 dòng để chữ to hơn
      dong = w / h < .85 ? DONG_DOC : DONG_NGANG;
      co = 100;
      datPhong();
      // Dòng dài nhất chiếm tối đa 88% bề ngang màn hình
      const vua = (w * .88 * 100) / Math.max(...dong.map((chu) => ctx.measureText(chu).width));
      co = Math.min(vua, dong === DONG_DOC ? h * .15 : h * .27);
      datPhong();
      const rong = ctx.measureText(dong[0]).width;
      ox = w / 2 - rong / 2 + ctx.measureText('SỰ TR').width + ctx.measureText('Ì').width / 2;
      oy = yDong(0) + co * .14;
      veLai(sCu > 0 ? sCu : 1);
    },
    tien(p) {
      const z = giamChuyenDong ? 0 : doan(p, .05, .72);
      const s = 1 + Math.pow(z, 3.2) * 90;
      if (Math.abs(s - sCu) > .0005) veLai(s);
      dat('--mo', giamChuyenDong ? 1 - doan(p, .3, .5) : 1 - doan(p, .7, .76));
      dat('--noi', 1 - doan(p, 0, .12));
      dat('--zoom-anh', doan(p, 0, .8));
      dat('--toi', doan(p, .78, 1) * .5);
      dat('--sau', doan(p, .8, .93));
    },
  };
}
