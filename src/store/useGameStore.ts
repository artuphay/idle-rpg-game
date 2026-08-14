import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { playPosBellSound } from '../utils/audio';

export interface Task {
  id: string;
  name: string;
  category: 'Pekerjaan Pos' | 'Pelatihan Kerja';
  duration: number;
  reqLevel: number;
  rewardGold: number;
  rewardExp: number;
  rewardStat?: { type: 'sta' | 'spd' | 'tel'; amount: number };
}

export interface ShopItem {
  id: string;
  name: string;
  category: 'Seragam & Aksesoris' | 'Kendaraan Pos' | 'Fasilitas & Properti';
  cost: number;
  expMultiplierBonus: number;
  owned: boolean;
  reqLevel: number;
  description: string;
}

export interface BigProject {
  id: string;
  name: string;
  description: string;
  reqLevel: number;
  reqStats: { sta: number; spd: number; tel: number };
  totalWorkPoints: number;
  currentWorkPoints: number;
  timeLimit: number;
  timeRemaining: number;
  rewardGold: number;
  rewardExp: number;
  completed: boolean;
}

export interface CatMascot {
  id: string;
  name: string;
  title: string;
  description: string;
  icon: string;
  cost: number;
  owned: boolean;
  goldMultiplier: number;
  expMultiplier: number;
  statBonus?: { sta: number; spd: number; tel: number };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  expBonusMultiplier: number;
}

