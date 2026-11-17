/* Nét bút viết tay: khoanh tròn, gạch chân, gạch xoá. Hình hơi méo, lệch như vẽ tay thật,
   nhưng cố định cho mỗi chữ (dùng số ngẫu nhiên có hạt giống) để lần nào trình chiếu cũng giống nhau. */

const NS = 'http://www.w3.org/2000/svg';

function hatGiong(chuoi) {
  let h = 2166136261;
  for (const kt of chuoi) h = Math.imul(h ^ kt.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

// Nối các điểm thành đường cong mượt (Catmull-Rom sang Bézier)
function duongCong(diem) {
  let d = `M${diem[0][0].toFixed(1)} ${diem[0][1].toFixed(1)}`;
  for (let i = 0; i < diem.length - 1; i++) {
    const p0 = diem[i - 1] || diem[i], p1 = diem[i], p2 = diem[i + 1], p3 = diem[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

const HINH = {
  // Vòng khoanh: đi hơn một vòng một chút, hai đầu không khớp nhau
  khoanh(x, y, w, h, r) {
    const cx = x + w / 2, cy = y + h / 2;
    const rx = w / 2 + h * .35 + 6, ry = h / 2 + h * .25 + 4;
    const batDau = -2.2 + r() * .6, so = 16, diem = [];
    for (let i = 0; i <= so; i++) {
      const g = batDau + (i / so) * (Math.PI * 2 + .45);
      const lech = 1 + (r() - .5) * .08 + (i / so) * .05;
      diem.push([cx + Math.cos(g) * rx * lech, cy + Math.sin(g) * ry * lech]);
    }
    return [duongCong(diem)];
  },
  // Gạch chân: hơi lượn, hơi nghiêng
  gach(x, y, w, h, r) {
    const day = y + h + 2, diem = [];
    for (let i = 0; i <= 4; i++) diem.push([x - 4 + (w + 10) * i / 4, day + (r() - .5) * 4 + i * .8]);
    return [duongCong(diem)];
  },
  // Gạch xoá: một nét ngang chính rồi nét zíc zắc qua lại
  xoa(x, y, w, h, r) {
    const giua = y + h * .55, nets = [];
    nets.push(duongCong([[x - 8, giua + 6], [x + w * .5, giua - 4 + r() * 6], [x + w + 8, giua - 8]]));
    const zz = [];
    for (let i = 0; i <= 7; i++) zz.push([x + (w * i) / 7, i % 2 ? y + h * .25 + r() * 6 : y + h * .85 - r() * 6]);
    nets.push(duongCong(zz));
    return nets;
  },
};

// Vị trí phần tử tính trong khung chứa nét bút
function viTri(el, trang) {
  let x = 0, y = 0, n = el;
  while (n && n !== trang) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
  return [x, y, el.offsetWidth, el.offsetHeight];
}

function lopBut(trang) {
  let lop = trang.querySelector(':scope > .lop-but');
  if (!lop) {
    lop = document.createElementNS(NS, 'svg');
    lop.classList.add('lop-but');
    lop.setAttribute('aria-hidden', 'true');
    trang.append(lop);
  }
  return lop;
}

/** Vẽ các nét bút trong một khung cho những phần tử đang hiện mà chưa được vẽ. */
export function veNetBut(trang, tucThi = false) {
  if (!trang.offsetWidth) return;
  const lop = lopBut(trang);
  let tre = 0;
  trang.querySelectorAll('[data-but]').forEach((el) => {
    if (el._daVe) return;
    const cho = el.closest('[data-cho]');
    if (cho && !cho.classList.contains('bat')) return;
    const kieu = el.dataset.but;
    const [x, y, w, h] = viTri(el, trang);
    if (!w) return;
    const r = hatGiong(el.textContent + kieu);
    const day = Math.max(2.2, trang.offsetWidth * .0055);
    HINH[kieu](x, y, w, h, r).forEach((d, i) => {
      const p = document.createElementNS(NS, 'path');
      p.setAttribute('d', d);
      p.setAttribute('pathLength', '1');
      p.setAttribute('stroke-width', kieu === 'xoa' ? day * 1.6 : day);
      p.classList.add(`but-${el.dataset.mau || 'do'}`);
      p.style.setProperty('--tre-but', `${(tucThi ? 0 : .55) + tre + i * .35}s`);
      if (kieu === 'xoa') p.style.setProperty('--tg-but', '.5s');
      lop.append(p);
      requestAnimationFrame(() => requestAnimationFrame(() => p.classList.add('ve')));
    });
    tre += .25;
    el._daVe = true;
  });
}

/** Xoá nét bút để lần sau cuộn tới thì vẽ lại từ đầu. */
export function xoaNetBut(trang) {
  trang.querySelector(':scope > .lop-but')?.replaceChildren();
  trang.querySelectorAll('[data-but]').forEach((el) => { el._daVe = false; });
}
