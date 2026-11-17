/* Bản chất: lăn chuột đẩy mốc đỏ đi một vòng quanh vòng lặp; bước nào mốc đi tới thì được tô dạ quang. */
const TAM = 50, BAN_KINH = 37;

export default function taoBanChat() {
  const vong = document.querySelector('#ban-chat .vong-lap');
  const chay = vong.querySelector('.vong-chay');
  const moc = vong.querySelector('.vong-moc');
  const cacBuoc = [...vong.querySelectorAll('li')];

  return {
    tien(p) {
      const g = -Math.PI / 2 + p * Math.PI * 2;
      moc.setAttribute('transform', `translate(${(TAM + Math.cos(g) * BAN_KINH).toFixed(2)} ${(TAM + Math.sin(g) * BAN_KINH).toFixed(2)}) rotate(${p * 360})`);
      chay.style.strokeDashoffset = 1 - p;
      const dangO = Math.min(4, Math.floor(p * 5 + .1));
      cacBuoc.forEach((li, i) => {
        li.classList.toggle('dang', i === dangO);
        li.classList.toggle('qua', i < dangO);
      });
    },
  };
}