export interface PitchOption {
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface PitchStage {
  stageTitle: string;
  clientDilemma: string;
  options: PitchOption[];
}

export interface ClientProspect {
  id: string;
  name: string;
  category: string;
  icon: string;
  reqLevel: number;
  reqStats: { sta: number; spd: number; tel: number };
  stages: PitchStage[];
  closingBonusGold: number;
  closingBonusExp: number;
  passiveRoyaltyPerSec: number;
  isClosed: boolean;
}

export interface ActiveBuff {
  name: string;
  goldMultiplier: number;
  expMultiplier: number;
  durationRemaining: number;
}

export interface ActionResult {
  message: string;
  success: boolean;
  costGold?: number;
  rewardGold?: number;
  rewardExp?: number;
  rewardStat?: { type: 'sta' | 'spd' | 'tel'; amount: number };
  buff?: ActiveBuff;
}

export interface EventOption {
  text: string;
  reqStat?: { type: 'sta' | 'spd' | 'tel'; minAmount: number };
  costGold?: number;
  action: (state: any) => ActionResult;
}

export interface RandomEvent {
  id: string;
  title: string;
  description: string;
  options: EventOption[];
}

export interface FloatingText {
  id: number;
  text: string;
  color: string;
}

export interface OfflineReport {
  durationSeconds: number;
  goldEarned: number;
  expEarned: number;
}

export const INITIAL_TASKS: Task[] = [
  { id: 'job_label', name: 'Cetak & Tempel Resi Paket', category: 'Pekerjaan Pos', duration: 1.5, reqLevel: 1, rewardGold: 10000, rewardExp: 8 },
  { id: 'job_sort', name: 'Sortir Surat & Paket Muka', category: 'Pekerjaan Pos', duration: 2.5, reqLevel: 1, rewardGold: 20000, rewardExp: 15 },
  { id: 'job_counter', name: 'Melayani Loket & Pospay', category: 'Pekerjaan Pos', duration: 4, reqLevel: 2, rewardGold: 60000, rewardExp: 30 },
  { id: 'job_complaint', name: 'Penanganan Keluhan Pelanggan Gabut', category: 'Pekerjaan Pos', duration: 3.5, reqLevel: 4, rewardGold: 120000, rewardExp: 50 },
  { id: 'job_courier', name: 'Kurir PosAja Keliling Kota', category: 'Pekerjaan Pos', duration: 5, reqLevel: 6, rewardGold: 250000, rewardExp: 90 },
  { id: 'job_hub', name: 'Supervisi Hub Logistik Regional', category: 'Pekerjaan Pos', duration: 6.5, reqLevel: 9, rewardGold: 650000, rewardExp: 200 },
  { id: 'job_manager', name: 'Manajer Operasional PosIND', category: 'Pekerjaan Pos', duration: 8, reqLevel: 13, rewardGold: 1800000, rewardExp: 450 },
  { id: 'job_head', name: 'Kepala Kantor Pos Cabang Utama', category: 'Pekerjaan Pos', duration: 10, reqLevel: 17, rewardGold: 4500000, rewardExp: 900 },
  { id: 'job_vp', name: 'VP Corporate Strategy PosIND', category: 'Pekerjaan Pos', duration: 12, reqLevel: 21, rewardGold: 10000000, rewardExp: 2000 },
  { id: 'job_ceo', name: 'Direktur Utama PosIND', category: 'Pekerjaan Pos', duration: 15, reqLevel: 25, rewardGold: 30000000, rewardExp: 5000 },
  
  { id: 'train_sta', name: 'Angkat Karung Paket Berat', category: 'Pelatihan Kerja', duration: 3, reqLevel: 1, rewardGold: 0, rewardExp: 15, rewardStat: { type: 'sta', amount: 1 } },
  { id: 'train_spd', name: 'Latihan Sortir Paket Cepat', category: 'Pelatihan Kerja', duration: 3, reqLevel: 1, rewardGold: 0, rewardExp: 15, rewardStat: { type: 'spd', amount: 1 } },
  { id: 'train_tel', name: 'Membaca Alamat Tulisan Cakar Ayam', category: 'Pelatihan Kerja', duration: 3, reqLevel: 2, rewardGold: 0, rewardExp: 20, rewardStat: { type: 'tel', amount: 1 } },
  { id: 'train_cert', name: 'Sertifikasi Manajemen Logistik', category: 'Pelatihan Kerja', duration: 5, reqLevel: 7, rewardGold: 0, rewardExp: 60, rewardStat: { type: 'tel', amount: 3 } },
  { id: 'train_leader', name: 'Pelatihan Leadership PosIND', category: 'Pelatihan Kerja', duration: 7, reqLevel: 11, rewardGold: 0, rewardExp: 150, rewardStat: { type: 'sta', amount: 2 } },
];

export const INITIAL_PROSPECTS: ClientProspect[] = [
  {
    id: 'prospect_online_shop',
    name: 'Toko Fashion Online Grosir',
    category: 'UMKM & E-Commerce',
    icon: '🛍️',
    reqLevel: 2,
    reqStats: { sta: 10, spd: 12, tel: 10 },
    closingBonusGold: 3000000,
    closingBonusExp: 500,
    passiveRoyaltyPerSec: 5000,
    isClosed: false,
    stages: [
      {
        stageTitle: 'Tahap 1: Analisis Kebutuhan Penjemputan',
        clientDilemma: '"Toko kami mengirim 300-500 paket setiap hari. Masalah terbesar kami adalah kurir ekspedisi lain sering telat jemput barang sehingga pengiriman tertunda. Bagaimana PosIND mengatasi ini?"',
        options: [
          {
            text: 'Tawarkan integrasi PosAja B2B dengan jadwal Pick-up Terjadwal Harian dan kurir dedicated tanpa biaya tambahan.',
            isCorrect: true,
            explanation: 'TEPAT! Kepastian jadwal penjemputan paket harian adalah nilai jual utama yang dicari seller e-commerce volume besar.',
          },
          {
            text: 'Sarankan staf toko mengantar sendiri ratusan karung paket ke kantor pos cabang terdekat.',
            isCorrect: false,
            explanation: 'Kurang tepat. Seller volume ratusan paket/hari membutuhkan layanan jemput barang (pick-up service).',
          },
        ],
      },
      {
        stageTitle: 'Tahap 2: Solusi Likuiditas & Pembayaran COD',
        clientDilemma: '"Hampir 60% pembeli kami memilih metode Cash on Delivery (COD). Di ekspedisi lama, dana COD baru cair 7 hari kerja. Apa komitmen Pos Indonesia?"',
        options: [
          {
            text: 'Tawarkan fasilitas PosAja COD dengan pencairan dana otomatis H+1 langsung ke rekening merchant / saldo Pospay.',
            isCorrect: true,
            explanation: 'TEPAT! Kecepatan pencairan dana COD H+1 sangat krusial bagi perputaran arus kas (cashflow) toko online.',
          },
          {
            text: 'Sarankan toko menghapus opsi COD dan hanya menerima transfer bank manual.',
            isCorrect: false,
            explanation: 'Kurang tepat. Menghapus COD akan menurunkan angka konversi penjualan online seller hingga 40%.',
          },
        ],
      },
      {
        stageTitle: 'Tahap 3: Negosiasi & Penandatanganan PKS',
        clientDilemma: '"Jika kami mengalihkan 100% kiriman kami ke Pos Indonesia, apakah ada kontrak resmi dengan skema diskon volume bulanan?"',
        options: [
          {
            text: 'Terbitkan draf Perjanjian Kerja Sama (PKS) resmi korporat dengan skema diskon progresif berdasarkan volume kiriman bulanan.',
            isCorrect: true,
            explanation: 'DEAL! PKS dengan skema diskon volume mengunci loyalitas merchant untuk bermitra jangka panjang dengan PosIND.',
          },
          {
            text: 'Berikan janji diskon lisan tanpa membuat dokumen kontrak PKS resmi.',
            isCorrect: false,
            explanation: 'Salah. Kerja sama kemitraan B2B wajib memiliki payung hukum PKS resmi agar hak dan kewajiban kedua pihak terjamin.',
          },
        ],
      },
    ],
  },
  {
    id: 'prospect_bumdes',
    name: 'BUMDes Sejahtera Mandiri',
    category: 'Keuangan Desa & Retail',
    icon: '🌾',
    reqLevel: 5,
    reqStats: { sta: 12, spd: 12, tel: 14 },
    closingBonusGold: 8000000,
    closingBonusExp: 1200,
    passiveRoyaltyPerSec: 15000,
    isClosed: false,
    stages: [
      {
        stageTitle: 'Tahap 1: Mengatasi Akses Keuangan Desa',
        clientDilemma: '"Warga desa kami harus menempuh jarak 15 km hanya untuk membayar listrik, BPJS, atau mengambil kiriman uang dari anak di rantau. Bagaimana BUMDes bisa hadir?"',
        options: [
          {
            text: 'Buka kemitraan Pospay Agen di kantor BUMDes untuk melayani transfer uang, pembayaran tagihan lengkap, dan penerimaan kiriman paket.',
            isCorrect: true,
            explanation: 'TEPAT! Pospay Agen memberdayakan BUMDes menjadi mini-bank dan loket serba bisa di pelosok desa.',
          },
          {
            text: 'Minta warga desa tetap bersabar bepergian ke kantor pos kecamatan.',
            isCorrect: false,
            explanation: 'Kurang tepat. Ini membuang peluang perluasan jaringan layanan inklusi keuangan Pos Indonesia di pedesaan.',
          },
        ],
      },
      {
        stageTitle: 'Tahap 2: Skema Bagi Hasil (Fee Sharing)',
        clientDilemma: '"Pengurus desa bertanya, bagaimana skema keuntungan finansial bagi kas desa dari operasional Pospay Agen ini?"',
        options: [
          {
            text: 'Jelaskan skema fee sharing kompetitif per transaksi yang langsung masuk secara otomatis ke saldo kas operasional BUMDes.',
            isCorrect: true,
            explanation: 'TEPAT! Skema bagi hasil per transaksi memberikan pendapatan asli desa (PADes) yang transparan dan berkesinambungan.',
          },
          {
            text: 'Katakan bahwa BUMDes hanya beroperasi sosial tanpa mendapatkan keuntungan finansial apa pun.',
            isCorrect: false,
            explanation: 'Kurang tepat. BUMDes adalah badan usaha yang membutuhkan insentif pendapatan operasional.',
          },
        ],
      },
      {
        stageTitle: 'Tahap 3: Pendampingan & Perangkat Operasional',
        clientDilemma: '"Staf operator BUMDes masih awam dengan sistem perbankan digital. Apakah PosIND menyediakan mesin EDC dan pelatihan?"',
        options: [
          {
            text: 'Sediakan perangkat EDC Pospay resmi beserta modul pelatihan intensif dan pendampingan staf oleh Account Executive PosIND.',
            isCorrect: true,
            explanation: 'DEAL! Pelatihan dan pendampingan memastikan transaksi keuangan desa berjalan aman dan lancar.',
          },
          {
            text: 'Biarkan operator desa mempelajari sistem secara mandiri tanpa panduan resmi.',
            isCorrect: false,
            explanation: 'Salah. Transaksi keuangan memerlukan sertifikasi dan pemahaman SOP yang tepat.',
          },
        ],
      },
    ],
  },
  {
    id: 'prospect_bapenda',
    name: 'Bapenda / Badan Pendapatan Daerah',
    category: 'Instansi Pemerintah (B2G)',
    icon: '🏛️',
    reqLevel: 9,
    reqStats: { sta: 15, spd: 15, tel: 18 },
    closingBonusGold: 25000000,
    closingBonusExp: 3500,
    passiveRoyaltyPerSec: 50000,
    isClosed: false,
    stages: [
      {
        stageTitle: 'Tahap 1: Target Realisasi Pajak Daerah (PAD)',
        clientDilemma: '"Pemerintah daerah ingin meningkatkan realisasi pembayaran Pajak Bumi dan Bangunan (PBB) tanpa antrean panjang di kantor dinas. Apa strategi terbaik?"',
        options: [
          {
            text: 'Integrasikan channel pembayaran PBB dan retribusi daerah di seluruh jaringan loket Pos, Agenpos, EDC Pospay kelurahan, dan aplikasi Pospay.',
            isCorrect: true,
            explanation: 'TEPAT! Memperluas titik pembayaran (omnichannel) mempermudah masyarakat membayar pajak tepat waktu.',
          },
          {
            text: 'Sarankan Pemda hanya membuka 1 loket pembayaran manual di kantor bupati.',
            isCorrect: false,
            explanation: 'Kurang tepat. Loket terpusat akan memicu antrean panjang dan menurunkan tingkat kepatuhan wajib pajak.',
          },
        ],
      },
      {
        stageTitle: 'Tahap 2: Integrasi Sistem Host-to-Host (H2H)',
        clientDilemma: '"Kepala Bapenda menegaskan bahwa data pembayaran wajib pajak harus tercatat secara real-time ke kas daerah Pemda. Mungkinkah?"',
        options: [
          {
            text: 'Terapkan integrasi Host-to-Host (H2H) aman antara sistem Bapenda dan Core Banking System PosIND dengan settlement harian transparan.',
            isCorrect: true,
            explanation: 'TEPAT! Integrasi H2H memastikan pelaporan data keuangan akurat, real-time, dan mempermudah audit BPK.',
          },
          {
            text: 'Rekapitulasi data transaksi secara manual menggunakan lembaran kertas setiap akhir bulan.',
            isCorrect: false,
            explanation: 'Salah. Rekapitulasi manual sangat rentan selisih data dan keterlambatan pencatatan kas daerah.',
          },
        ],
      },
      {
        stageTitle: 'Tahap 3: Payung Hukum Perjanjian Kerja Sama (PKS)',
        clientDilemma: '"Bagaimana prosedur legal formal sebelum sistem pembayaran pajak ini diluncurkan secara serentak ke publik?"',
        options: [
          {
            text: 'Finalisasi draf PKS Penerimaan Pendapatan Daerah, penandatanganan bersama Kepala Daerah, dan kampanye sosialisasi media.',
            isCorrect: true,
            explanation: 'DEAL! PKS berkekuatan hukum resmi memperkuat kolaborasi strategis B2G antara Pos Indonesia dan Pemerintah Daerah.',
          },
          {
            text: 'Langsung mulai operasional tanpa penandatanganan dokumen PKS resmi.',
            isCorrect: false,
            explanation: 'Salah. Kerja sama dengan instansi pemerintah wajib memiliki landasan PKS resmi sesuai regulasi perundang-undangan.',
          },
        ],
      },
    ],
  },
  {
    id: 'prospect_exporter',
    name: 'Koperasi Eksportir Kopi Nusantara',
    category: 'Eksportir & Kargo Global',
    icon: '☕',
    reqLevel: 14,
    reqStats: { sta: 20, spd: 20, tel: 22 },
    closingBonusGold: 100000000,
    closingBonusExp: 10000,
    passiveRoyaltyPerSec: 200000,
    isClosed: false,
    stages: [
      {
        stageTitle: 'Tahap 1: Pengiriman Cepat ke Pasar Eropa & Asia',
        clientDilemma: '"Koperasi kami ingin mengirim sampel biji kopi premium ke roastery di Jerman dan Jepang dengan batas waktu pengiriman maksimal 5 hari kerja. Layanan mana yang tepat?"',
        options: [
          {
            text: 'Tawarkan layanan Pos Ekspor / Express Mail Service (EMS) dengan prioritas kargo udara internasional dan tracking antar-negara.',
            isCorrect: true,
            explanation: 'TEPAT! EMS Pos Indonesia memiliki jaringan kerja sama pos dunia (UPU) dengan prioritas penerbangan kilat internasional.',
          },
          {
            text: 'Sarankan pengiriman sampel menggunakan kapal laut reguler lambat yang memakan waktu 2 bulan.',
            isCorrect: false,
            explanation: 'Salah. Sampel kopi akan rusak dan kehilangan aroma jika memakan waktu terlalu lama di perjalanan.',
          },
        ],
      },
      {
        stageTitle: 'Tahap 2: Penanganan Dokumen Kepabeanan (Customs)',
        clientDilemma: '"Bagaimana prosedur deklarasi bea cukai dan karantina tanaman agar sampel kopi kami tidak disita di bandara tujuan?"',
        options: [
          {
            text: 'Bantu pengisian formulir Deklarasi Pabean resmi UPU (CN22/CN23) dan integrasi sertifikat fitosanitari karantina tanaman.',
            isCorrect: true,
            explanation: 'TEPAT! Kelengkapan formulir kepabeanan UPU menjamin kiriman lolos pemeriksaan bea cukai internasional secara mulus.',
          },
          {
            text: 'Kirim paket tanpa label deklarasi pabean resmi.',
            isCorrect: false,
            explanation: 'Salah. Kiriman tanpa dokumen CN22/CN23 akan langsung ditahan atau dimusnahkan oleh otoritas pabean negara tujuan.',
          },
        ],
      },
      {
        stageTitle: 'Tahap 3: Asuransi & Kontrak Ekspor Terpadu',
        clientDilemma: '"Nilai sampel kopi specialty ini sangat tinggi. Bagaimana skema proteksi dan kontrak pengiriman rutinnya?"',
        options: [
          {
            text: 'Sertakan asuransi kiriman bernilai penuh (ad valorem) dan kontrak korporat Pos Ekspor dengan diskon tarif korporasi.',
            isCorrect: true,
            explanation: 'DEAL! Asuransi penuh dan tarif kontrak korporat memberikan kenyamanan dan efisiensi biaya bagi eksportir nasional.',
          },
          {
            text: 'Tolak menyediakan asuransi dan lepas tanggung jawab atas keselamatan kargo.',
            isCorrect: false,
            explanation: 'Salah. Ketiadaan asuransi akan membuat klien beralih ke ekspedisi kargo swasta asing.',
          },
        ],
      },
    ],
  },
  {
    id: 'prospect_holding_bumn',
    name: 'Holding BUMN Konstruksi & Industri',
    category: 'Korporat & Logistik Terpadu',
    icon: '🏗️',
    reqLevel: 18,
    reqStats: { sta: 30, spd: 30, tel: 30 },
    closingBonusGold: 500000000,
    closingBonusExp: 25000,
    passiveRoyaltyPerSec: 1000000,
    isClosed: false,
    stages: [
      {
        stageTitle: 'Tahap 1: Kerahasiaan Dokumen Kontrak Strategis',
        clientDilemma: '"Holding kami mendistribusikan dokumen kontrak lelang dan berkas tender bernilai triliunan rupiah antar direksi BUMN di seluruh Indonesia. Apa jaminan keamanannya?"',
        options: [
          {
            text: 'Sediakan layanan Dedicated Secure Courier dengan kurir berlisensi resmi, segel tamper-evident, dan sistem serah terima terenkripsi.',
            isCorrect: true,
            explanation: 'TEPAT! Rekam jejak terpercaya Pos Indonesia menjamin integritas dan kerahasiaan dokumen penting negara dan BUMN.',
          },
          {
            text: 'Gunakan kurir pihak ketiga lepas tanpa verifikasi identitas resmi.',
            isCorrect: false,
            explanation: 'Salah. Berkas lelang negara membutuhkan pengawalan dan keamanan tingkat tinggi dari institusi terpercaya.',
          },
        ],
      },
      {
        stageTitle: 'Tahap 2: Manajemen Gudang & Rantai Pasok (Fulfillment)',
        clientDilemma: '"Kami juga membutuhkan pengelolaan gudang suplai material proyek dan distribusi suku cadang di 5 pulau besar. Bagaimana kapabilitas PosIND?"',
        options: [
          {
            text: 'Tawarkan solusi PosIND Integrated Fulfillment & Logistics Warehouse yang memanfaatkan jaringan hub logistik Pos di seluruh provinsi.',
            isCorrect: true,
            explanation: 'TEPAT! Jaringan gudang logistik Pos Indonesia yang tersebar di seluruh nusantara memberikan efisiensi rantai pasok bagi holding BUMN.',
          },
          {
            text: 'Sarankan holding BUMN membangun gudang sendiri di setiap pulau dari nol.',
            isCorrect: false,
            explanation: 'Kurang tepat. Membangun gudang baru membutuhkan biaya investasi (Capex) yang sangat besar dan memakan waktu bertahun-tahun.',
          },
        ],
      },
      {
        stageTitle: 'Tahap 3: SLA Terikat & Dedicated Key Account Manager',
        clientDilemma: '"Holding BUMN kami membutuhkan Service Level Agreement (SLA) ketat 99.5% dan tim responsif 24/7. Apa komitmen manajemen PosIND?"',
        options: [
          {
            text: 'Terbitkan Kontrak Korporat Jangka Panjang dengan penunjukan Dedicated Key Account Manager dan sistem audit SLA performa bulanan.',
            isCorrect: true,
            explanation: 'DEAL! Penunjukan Key Account Manager khusus menjamin kelancaran operasional logistik holding BUMN dengan standar enterprise tertinggi.',
          },
          {
            text: 'Minta klien menghubungi nomor call center umum reguler jika terjadi kendala logistik.',
            isCorrect: false,
            explanation: 'Salah. Klien enterprise berskala ratusan juta rupiah memerlukan Account Manager khusus yang siap siaga 24/7.',
          },
        ],
      },
    ],
  },
];

export const INITIAL_BIG_PROJECTS: BigProject[] = [
  {
    id: 'proj_disaster',
    name: '🚚 Logistik Bantuan Bencana Nasional',
    description: 'Pengiriman darurat ribuan ton obat-obatan & pakaian ke daerah pelosok.',
    reqLevel: 3,
    reqStats: { sta: 12, spd: 12, tel: 10 },
    totalWorkPoints: 1000,
    currentWorkPoints: 0,
    timeLimit: 45,
    timeRemaining: 45,
    rewardGold: 1500000,
    rewardExp: 300,
    completed: false,
  },
  {
    id: 'proj_export',
    name: '✈️ Ekspor Komoditas UMKM Ke Eropa',
    description: 'Pengurusan dokumen pabean internasional dan penerbangan kiriman kargo.',
    reqLevel: 6,
    reqStats: { sta: 15, spd: 15, tel: 15 },
    totalWorkPoints: 3000,
    currentWorkPoints: 0,
    timeLimit: 60,
    timeRemaining: 60,
    rewardGold: 7500000,
    rewardExp: 800,
    completed: false,
  },
  {
    id: 'proj_election',
    name: '📦 Distribusi Logistik Pemilu Serentak',
    description: 'Tender nasional pengiriman surat suara tepat waktu ke 38 provinsi.',
    reqLevel: 10,
    reqStats: { sta: 22, spd: 22, tel: 22 },
    totalWorkPoints: 8000,
    currentWorkPoints: 0,
    timeLimit: 75,
    timeRemaining: 75,
    rewardGold: 35000000,
    rewardExp: 2500,
    completed: false,
  },
  {
    id: 'proj_bumn',
    name: '🏭 Kontrak Logistik BUMN Seluruh Nusantara',
    description: 'Pengelolaan suplai rantai pasok terintegrasi untuk holding BUMN.',
    reqLevel: 15,
    reqStats: { sta: 35, spd: 35, tel: 35 },
    totalWorkPoints: 20000,
    currentWorkPoints: 0,
    timeLimit: 90,
    timeRemaining: 90,
    rewardGold: 200000000,
    rewardExp: 8000,
    completed: false,
  },
  {
    id: 'proj_global',
    name: '🌐 Jaringan Hub Logistik Global PosIND',
    description: 'Pembangunan megaproyek jalur ekspedisi lintas 5 benua.',
    reqLevel: 20,
    reqStats: { sta: 50, spd: 50, tel: 50 },
    totalWorkPoints: 50000,
    currentWorkPoints: 0,
    timeLimit: 120,
    timeRemaining: 120,
    rewardGold: 1000000000,
    rewardExp: 25000,
    completed: false,
  },
];

export const INITIAL_CATS: CatMascot[] = [
  {
    id: 'cat_oyen',
    name: 'Oyen Tukang Sortir',
    title: 'Maskot Utama',
    description: 'Kucing oranye langganan nangkring di atas meja sortir kantor pos.',
    icon: '🐈',
    cost: 0,
    owned: true,
    goldMultiplier: 0,
    expMultiplier: 0.15,
  },
  {
    id: 'cat_belang',
    name: 'Belang Kurir PosAja',
    title: 'Kurir Cilik',
    description: 'Suka ikut dibonceng di keranjang motor kurir keliling kota.',
    icon: '🚚',
    cost: 250000,
    owned: false,
    goldMultiplier: 0.20,
    expMultiplier: 0.10,
  },
  {
    id: 'cat_pospay',
    name: 'Hitam Pospay Executive',
    title: 'Kucing Hoki',
    description: 'Sering rebahan hangat di atas mesin EDC Pospay meja loket.',
    icon: '💳',
    cost: 1500000,
    owned: false,
    goldMultiplier: 0.30,
    expMultiplier: 0.25,
  },
  {
    id: 'cat_persia',
    name: 'Persia Dirut PosIND',
    title: 'Ras Bangsawan',
    description: 'Kucing ras mewah milik pimpinan kantor cabang utama.',
    icon: '👑',
    cost: 10000000,
    owned: false,
    goldMultiplier: 0.50,
    expMultiplier: 0.40,
  },
  {
    id: 'cat_calico',
    name: 'Calico Satpam Pos',
    title: 'Penjaga Gudang',
    description: 'Menjaga gudang logistik malam hari dari tikus dan gangguan.',
    icon: '🛡️',
    cost: 50000000,
    owned: false,
    goldMultiplier: 0.50,
    expMultiplier: 0.50,
    statBonus: { sta: 5, spd: 5, tel: 5 },
  },
  {
    id: 'cat_cosmic',
    name: 'Oranye Cosmic PosAja',
    title: 'Legenda Antar Planet',
    description: 'Maskot legenda penerima paket ekspres lintas galaksi.',
    icon: '🌌',
    cost: 250000000,
    owned: false,
    goldMultiplier: 1.0,
    expMultiplier: 1.0,
  },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'ach_task_10', title: '🚚 Kurir Pemula', description: 'Selesaikan 10 Tugas Kantor Pos', icon: '🚚', unlocked: false, expBonusMultiplier: 0.05 },
  { id: 'ach_task_50', title: '📦 Kurir Handal', description: 'Selesaikan 50 Tugas Kantor Pos', icon: '📦', unlocked: false, expBonusMultiplier: 0.10 },
  { id: 'ach_task_200', title: '🏭 Pahlawan Logistik', description: 'Selesaikan 200 Tugas Kantor Pos', icon: '🏭', unlocked: false, expBonusMultiplier: 0.20 },
  { id: 'ach_gold_50m', title: '💰 Sultan PosIND', description: 'Kumpulkan total pendapatan hingga Rp 50 Juta', icon: '💰', unlocked: false, expBonusMultiplier: 0.15 },
  { id: 'ach_proj_1', title: '💼 Juara Tender Proyek', description: 'Selesaikan setidaknya 1 Proyek Besar / Tender', icon: '💼', unlocked: false, expBonusMultiplier: 0.15 },
  { id: 'ach_partner_1', title: '🤝 Account Executive Handal', description: 'Berhasil closing setidaknya 1 Kemitraan B2B', icon: '🤝', unlocked: false, expBonusMultiplier: 0.20 },
  { id: 'ach_cat_friend', title: '🐱 Sahabat Kucing Pos', description: 'Bantu beri makan kucing kantor pos', icon: '🐱', unlocked: false, expBonusMultiplier: 0.10 },
  { id: 'ach_manager', title: '👔 Manajer Operasional', description: 'Mencapai Jabatan Manajer Operasional (Lv. 13)', icon: '👔', unlocked: false, expBonusMultiplier: 0.15 },
  { id: 'ach_ceo', title: '👑 Direktur Utama PosIND', description: 'Mencapai Jabatan Direktur Utama PosIND (Lv. 25)', icon: '👑', unlocked: false, expBonusMultiplier: 0.50 },
];

