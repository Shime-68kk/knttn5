/* Điểm khởi động: đăng ký hiệu ứng theo cuộn của từng phần rồi bật bộ máy cuộn. */
import { khoiDong } from './cuon.js';
import taoBia from './trang/bia.js';
import taoBuoiToi from './trang/buoi-toi.js';
import taoBanChat from './trang/ban-chat.js';
import taoConSo from './trang/con-so.js';
import taoTheGioi from './trang/the-gioi.js';
import taoDauHieu from './trang/dau-hieu.js';
import taoHocTap from './trang/hoc-tap.js';
import taoCuocSong from './trang/cuoc-song.js';
import taoCongThuc from './trang/cong-thuc.js';
import taoGiaiPhap from './trang/giai-phap.js';
import taoKet from './trang/ket.js';

khoiDong({
  'bia': taoBia(),
  'buoi-toi': taoBuoiToi(),
  'ban-chat': taoBanChat(),
  'con-so': taoConSo(),
  'the-gioi': taoTheGioi(),
  'dau-hieu': taoDauHieu(),
  'hoc-tap': taoHocTap(),
  'cuoc-song': taoCuocSong(),
  'cong-thuc': taoCongThuc(),
  'giai-phap': taoGiaiPhap(),
  'ket': taoKet(),
});
