/* Cuộn mượt cho bánh xe chuột, kể cả chuột bay: mỗi nấc lăn trôi êm rồi chậm dần (như gsap.com) thay vì nhảy cục.
   Dùng GSAP ScrollToPlugin để cuộn chính trang, nên các phần ghim (position: sticky) vẫn hoạt động.
   Cảm ứng, phím, kéo thanh cuộn giữ nguyên cách cuộn gốc của máy. */
const THOI_GIAN = 1.1;

export function ganCuonMuot() {
  const gsap = window.gsap;
  if (!gsap || !window.ScrollToPlugin || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.registerPlugin(window.ScrollToPlugin);

  let dich = scrollY, tween = null;
  const toiDa = () => document.documentElement.scrollHeight - innerHeight;
  const dung = () => { tween?.kill(); tween = null; };

  addEventListener('wheel', (e) => {
    if (e.ctrlKey) return;   // Ctrl + lăn là phóng to trang, để trình duyệt tự xử lý
    e.preventDefault();
    const quang = e.deltaMode === 1 ? e.deltaY * 40 : e.deltaMode === 2 ? e.deltaY * innerHeight : e.deltaY;
    if (!tween) dich = scrollY;
    dich = Math.max(0, Math.min(toiDa(), dich + quang));
    tween = gsap.to(window, {
      scrollTo: { y: dich, autoKill: false },
      duration: THOI_GIAN, ease: 'power3.out', overwrite: true,
      onComplete: () => { tween = null; },
    });
  }, { passive: false });

  addEventListener('keydown', dung);
  addEventListener('pointerdown', dung);
  addEventListener('touchstart', dung, { passive: true });
}