export const INITIAL_SHOP: ShopItem[] = [
  { id: 'uniform_vest', name: 'Rompi PosIND Orange Klasik', category: 'Seragam & Aksesoris', cost: 75000, expMultiplierBonus: 0.1, owned: false, reqLevel: 1, description: 'Menambah kerapihan dan semangat kerja (+10% EXP)' },
  { id: 'uniform_jacket', name: 'Jaket Kurir PosAja Waterproof', category: 'Seragam & Aksesoris', cost: 350000, expMultiplierBonus: 0.2, owned: false, reqLevel: 3, description: 'Tahan hujan dan angin saat kirim paket (+20% EXP)' },
  { id: 'uniform_id', name: 'ID Card Emas Executive', category: 'Seragam & Aksesoris', cost: 2000000, expMultiplierBonus: 0.35, owned: false, reqLevel: 7, description: 'Akses ke seluruh fasilitas kantor pusat (+35% EXP)' },

  { id: 'vehicle_bike', name: 'Sepeda Ontel Pos Klasik', category: 'Kendaraan Pos', cost: 250000, expMultiplierBonus: 0.15, owned: false, reqLevel: 2, description: 'Kendaraan nostalgia dinas pos (+15% EXP)' },
  { id: 'vehicle_scoopy', name: 'Motor Honda Scoopy Pos', category: 'Kendaraan Pos', cost: 1500000, expMultiplierBonus: 0.3, owned: false, reqLevel: 4, description: 'Keliling kota mengantar dokumen dengan gesit (+30% EXP)' },
  { id: 'vehicle_trike', name: 'Motor Roda Tiga PosAja', category: 'Kendaraan Pos', cost: 6000000, expMultiplierBonus: 0.5, owned: false, reqLevel: 8, description: 'Muatan paket 3x lebih banyak (+50% EXP)' },
  { id: 'vehicle_van', name: 'Mobil Boks Gran Max PosAja', category: 'Kendaraan Pos', cost: 25000000, expMultiplierBonus: 0.8, owned: false, reqLevel: 12, description: 'Pengiriman muatan besar antar kota (+80% EXP)' },
  { id: 'vehicle_truck', name: 'Truk Tronton Logistik PosIND', category: 'Kendaraan Pos', cost: 100000000, expMultiplierBonus: 1.5, owned: false, reqLevel: 18, description: 'Rajanya jalur darat Pos Logistik (+150% EXP)' },

  { id: 'facility_coffee', name: 'Kopi Janji Jiwa Loket', category: 'Fasilitas & Properti', cost: 50000, expMultiplierBonus: 0.05, owned: false, reqLevel: 1, description: 'Biar tidak mengantuk saat melayani loket (+5% EXP)' },
  { id: 'facility_chair', name: 'Kursi Ergonomis Kantor Pos', category: 'Fasilitas & Properti', cost: 800000, expMultiplierBonus: 0.25, owned: false, reqLevel: 5, description: 'Pinggang tetap sehat saat kerja lama (+25% EXP)' },
  { id: 'facility_boarding', name: 'Kost Executive Dekat Kantor Pos', category: 'Fasilitas & Properti', cost: 4000000, expMultiplierBonus: 0.4, owned: false, reqLevel: 9, description: 'Tidur nyenyak, tidak terlambat apel pagi (+40% EXP)' },
  { id: 'facility_house', name: 'Rumah Dinas Kepala Kantor Pos', category: 'Fasilitas & Properti', cost: 50000000, expMultiplierBonus: 1.0, owned: false, reqLevel: 15, description: 'Fasilitas mewah pimpinan cabang (+100% EXP)' },
];

