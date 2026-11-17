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

  const anh = phan.querySelector('.bia-anh');
  const toi = phan.querySelector('.bia-toi');
  const noi = phan.querySelector('.bia-noi');
  const cauSau = phan.querySelector('.bia-cau-sau');
  // Chỉ ghi khi giá trị đổi, để trình duyệt không phải vẽ lại vô ích
  const ghi = (el, thuocTinh, gt) => { if (el.style[thuocTinh] !== gt) el.style[thuocTinh] = gt; };

  return {
    // Đo lại khi đổi cỡ màn hình: cỡ chữ và tâm phóng (giữa nét dọc chữ "Ì", hơi thấp để tránh dấu huyền)
    doKich() {
      w = canvas.clientWidth; h = canvas.clientHeight;
      if (!w) return;
      // Màn hình nét cao: vẽ canvas ở 1,25 lần là đủ sắc, đỡ nặng hơn nhiều so với 2 lần
      tiLe = Math.min(devicePixelRatio || 1, 1.25);
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
      // Phóng theo hàm mũ: mỗi đoạn cuộn bằng nhau phóng to thêm cùng một tỉ lệ, nên chuyển động đều, không ì rồi vọt
      const z = giamChuyenDong ? 0 : doan(p, .02, .7);
      const s = Math.exp(z * Math.log(90));
      if (Math.abs(s - sCu) > .0005) veLai(s);
      ghi(canvas, 'opacity', (giamChuyenDong ? 1 - doan(p, .3, .5) : 1 - doan(p, .7, .76)).toFixed(3));
      ghi(noi, 'opacity', (1 - doan(p, 0, .12)).toFixed(3));
      ghi(anh, 'transform', `scale(${(1.3 - doan(p, 0, .8) * .3).toFixed(4)})`);
      ghi(toi, 'opacity', (doan(p, .78, 1) * .35).toFixed(3));
      // Câu dẫn hiện lên rồi mờ đi ở những nấc cuối, nhường chỗ cho Một buổi tối
      const sau = doan(p, .76, .86) * (1 - doan(p, .95, 1));
      ghi(cauSau, 'opacity', sau.toFixed(3));
      ghi(cauSau, 'transform', `translateY(${((1 - sau) * 24).toFixed(1)}px)`);
    },
  };
}
