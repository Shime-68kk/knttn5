/* Giải pháp: lăn chuột lần lượt mở từng dải ảnh trong 5 dải. */
export default function taoGiaiPhap() {
  const dai = [...document.querySelectorAll('#giai-phap .dai-anh li')];
  const soThe = document.getElementById('gp-so');
  let cu = -1;
  return {
    tien(p) {
      const dang = Math.min(dai.length - 1, Math.floor(p * dai.length));
      if (dang === cu) return;
      cu = dang;
      dai.forEach((li, i) => li.classList.toggle('dang', i === dang));
      soThe.textContent = dang + 1;
    },
    roi() { cu = -1; },
  };
}