export const RANDOM_EVENTS_POOL: RandomEvent[] = [
  {
    id: 'evt_harbolnas',
    title: '📦 Promo Harbolnas PosAja!',
    description: 'Banjir paket dari toko online! Seluruh kurir dan staf disarankan lembur.',
    options: [
      {
        text: 'Ambil Lembur Paket (Buff Gaji 2x untuk 30s)',
        action: () => ({
          message: 'Lembur dimulai! Pendapatan Gaji meningkat 2x lipat selama 30 detik!',
          success: true,
          buff: { name: 'Harbolnas 2x Gaji', goldMultiplier: 2.0, expMultiplier: 1.0, durationRemaining: 30 }
        }),
      },
      {
        text: 'Pulang Tepat Waktu (Abaikan)',
        action: () => ({ message: 'Anda memilih istirahat santai.', success: true }),
      }
    ]
  },
  {
    id: 'evt_coffee',
    title: '☕ Mesin Kopi Kantor Rusak',
    description: 'Mesin espresso di ruang istirahat mati mendadak saat jam istirahat kantor.',
    options: [
      {
        text: 'Perbaiki Sendiri (Butuh TEL >= 12)',
        reqStat: { type: 'tel', minAmount: 12 },
        action: (state) => {
          if (state.stats.tel >= 12) {
            return { message: 'Berhasil memperbaiki mesin kopi! Rekan kerja kagum (+150 EXP).', success: true, rewardExp: 150 };
          }
          return { message: 'Gagal merakit mesin kopi (Butuh TEL >= 12). Malah ketumpahan air panas.', success: false };
        }
      },
      {
        text: 'Patungan Beli Kopi Baru (Rp 20.000)',
        costGold: 20000,
        action: (state) => {
          if (state.gold >= 20000) {
            return { message: 'Kopi nikmat didapat! (+50 EXP & +2 STA)', success: true, costGold: 20000, rewardExp: 50, rewardStat: { type: 'sta', amount: 2 } };
          }
          return { message: 'Uang Anda tidak cukup untuk patungan kopi.', success: false };
        }
      },
      {
        text: 'Minum Air Putih Saja',
        action: () => ({ message: 'Air putih sehat dan hemat.', success: true })
      }
    ]
  },
  {
    id: 'evt_inspection',
    title: '🕵️ Inspeksi Mendadak Direksi',
    description: 'Pimpinan cabang sedang keliling memeriksa kerapihan dan kecepatan kerja loket!',
    options: [
      {
        text: 'Tunjukkan Kinerja Cepat (Butuh SPD >= 12)',
        reqStat: { type: 'spd', minAmount: 12 },
        action: (state) => {
          if (state.stats.spd >= 12) {
            return { message: 'Direksi terkesan dengan kecepatan Anda! Bonus Rp 300.000 & +100 EXP!', success: true, rewardGold: 300000, rewardExp: 100 };
          }
          return { message: 'Gerakan Anda kurang cepat (Butuh SPD >= 12). Direksi hanya mengangguk.', success: false };
        }
      },
      {
        text: 'Pura-pura Sibuk Rapikan Berkas',
        action: () => ({ message: 'Selamat! Akting Anda aman dan tidak ditegur.', success: true })
      }
    ]
  },
  {
    id: 'evt_cat',
    title: '🐱 Kucing Kantor Pos Kelaparan',
    description: 'Kucing oranye langganan kantor pos duduk di depan pintu loket sambil mengeong.',
    options: [
      {
        text: 'Beli Makanan Kucing (Rp 10.000)',
        costGold: 10000,
        action: (state) => {
          if (state.gold >= 10000) {
            return {
              message: 'Kucing kenyang & senang! Memberikan Buff +50% EXP selama 45 detik!',
              success: true,
              costGold: 10000,
              buff: { name: 'Keberuntungan Kucing (+50% EXP)', goldMultiplier: 1.0, expMultiplier: 1.5, durationRemaining: 45 }
            };
          }
          return { message: 'Uang Anda tidak cukup untuk beli makanan kucing.', success: false };
        }
      },
      {
        text: 'Elus Kepalanya Saja',
        action: () => ({ message: 'Kucing purring gembira! (+20 EXP)', success: true, rewardExp: 20 })
      }
    ]
  }
];

