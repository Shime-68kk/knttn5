/* Cuộc sống: lăn chuột tới đâu, bút dạ quang hồng quét qua từng vấn đề tới đó. */
import { doan } from '../tien-ich.js';

export default function taoCuocSong() {
  const muc = [...document.querySelectorAll('#cuoc-song .van-de li')];
  return {
    tien(p) {
      muc.forEach((li, i) => li.style.setProperty('--to', doan(p, i * .1, i * .1 + .12).toFixed(3)));
    },
  };
}
