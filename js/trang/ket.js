/* Kết: lăn chuột gạch dần chữ "Để mai tính", rồi hiện thông điệp và chạy đồng hồ thử thách 5 phút. */
import { haiSo, doan, batKhi } from '../tien-ich.js';

const TONG = 5 * 60;

export default function taoKet() {
  const phan = document.getElementById('ket');
  const moi = phan.querySelector('.moi');
  const thuThach = phan.querySelector('.thu-thach');
  const so = document.getElementById('dem-5-phut');
  let hen = 0, conLai = TONG;
  const hienThi = () => { so.textContent = `${haiSo(Math.floor(conLai / 60))}:${haiSo(conLai % 60)}`; };
  const dung = () => { clearInterval(hen); hen = 0; conLai = TONG; hienThi(); };

  return {
    tien(p) {
      phan.style.setProperty('--gach', doan(p, .02, .32).toFixed(3));
      batKhi(moi, p > .4);
      batKhi(thuThach, p > .55, (bat) => {
        if (!bat) { dung(); return; }
        hen = setInterval(() => { conLai = Math.max(0, conLai - 1); hienThi(); if (!conLai) clearInterval(hen); }, 1000);
      });
    },
    roi: dung,
  };
}