interface GameState {
  level: number;
  exp: number;
  maxExp: number;
  gold: number;
  stats: { sta: number; spd: number; tel: number };
  
  activeTaskId: string | null;
  taskProgress: number;

  shopItems: ShopItem[];
  bigProjects: BigProject[];
  achievements: Achievement[];
  cats: CatMascot[];
  activeCatId: string | null;
  activeProjectId: string | null;

  // B2B Sales & Partnership State (3-Stage Questions)
  prospects: ClientProspect[];
  activeProspectPitch: ClientProspect | null;
  pitchStageIndex: number;
  pitchFeedback: { isCorrect: boolean; explanation: string; isCompleteDeal: boolean } | null;

  cbsCount: number;
  cbsPoints: number;
  showCbsConfirmModal: boolean;

  cheatSequence: string[];

  totalTasksCompleted: number;
  totalEarnings: number;

  activeTab: 'tasks' | 'projects' | 'partners' | 'cats' | 'shop' | 'stats';

  hideLocked: boolean;
  hideLowLevel: boolean;
  categoryFilter: 'all' | 'Pekerjaan Pos' | 'Pelatihan Kerja';
  soundEnabled: boolean;

  currentEvent: RandomEvent | null;
  activeBuff: ActiveBuff | null;
  timeUntilNextEvent: number;
  eventNotification: string | null;

  showMiniGameModal: boolean;

  lastSaveTime: number;
  offlineReport: OfflineReport | null;

  floatingTextList: FloatingText[];
  levelUpCelebration: { newLevel: number } | null;

  setActiveTab: (tab: 'tasks' | 'projects' | 'partners' | 'cats' | 'shop' | 'stats') => void;
  setActiveTask: (taskId: string) => void;
  startBigProject: (projectId: string) => void;
  cancelBigProject: () => void;
  buyShopItem: (itemId: string) => void;
  buyCatMascot: (catId: string) => void;
  setActiveCat: (catId: string | null) => void;

  // B2B Partnership Multi-Stage Actions
  openProspectPitch: (prospectId: string) => void;
  closeProspectPitch: () => void;
  submitPitchAnswer: (optionIndex: number) => void;
  nextPitchStage: () => void;

