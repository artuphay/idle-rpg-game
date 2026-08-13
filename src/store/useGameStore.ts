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

  cbsCount: number;
  cbsPoints: number;
  showCbsConfirmModal: boolean;

  // Easter Egg Cheat Code Sequence State
  cheatSequence: string[];

  totalTasksCompleted: number;
  totalEarnings: number;

  activeTab: 'tasks' | 'projects' | 'cats' | 'shop' | 'stats';

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

  setActiveTab: (tab: 'tasks' | 'projects' | 'cats' | 'shop' | 'stats') => void;
  setActiveTask: (taskId: string) => void;
  startBigProject: (projectId: string) => void;
  cancelBigProject: () => void;
  buyShopItem: (itemId: string) => void;
  buyCatMascot: (catId: string) => void;
  setActiveCat: (catId: string | null) => void;
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

      // KODE CHEAT EASTER EGG: STA x5, SPD x2, TEL x5
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
            gold: 1000000000, // 1 Milyar Rp
            exp: maxExp, // Full EXP
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

        const earnedOfflineGold = Math.floor(effectiveOfflineSeconds * goldPerSec * 0.5);
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
        const { activeTaskId, taskProgress, level, exp, maxExp, gold, stats, shopItems, bigProjects, achievements, cats, activeCatId, cbsPoints, activeProjectId, totalTasksCompleted, totalEarnings, activeBuff, timeUntilNextEvent, currentEvent, floatingTextList, soundEnabled } = state;

        const now = Date.now();
        let newFloatingList = floatingTextList.filter((f) => Date.now() - f.id < 1200);

        let updatedAchievements = achievements.map((ach) => {
          if (ach.unlocked) return ach;

          let shouldUnlock = false;
          if (ach.id === 'ach_task_10' && totalTasksCompleted >= 10) shouldUnlock = true;
          if (ach.id === 'ach_task_50' && totalTasksCompleted >= 50) shouldUnlock = true;
          if (ach.id === 'ach_task_200' && totalTasksCompleted >= 200) shouldUnlock = true;
          if (ach.id === 'ach_gold_50m' && totalEarnings >= 50000000) shouldUnlock = true;
          if (ach.id === 'ach_proj_1' && bigProjects.some((p) => p.completed)) shouldUnlock = true;
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
            gold: gold + bonusGoldFromProj,
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

          let newGold = gold + bonusGoldFromProj + earnedGold;
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
            totalEarnings: totalEarnings + currentTask.rewardGold + bonusGoldFromProj,
            timeUntilNextEvent: nextEventTimer,
            currentEvent: nextCurrentEvent,
            activeBuff: nextBuff,
            floatingTextList: newFloatingList,
            levelUpCelebration: showLevelUp,
            lastSaveTime: now,
          });
        } else {
          set({
            gold: gold + bonusGoldFromProj,
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