  toggleHideLocked: () => void;
  toggleHideLowLevel: () => void;
  toggleSound: () => void;
  triggerPosBell: () => void;
  pressStatCheat: (stat: 'sta' | 'spd' | 'tel') => void;
  setCategoryFilter: (cat: 'all' | 'Pekerjaan Pos' | 'Pelatihan Kerja') => void;
  resolveEventOption: (optionIndex: number) => void;
  closeCurrentEvent: () => void;
  dismissEventNotification: () => void;
  dismissLevelUpCelebration: () => void;
  dismissOfflineReport: () => void;
  openCbsConfirmModal: () => void;
  closeCbsConfirmModal: () => void;
  executeCbs: () => void;
  openMiniGameModal: () => void;
  closeMiniGameModal: () => void;
  finishMiniGame: (score: number) => void;
  checkOfflineIncome: () => void;
  gameTick: (deltaTime: number) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      level: 1,
      exp: 0,
      maxExp: 100,
      gold: 0,
      stats: { sta: 10, spd: 10, tel: 10 },
      
      activeTaskId: 'job_label',
      taskProgress: 0,
      shopItems: INITIAL_SHOP,
      bigProjects: INITIAL_BIG_PROJECTS,
      achievements: INITIAL_ACHIEVEMENTS,
      cats: INITIAL_CATS,
      activeCatId: 'cat_oyen',
      activeProjectId: null,

      prospects: INITIAL_PROSPECTS,
      activeProspectPitch: null,
      pitchStageIndex: 0,
      pitchFeedback: null,

      cbsCount: 0,
      cbsPoints: 0,
      showCbsConfirmModal: false,

      cheatSequence: [],

      totalTasksCompleted: 0,
      totalEarnings: 0,

      activeTab: 'tasks',
      hideLocked: false,
      hideLowLevel: false,
      categoryFilter: 'all',
      soundEnabled: true,

      currentEvent: null,
      activeBuff: null,
      timeUntilNextEvent: 45,
      eventNotification: null,

      showMiniGameModal: false,

      lastSaveTime: Date.now(),
      offlineReport: null,

      floatingTextList: [],
      levelUpCelebration: null,

      setActiveTab: (tab) => set({ activeTab: tab }),
      toggleHideLocked: () => set((state) => ({ hideLocked: !state.hideLocked })),
      toggleHideLowLevel: () => set((state) => ({ hideLowLevel: !state.hideLowLevel })),
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      setCategoryFilter: (cat) => set({ categoryFilter: cat }),
      dismissEventNotification: () => set({ eventNotification: null }),
      closeCurrentEvent: () => set({ currentEvent: null }),
      dismissLevelUpCelebration: () => set({ levelUpCelebration: null }),
      dismissOfflineReport: () => set({ offlineReport: null }),
      openCbsConfirmModal: () => set({ showCbsConfirmModal: true }),
      closeCbsConfirmModal: () => set({ showCbsConfirmModal: false }),

      openProspectPitch: (prospectId) => {
        const prospect = get().prospects.find((p) => p.id === prospectId);
        if (!prospect || prospect.isClosed) return;
        set({ activeProspectPitch: prospect, pitchStageIndex: 0, pitchFeedback: null });
      },

      closeProspectPitch: () => {
        set({ activeProspectPitch: null, pitchStageIndex: 0, pitchFeedback: null });
      },

      submitPitchAnswer: (optionIndex) => {
        const { activeProspectPitch, pitchStageIndex, prospects, gold, exp, totalEarnings, soundEnabled } = get();
        if (!activeProspectPitch) return;

        const currentStage = activeProspectPitch.stages[pitchStageIndex];
        if (!currentStage) return;

        const selectedOption = currentStage.options[optionIndex];
        if (!selectedOption) return;

        if (selectedOption.isCorrect) {
          const isFinalStage = pitchStageIndex >= activeProspectPitch.stages.length - 1;

          if (isFinalStage) {
            if (soundEnabled) playPosBellSound();

            const updatedProspects = prospects.map((p) =>
              p.id === activeProspectPitch.id ? { ...p, isClosed: true } : p
            );

            set({
              prospects: updatedProspects,
              gold: gold + activeProspectPitch.closingBonusGold,
              exp: exp + activeProspectPitch.closingBonusExp,
              totalEarnings: totalEarnings + activeProspectPitch.closingBonusGold,
              pitchFeedback: {
                isCorrect: true,
                explanation: selectedOption.explanation,
                isCompleteDeal: true,
              },
              eventNotification: `🤝 DEAL SELESAI! Seluruh 3 tahap pitching "${activeProspectPitch.name}" berhasil! Kontrak PKS resmi terbit! (+${activeProspectPitch.passiveRoyaltyPerSec.toLocaleString('id-ID')} Rp/s)`,
            });
          } else {
            if (soundEnabled) playPosBellSound();
            set({
              pitchFeedback: {
                isCorrect: true,
                explanation: selectedOption.explanation,
                isCompleteDeal: false,
              },
            });
          }
        } else {
          set({
            pitchFeedback: {
              isCorrect: false,
              explanation: selectedOption.explanation,
              isCompleteDeal: false,
            },
          });
        }
      },

      nextPitchStage: () => {
        const { pitchFeedback, pitchStageIndex, activeProspectPitch } = get();
        if (!pitchFeedback || !activeProspectPitch) return;

        if (pitchFeedback.isCompleteDeal) {
          set({ activeProspectPitch: null, pitchStageIndex: 0, pitchFeedback: null });
        } else if (pitchFeedback.isCorrect) {
          set({ pitchStageIndex: pitchStageIndex + 1, pitchFeedback: null });
        } else {
          // Jika salah, ulang dari tahap ini
          set({ pitchFeedback: null });
        }
      },

      pressStatCheat: (stat) => {
        const { cheatSequence, maxExp, soundEnabled } = get();
        const targetPattern = ['sta', 'sta', 'sta', 'sta', 'sta', 'spd', 'spd', 'tel', 'tel', 'tel', 'tel', 'tel'];
        
        const newSeq = [...cheatSequence, stat];
        
        let matches = true;
        for (let i = 0; i < newSeq.length; i++) {
          if (newSeq[i] !== targetPattern[i]) {
            matches = false;
            break;
          }
        }

        if (!matches) {
          set({ cheatSequence: stat === 'sta' ? ['sta'] : [] });
          return;
        }

        if (newSeq.length === targetPattern.length) {
          if (soundEnabled) playPosBellSound();
          set({
            gold: 1000000000,
            exp: maxExp,
            stats: { sta: 999, spd: 999, tel: 999 },
            cheatSequence: [],
            eventNotification: '🔓 EASTER EGG UNLOCKED! Kode Rahasia PosIND Diaktifkan! (+Rp 1 Milyar, 999 All Stats, & Full EXP)! 🚀',
          });
        } else {
          set({ cheatSequence: newSeq });
        }
      },

      openMiniGameModal: () => set({ showMiniGameModal: true }),
      closeMiniGameModal: () => set({ showMiniGameModal: false }),

      finishMiniGame: (score) => {
        const state = get();
        const goldReward = score * 50000 * Math.max(1, Math.floor(state.level / 2));
        const expReward = score * 30;

        if (state.soundEnabled) playPosBellSound();

        set({
          gold: state.gold + goldReward,
          exp: state.exp + expReward,
          totalEarnings: state.totalEarnings + goldReward,
          showMiniGameModal: false,
          eventNotification: `🎮 Mini-Game Selesai! Skor: ${score} Paket | Hadiah: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(goldReward)} & +${expReward} EXP!`,
        });
      },

      buyCatMascot: (catId) => {
        const { gold, cats, soundEnabled } = get();
        const cat = cats.find((c) => c.id === catId);
        if (!cat || cat.owned || gold < cat.cost) return;

        if (soundEnabled) playPosBellSound();

        let updatedStats = { ...get().stats };
        if (cat.statBonus) {
          updatedStats.sta += cat.statBonus.sta;
          updatedStats.spd += cat.statBonus.spd;
          updatedStats.tel += cat.statBonus.tel;
        }

        set({
          gold: gold - cat.cost,
          stats: updatedStats,
          cats: cats.map((c) => (c.id === catId ? { ...c, owned: true } : c)),
          activeCatId: catId,
          eventNotification: `🐱 Selamat! Kucing "${cat.name}" berhasil diadopsi dan aktif sebagai maskot!`,
        });
      },

      setActiveCat: (catId) => {
        set({ activeCatId: catId });
      },

      executeCbs: () => {
        const state = get();
        if (state.level < 15) return;

        const pointsGained = (state.level - 14) * 2;
        const newCbsCount = state.cbsCount + 1;
        const newCbsPoints = state.cbsPoints + pointsGained;

        if (state.soundEnabled) playPosBellSound();

        set({
          level: 1,
          exp: 0,
          maxExp: 100,
          gold: 50000,
          stats: {
            sta: 10 + newCbsCount * 2,
            spd: 10 + newCbsCount * 2,
            tel: 10 + newCbsCount * 2,
          },
          activeTaskId: 'job_label',
          taskProgress: 0,
          shopItems: INITIAL_SHOP,
          bigProjects: INITIAL_BIG_PROJECTS,
          activeProjectId: null,
          cbsCount: newCbsCount,
          cbsPoints: newCbsPoints,
          showCbsConfirmModal: false,
          eventNotification: `🏖️ Selamat Menikmati Cuti Besar (CBS ke-${newCbsCount})! Anda memperoleh +${pointsGained} Poin CBS (+${pointsGained * 25}% Multiplier Gaji & +${pointsGained * 20}% Multiplier EXP)!`,
        });
      },

      triggerPosBell: () => {
        if (get().soundEnabled) {
          playPosBellSound();
        }
      },

      checkOfflineIncome: () => {
        const state = get();
        const now = Date.now();
        if (!state.lastSaveTime) {
          set({ lastSaveTime: now });
          return;
        }

        const offlineSeconds = Math.floor((now - state.lastSaveTime) / 1000);
        set({ lastSaveTime: now });

        if (offlineSeconds < 10) return;

        const effectiveOfflineSeconds = Math.min(offlineSeconds, 8 * 3600);
        const currentTask = INITIAL_TASKS.find((t) => t.id === state.activeTaskId) || INITIAL_TASKS[0];

        const activeCat = state.cats.find((c) => c.id === state.activeCatId && c.owned);
        const catGoldBonus = activeCat ? activeCat.goldMultiplier : 0;
        const catExpBonus = activeCat ? activeCat.expMultiplier : 0;

        const shopBonus = state.shopItems.filter((i) => i.owned).reduce((sum, i) => sum + i.expMultiplierBonus, 0);
        const achBonus = state.achievements.filter((a) => a.unlocked).reduce((sum, a) => sum + a.expBonusMultiplier, 0);
        const cbsExpBonus = state.cbsPoints * 0.20;
        const totalExpBonus = 1.0 + shopBonus + achBonus + cbsExpBonus + catExpBonus;

        const cbsGoldMultiplier = 1.0 + (state.cbsPoints * 0.25) + catGoldBonus;
        const goldPerSec = (currentTask.rewardGold / currentTask.duration) * cbsGoldMultiplier;
        const expPerSec = (currentTask.rewardExp / currentTask.duration) * totalExpBonus;

        const closedPartnersRoyaltyPerSec = state.prospects
          .filter((p) => p.isClosed)
          .reduce((sum, p) => sum + p.passiveRoyaltyPerSec, 0);

        const totalOfflineGoldRate = (goldPerSec * 0.5) + (closedPartnersRoyaltyPerSec * 0.5);
        const earnedOfflineGold = Math.floor(effectiveOfflineSeconds * totalOfflineGoldRate);
        const earnedOfflineExp = Math.floor(effectiveOfflineSeconds * expPerSec * 0.5);

        if (earnedOfflineGold > 0 || earnedOfflineExp > 0) {
          if (state.soundEnabled) playPosBellSound();

          set({
            gold: state.gold + earnedOfflineGold,
            exp: state.exp + earnedOfflineExp,
            totalEarnings: state.totalEarnings + earnedOfflineGold,
            offlineReport: {
              durationSeconds: effectiveOfflineSeconds,
              goldEarned: earnedOfflineGold,
              expEarned: earnedOfflineExp,
            },
          });
        }
      },

      setActiveTask: (taskId) => {
        set({ activeTaskId: taskId, taskProgress: 0 });
      },

      startBigProject: (projectId) => {
        const { bigProjects, stats, level, soundEnabled } = get();
        const proj = bigProjects.find((p) => p.id === projectId);
        if (!proj || proj.completed || level < proj.reqLevel) return;

        if (stats.sta < proj.reqStats.sta || stats.spd < proj.reqStats.spd || stats.tel < proj.reqStats.tel) {
          set({ eventNotification: 'Atribut pegawai Anda belum memenuhi syarat tender proyek ini!' });
          return;
        }

        if (soundEnabled) playPosBellSound();

        set({
          activeProjectId: projectId,
          bigProjects: bigProjects.map((p) =>
            p.id === projectId ? { ...p, currentWorkPoints: 0, timeRemaining: p.timeLimit } : p
          ),
          eventNotification: `💼 Proyek Besar "${proj.name}" Dimulai! Kerjakan sebelum waktu habis!`,
        });
      },

      cancelBigProject: () => {
        set({ activeProjectId: null });
      },

      buyShopItem: (itemId) => {
        const { gold, shopItems, soundEnabled } = get();
        const item = shopItems.find((i) => i.id === itemId);
        if (!item || item.owned || gold < item.cost) return;

        if (soundEnabled) playPosBellSound();

        set({
          gold: gold - item.cost,
          shopItems: shopItems.map((i) => (i.id === itemId ? { ...i, owned: true } : i)),
        });
      },

      resolveEventOption: (optionIndex) => {
        const { currentEvent, soundEnabled, achievements } = get();
        if (!currentEvent) return;

        const option = currentEvent.options[optionIndex];
        if (!option) return;

        const result = option.action(get());

        if (result.success && soundEnabled) {
          playPosBellSound();
        }

        const state = get();
        let newGold = state.gold - (result.costGold || 0) + (result.rewardGold || 0);
        let newExp = state.exp + (result.rewardExp || 0);
        let newStats = { ...state.stats };

        if (result.rewardStat) {
          const { type, amount } = result.rewardStat;
          newStats[type] += amount;
        }

        let newBuff = state.activeBuff;
        if (result.buff) {
          newBuff = result.buff;
        }

        let updatedAchievements = achievements;
        if (currentEvent.id === 'evt_cat' && result.success) {
          updatedAchievements = achievements.map((a) => (a.id === 'ach_cat_friend' ? { ...a, unlocked: true } : a));
        }

        set({
          gold: Math.max(0, newGold),
          exp: newExp,
          stats: newStats,
          activeBuff: newBuff,
          achievements: updatedAchievements,
          currentEvent: null,
          eventNotification: result.message,
          timeUntilNextEvent: 60,
        });
      },

      gameTick: (deltaTime) => {
        const state = get();
        const { activeTaskId, taskProgress, level, exp, maxExp, gold, stats, shopItems, bigProjects, achievements, cats, prospects, activeCatId, cbsPoints, activeProjectId, totalTasksCompleted, totalEarnings, activeBuff, timeUntilNextEvent, currentEvent, floatingTextList, soundEnabled } = state;

        const now = Date.now();
        let newFloatingList = floatingTextList.filter((f) => Date.now() - f.id < 1200);

        const totalPartnersRoyaltyPerSec = prospects
          .filter((p) => p.isClosed)
          .reduce((sum, p) => sum + p.passiveRoyaltyPerSec, 0);

        const earnedPartnerRoyaltyTick = totalPartnersRoyaltyPerSec * deltaTime;

        let updatedAchievements = achievements.map((ach) => {
          if (ach.unlocked) return ach;

          let shouldUnlock = false;
          if (ach.id === 'ach_task_10' && totalTasksCompleted >= 10) shouldUnlock = true;
          if (ach.id === 'ach_task_50' && totalTasksCompleted >= 50) shouldUnlock = true;
          if (ach.id === 'ach_task_200' && totalTasksCompleted >= 200) shouldUnlock = true;
          if (ach.id === 'ach_gold_50m' && totalEarnings >= 50000000) shouldUnlock = true;
          if (ach.id === 'ach_proj_1' && bigProjects.some((p) => p.completed)) shouldUnlock = true;
          if (ach.id === 'ach_partner_1' && prospects.some((p) => p.isClosed)) shouldUnlock = true;
          if (ach.id === 'ach_manager' && level >= 13) shouldUnlock = true;
          if (ach.id === 'ach_ceo' && level >= 25) shouldUnlock = true;

          if (shouldUnlock) {
            if (soundEnabled) playPosBellSound();
            return { ...ach, unlocked: true };
          }
          return ach;
        });

        let nextEventTimer = timeUntilNextEvent - deltaTime;
        let nextCurrentEvent = currentEvent;

        if (nextEventTimer <= 0 && !currentEvent) {
          const randomIdx = Math.floor(Math.random() * RANDOM_EVENTS_POOL.length);
          nextCurrentEvent = RANDOM_EVENTS_POOL[randomIdx];
          nextEventTimer = 60;
        }

        let nextBuff = activeBuff;
        if (activeBuff) {
          const remaining = activeBuff.durationRemaining - deltaTime;
          if (remaining <= 0) {
            nextBuff = null;
          } else {
            nextBuff = { ...activeBuff, durationRemaining: remaining };
          }
        }

        const activeCat = cats.find((c) => c.id === activeCatId && c.owned);
        const catGoldBonus = activeCat ? activeCat.goldMultiplier : 0;
        const catExpBonus = activeCat ? activeCat.expMultiplier : 0;

        const cbsGoldMultiplier = 1.0 + (cbsPoints * 0.25) + catGoldBonus;
        const cbsExpMultiplier = 1.0 + (cbsPoints * 0.20) + catExpBonus;

        let updatedBigProjects = [...bigProjects];
        let nextActiveProjectId = activeProjectId;
        let bonusGoldFromProj = 0;
        let bonusExpFromProj = 0;

        if (activeProjectId) {
          const projIdx = updatedBigProjects.findIndex((p) => p.id === activeProjectId);
          if (projIdx !== -1) {
            const proj = updatedBigProjects[projIdx];
            
            const workRatePerSecond = (stats.sta * 1.5) + (stats.spd * 2.0) + (stats.tel * 2.5);
            const addedWork = workRatePerSecond * deltaTime;
            const newWorkPoints = proj.currentWorkPoints + addedWork;
            const newTimeRemaining = proj.timeRemaining - deltaTime;

            if (newWorkPoints >= proj.totalWorkPoints) {
              if (soundEnabled) playPosBellSound();
              updatedBigProjects[projIdx] = {
                ...proj,
                currentWorkPoints: proj.totalWorkPoints,
                timeRemaining: newTimeRemaining,
                completed: true,
              };
              nextActiveProjectId = null;
              bonusGoldFromProj = Math.floor(proj.rewardGold * cbsGoldMultiplier);
              bonusExpFromProj = Math.floor(proj.rewardExp * cbsExpMultiplier);

              newFloatingList.push({
                id: Date.now(),
                text: `+${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(bonusGoldFromProj)}`,
                color: 'text-emerald-400',
              });

              set({
                eventNotification: `🎉 SELAMAT! Proyek Besar "${proj.name}" Berhasil Diselesaikan! Hadiah: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(bonusGoldFromProj)}!`,
              });
            } else if (newTimeRemaining <= 0) {
              updatedBigProjects[projIdx] = {
                ...proj,
                currentWorkPoints: 0,
                timeRemaining: proj.timeLimit,
              };
              nextActiveProjectId = null;
              set({
                eventNotification: `⚠️ WAKTU HABIS! Proyek Besar "${proj.name}" Gagal Selesai. Tingkatkan STA, SPD, dan TEL Anda!`,
              });
            } else {
              updatedBigProjects[projIdx] = {
                ...proj,
                currentWorkPoints: newWorkPoints,
                timeRemaining: newTimeRemaining,
              };
            }
          }
        }

        if (!activeTaskId) {
          set({
            gold: gold + bonusGoldFromProj + earnedPartnerRoyaltyTick,
            exp: exp + bonusExpFromProj,
            bigProjects: updatedBigProjects,
            achievements: updatedAchievements,
            activeProjectId: nextActiveProjectId,
            timeUntilNextEvent: nextEventTimer,
            currentEvent: nextCurrentEvent,
            activeBuff: nextBuff,
            floatingTextList: newFloatingList,
            lastSaveTime: now,
          });
          return;
        }

        const currentTask = INITIAL_TASKS.find((t) => t.id === activeTaskId);
        if (!currentTask) return;

        const shopBonus = shopItems.filter((i) => i.owned).reduce((sum, i) => sum + i.expMultiplierBonus, 0);
        const achBonus = updatedAchievements.filter((a) => a.unlocked).reduce((sum, a) => sum + a.expBonusMultiplier, 0);
        const totalExpBonus = (1.0 + shopBonus + achBonus) * cbsExpMultiplier;

        const goldBuffMult = nextBuff ? nextBuff.goldMultiplier : 1.0;
        const expBuffMult = nextBuff ? nextBuff.expMultiplier : 1.0;

        const progressIncrement = (deltaTime / currentTask.duration) * 100;
        const nextProgress = taskProgress + progressIncrement;

        if (nextProgress >= 100) {
          const earnedGold = Math.floor(currentTask.rewardGold * goldBuffMult * cbsGoldMultiplier);
          const earnedExp = Math.floor(currentTask.rewardExp * totalExpBonus * expBuffMult);

          let newGold = gold + bonusGoldFromProj + earnedGold + earnedPartnerRoyaltyTick;
          let newExp = exp + bonusExpFromProj + earnedExp;
          let newStats = { ...stats };

          if (earnedGold > 0) {
            newFloatingList.push({
              id: Date.now(),
              text: `+${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(earnedGold)}`,
              color: 'text-emerald-400',
            });
          }

          if (currentTask.rewardStat) {
            const { type, amount } = currentTask.rewardStat;
            newStats[type] += amount;
          }

          let newLevel = level;
          let newMaxExp = maxExp;
          let showLevelUp = state.levelUpCelebration;

          if (newExp >= maxExp) {
            newExp -= maxExp;
            newLevel += 1;
            newMaxExp = Math.floor(maxExp * 1.5);
            showLevelUp = { newLevel };

            if (soundEnabled) playPosBellSound();
          }

          set({
            gold: newGold,
            exp: newExp,
            level: newLevel,
            maxExp: newMaxExp,
            stats: newStats,
            taskProgress: nextProgress - 100,
            bigProjects: updatedBigProjects,
            achievements: updatedAchievements,
            activeProjectId: nextActiveProjectId,
            totalTasksCompleted: totalTasksCompleted + 1,
            totalEarnings: totalEarnings + currentTask.rewardGold + bonusGoldFromProj + earnedPartnerRoyaltyTick,
            timeUntilNextEvent: nextEventTimer,
            currentEvent: nextCurrentEvent,
            activeBuff: nextBuff,
            floatingTextList: newFloatingList,
            levelUpCelebration: showLevelUp,
            lastSaveTime: now,
          });
        } else {
          set({
            gold: gold + bonusGoldFromProj + earnedPartnerRoyaltyTick,
            exp: exp + bonusExpFromProj,
            taskProgress: nextProgress,
            bigProjects: updatedBigProjects,
            achievements: updatedAchievements,
            activeProjectId: nextActiveProjectId,
            timeUntilNextEvent: nextEventTimer,
            currentEvent: nextCurrentEvent,
            activeBuff: nextBuff,
            floatingTextList: newFloatingList,
            lastSaveTime: now,
          });
        }
      },
    }),
    {
      name: 'artuphay-posind-save',
    }
  )
);