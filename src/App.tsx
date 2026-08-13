import { useEffect, useState } from 'react';
import { useGameStore, INITIAL_TASKS } from './store/useGameStore';
import { initAudioUnlock } from './utils/audio';

export default function App() {
  const {
    level,
    exp,
    maxExp,
    gold,
    stats,
    activeTaskId,
    taskProgress,
    shopItems,
    bigProjects,
    achievements,
    cbsCount,
    cbsPoints,
    showCbsConfirmModal,
    activeProjectId,
    activeTab,
    totalTasksCompleted,
    totalEarnings,
    hideLocked,
    hideLowLevel,
    categoryFilter,
    soundEnabled,
    currentEvent,
    activeBuff,
    timeUntilNextEvent,
    eventNotification,
    floatingTextList,
    levelUpCelebration,
    offlineReport,
    setActiveTab,
    setActiveTask,
    startBigProject,
    cancelBigProject,
    buyShopItem,
    toggleHideLocked,
    toggleHideLowLevel,
    toggleSound,
    triggerPosBell,
    setCategoryFilter,
    resolveEventOption,
    closeCurrentEvent,
    dismissEventNotification,
    dismissLevelUpCelebration,
    dismissOfflineReport,
    openCbsConfirmModal,
    closeCbsConfirmModal,
    executeCbs,
    checkOfflineIncome,
    gameTick,
  } = useGameStore();

  const [activeStatTooltip, setActiveStatTooltip] = useState<'sta' | 'spd' | 'tel' | null>(null);

  useEffect(() => {
    initAudioUnlock();
    checkOfflineIncome();
    const interval = setInterval(() => {
      gameTick(0.1);
    }, 100);

    return () => clearInterval(interval);
  }, [gameTick, checkOfflineIncome]);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDurationText = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    let result = '';
    if (hrs > 0) result += `${hrs} Jam `;
    if (mins > 0) result += `${mins} Menit `;
    if (hrs === 0 && mins === 0) result += `${secs} Detik`;
    return result;
  };

  const getJobTitle = (lvl: number) => {
    if (lvl < 3) return 'Magang PosIND';
    if (lvl < 5) return 'Staf Sortir & Loket';
    if (lvl < 8) return 'Kurir Senior PosAja';
    if (lvl < 12) return 'Supervisior Hub Logistik';
    if (lvl < 16) return 'Manajer Operasional PosIND';
    if (lvl < 20) return 'Kepala Kantor Pos Utama';
    if (lvl < 25) return 'VP Corporate Strategy PosIND';
    return 'Direktur Utama PosIND';
  };

  const activeShopMultiplier = shopItems
    .filter((i) => i.owned)
    .reduce((sum, i) => sum + i.expMultiplierBonus, 0);

  const activeAchMultiplier = achievements
    .filter((a) => a.unlocked)
    .reduce((sum, a) => sum + a.expBonusMultiplier, 0);

  const cbsExpBonusMultiplier = cbsPoints * 0.20;
  const cbsGoldBonusMultiplier = cbsPoints * 0.25;
  const totalExpMultiplier = activeShopMultiplier + activeAchMultiplier + cbsExpBonusMultiplier;

  const filteredTasks = INITIAL_TASKS.filter((task) => {
    const isUnlocked = level >= task.reqLevel;
    const isActive = activeTaskId === task.id;

    if (categoryFilter !== 'all' && task.category !== categoryFilter) {
      return false;
    }

    if (hideLocked && !isUnlocked && !isActive) {
      return false;
    }

    if (hideLowLevel && isUnlocked && !isActive && level >= 5 && task.reqLevel < level - 3) {
      return false;
    }

    return true;
  });

  const currentWorkRate = (stats.sta * 1.5) + (stats.spd * 2.0) + (stats.tel * 2.5);
  const potentialCbsPoints = level >= 15 ? (level - 14) * 2 : 0;

  return (
    <div className="min-h-screen bg-[#0A0F1D] text-slate-100 p-3 sm:p-6 md:p-8 font-sans select-none antialiased relative overflow-x-hidden">
      <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
        
        {/* NOTIFIKASI EVENT / LENCANA / CBS */}
        {eventNotification && (
          <div className="bg-[#1E2D50] border border-orange-500 text-orange-300 p-3 sm:p-3.5 rounded-xl shadow-xl flex justify-between items-center text-xs">
            <span className="pr-2">📢 {eventNotification}</span>
            <button
              onClick={dismissEventNotification}
              className="bg-orange-500 text-slate-950 px-2.5 py-1 rounded-lg font-black text-[10px] hover:bg-orange-400 transition whitespace-nowrap"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Header Logo POS iND Style */}
        <div className="bg-[#141E36] border border-[#23335A] rounded-2xl p-4 sm:p-6 text-center shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-600 via-orange-500 to-blue-600"></div>

          {/* Tombol Klakson & Mute Suara */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={triggerPosBell}
              className="bg-[#0A0F1D] hover:bg-[#1E2D50] border border-orange-500/50 text-orange-400 text-[10px] sm:text-xs px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl font-bold transition flex items-center gap-1 shadow-md active:scale-95"
              title="Bunyikan Bel Sepeda Pos"
            >
              🔔 <span className="hidden sm:inline">Klakson Pos</span>
            </button>
            <button
              onClick={toggleSound}
              className="bg-[#0A0F1D] hover:bg-[#1E2D50] border border-[#23335A] text-slate-300 text-xs px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl font-bold transition active:scale-95"
              title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>
          </div>

          <div className="inline-flex flex-col items-center justify-center">
            <div className="flex items-baseline font-black text-2xl sm:text-3xl md:text-4xl tracking-tighter select-none">
              <span className="text-white">POS</span>
              <span className="text-orange-500 relative ml-1">
                <span className="inline-block w-2 h-2 bg-orange-500 rounded-tl-full rounded-tr-full absolute -top-1 left-0"></span>
                i
              </span>
              <span className="text-white">ND</span>
            </div>
            <span className="text-[8px] sm:text-[9px] md:text-[10px] text-slate-300 font-bold uppercase tracking-[0.25em] -mt-1">
              Logistik Indonesia
            </span>
          </div>

          <h1 className="text-base sm:text-lg md:text-xl font-extrabold text-orange-400 mt-2 tracking-tight">
            Artuphay Gabut di Pos Indonesia
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
            Simulasi Karir Pegawai PosIND — Kerjakan Tugas, Raih Gaji, Beli Aset, & Ambil Cuti Besar (CBS)!
          </p>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-2 sm:flex sm:justify-center gap-2 mt-4">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-3 sm:px-4 py-2 text-xs font-bold rounded-xl transition-all active:scale-95 ${
                activeTab === 'tasks'
                  ? 'bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20 font-black'
                  : 'bg-[#0A0F1D] text-slate-300 hover:bg-[#1E2D50] border border-[#23335A]'
              }`}
            >
              📋 Tugas & Pelatihan
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-3 sm:px-4 py-2 text-xs font-bold rounded-xl transition-all active:scale-95 ${
                activeTab === 'projects'
                  ? 'bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20 font-black'
                  : 'bg-[#0A0F1D] text-slate-300 hover:bg-[#1E2D50] border border-[#23335A]'
              }`}
            >
              💼 Proyek Besar
            </button>
            <button
              onClick={() => setActiveTab('shop')}
              className={`px-3 sm:px-4 py-2 text-xs font-bold rounded-xl transition-all active:scale-95 ${
                activeTab === 'shop'
                  ? 'bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20 font-black'
                  : 'bg-[#0A0F1D] text-slate-300 hover:bg-[#1E2D50] border border-[#23335A]'
              }`}
            >
              🛒 Toko Aset
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-3 sm:px-4 py-2 text-xs font-bold rounded-xl transition-all active:scale-95 ${
                activeTab === 'stats'
                  ? 'bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20 font-black'
                  : 'bg-[#0A0F1D] text-slate-300 hover:bg-[#1E2D50] border border-[#23335A]'
              }`}
            >
              🏆 Statistik & Lencana
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Panel Profil Pegawai Sidebar */}
          <div className="bg-[#141E36] border border-[#23335A] rounded-2xl p-4 sm:p-5 shadow-xl h-fit space-y-4 relative">
            <div className="border-b border-[#23335A] pb-3 flex justify-between items-start">
              <div>
                <h2 className="text-xs font-bold text-orange-400 uppercase tracking-wider">Jabatan Karir</h2>
                <p className="text-xs text-blue-300 font-extrabold mt-0.5">{getJobTitle(level)}</p>
              </div>
              {cbsCount > 0 && (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-black">
                  🏖️ CBS x{cbsCount}
                </span>
              )}
            </div>
            
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Level Karir</p>
              <p className="text-2xl font-black text-white">Lv. {level}</p>
            </div>

            {/* EXP Bar */}
            <div>
              <div className="flex justify-between text-xs mb-1 font-semibold">
                <span className="text-orange-400 text-[11px]">Pengalaman (EXP)</span>
                <span className="text-[11px]">{exp} / {maxExp}</span>
              </div>
              <div className="w-full bg-[#0A0F1D] rounded-full h-2.5 overflow-hidden border border-[#23335A]">
                <div
                  className="bg-orange-500 h-full rounded-full transition-all duration-100"
                  style={{ width: `${Math.min((exp / maxExp) * 100, 100)}%` }}
                ></div>
              </div>
              {totalExpMultiplier > 0 && (
                <p className="text-[10px] text-emerald-400 mt-1 font-semibold text-right">
                  ⚡ +{(totalExpMultiplier * 100).toFixed(0)}% Bonus EXP Karir
                </p>
              )}
            </div>

            {/* Total Gaji / Uang DENGAN ANIMASI TEKS MELAYANG */}
            <div className="bg-[#0A0F1D] p-3 rounded-xl border border-orange-500/20 relative">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Gaji / Uang Terkumpul</p>
              <p className="text-xl font-black text-emerald-400 mt-0.5">{formatRupiah(gold)}</p>

              {cbsGoldBonusMultiplier > 0 && (
                <p className="text-[9px] text-amber-400 font-bold mt-0.5">
                  🔥 Bonus CBS Gaji: +{(cbsGoldBonusMultiplier * 100).toFixed(0)}%
                </p>
              )}

              <div className="absolute top-2 right-3 pointer-events-none flex flex-col items-end">
                {floatingTextList.map((item) => (
                  <span
                    key={item.id}
                    className={`text-xs font-black animate-float-up ${item.color}`}
                  >
                    {item.text}
                  </span>
                ))}
              </div>
            </div>

            {/* Widget Status Event / Buff */}
            <div className="bg-[#0A0F1D] p-3 rounded-xl border border-[#23335A]">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Status Event / Buff</span>
                <span className="text-[10px] font-bold text-orange-400">⏱️ {timeUntilNextEvent.toFixed(0)}s</span>
              </div>

              {activeBuff ? (
                <div className="space-y-1.5 mt-2 bg-orange-500/10 border border-orange-500/30 p-2 rounded-lg">
                  <div className="flex justify-between text-xs font-black text-orange-300">
                    <span>⚡ {activeBuff.name}</span>
                    <span>{activeBuff.durationRemaining.toFixed(0)}s</span>
                  </div>
                  <div className="w-full bg-[#0A0F1D] rounded-full h-1.5 overflow-hidden border border-orange-500/30">
                    <div
                      className="bg-orange-500 h-full rounded-full transition-all duration-100"
                      style={{ width: `${Math.min(100, (activeBuff.durationRemaining / 45) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                  <span>🟢</span> Normal (Kerja Rutin)
                </p>
              )}
            </div>

            {/* Atribut Skill Pos */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Atribut Pegawai</p>
                  <p className="text-[9px] text-emerald-400 font-bold mt-0.5">⚡ Power: {currentWorkRate.toFixed(1)}/s</p>
                </div>
                <span className="text-[9px] text-orange-400 font-semibold italic">💡 Klik / Arahkan</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                {/* STA */}
                <div
                  onClick={() => setActiveStatTooltip(activeStatTooltip === 'sta' ? null : 'sta')}
                  onMouseEnter={() => setActiveStatTooltip('sta')}
                  onMouseLeave={() => setActiveStatTooltip(null)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer relative ${
                    activeStatTooltip === 'sta' ? 'bg-[#1E2D50] border-orange-500 scale-105 shadow-md z-20' : 'bg-[#0A0F1D] border-[#23335A] hover:border-orange-500/50'
                  }`}
                >
                  <span className="block text-red-400 font-extrabold text-[11px]">STA</span>
                  <span className="block text-[10px] text-slate-400">Stamina</span>
                  <span className="block text-xs font-black text-white mt-0.5">{stats.sta}</span>

                  {activeStatTooltip === 'sta' && (
                    <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-40 sm:w-48 bg-[#1E2D50] border border-orange-500 rounded-xl p-2.5 text-left text-xs shadow-2xl z-30 pointer-events-none">
                      <p className="font-extrabold text-red-400 text-[11px]">🔴 STA (Stamina)</p>
                      <p className="text-[10px] text-slate-300 leading-tight mt-1">
                        Ketahanan fisik pegawai. Memberikan 1.5 Work Points/detik pada Proyek Besar.
                      </p>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-orange-500"></div>
                    </div>
                  )}
                </div>

                {/* SPD */}
                <div
                  onClick={() => setActiveStatTooltip(activeStatTooltip === 'spd' ? null : 'spd')}
                  onMouseEnter={() => setActiveStatTooltip('spd')}
                  onMouseLeave={() => setActiveStatTooltip(null)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer relative ${
                    activeStatTooltip === 'spd' ? 'bg-[#1E2D50] border-orange-500 scale-105 shadow-md z-20' : 'bg-[#0A0F1D] border-[#23335A] hover:border-orange-500/50'
                  }`}
                >
                  <span className="block text-orange-400 font-extrabold text-[11px]">SPD</span>
                  <span className="block text-[10px] text-slate-400">Kecepatan</span>
                  <span className="block text-xs font-black text-white mt-0.5">{stats.spd}</span>

                  {activeStatTooltip === 'spd' && (
                    <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-40 sm:w-48 bg-[#1E2D50] border border-orange-500 rounded-xl p-2.5 text-left text-xs shadow-2xl z-30 pointer-events-none">
                      <p className="font-extrabold text-orange-400 text-[11px]">🟠 SPD (Kecepatan)</p>
                      <p className="text-[10px] text-slate-300 leading-tight mt-1">
                        Kelincahan sortir paket. Memberikan 2.0 Work Points/detik pada Proyek Besar.
                      </p>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-orange-500"></div>
                    </div>
                  )}
                </div>

                {/* TEL */}
                <div
                  onClick={() => setActiveStatTooltip(activeStatTooltip === 'tel' ? null : 'tel')}
                  onMouseEnter={() => setActiveStatTooltip('tel')}
                  onMouseLeave={() => setActiveStatTooltip(null)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer relative ${
                    activeStatTooltip === 'tel' ? 'bg-[#1E2D50] border-orange-500 scale-105 shadow-md z-20' : 'bg-[#0A0F1D] border-[#23335A] hover:border-orange-500/50'
                  }`}
                >
                  <span className="block text-blue-400 font-extrabold text-[11px]">TEL</span>
                  <span className="block text-[10px] text-slate-400">Ketelitian</span>
                  <span className="block text-xs font-black text-white mt-0.5">{stats.tel}</span>

                  {activeStatTooltip === 'tel' && (
                    <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-40 sm:w-48 bg-[#1E2D50] border border-orange-500 rounded-xl p-2.5 text-left text-xs shadow-2xl z-30 pointer-events-none">
                      <p className="font-extrabold text-blue-400 text-[11px]">🔵 TEL (Ketelitian)</p>
                      <p className="text-[10px] text-slate-300 leading-tight mt-1">
                        Akurasi sistem & pabean. Memberikan 2.5 Work Points/detik pada Proyek Besar.
                      </p>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-orange-500"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-2">
            
            {/* TAB 1: TUGAS & PEKERJAAN */}
            {activeTab === 'tasks' && (
              <div className="bg-[#141E36] border border-[#23335A] rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
                
                {/* Control Filters */}
                <div className="space-y-3 border-b border-[#23335A] pb-3">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <h2 className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                      Daftar Tugas & Pelatihan
                    </h2>

                    <div className="flex gap-1 text-[10px] font-bold">
                      <button
                        onClick={() => setCategoryFilter('all')}
                        className={`px-2.5 py-1 rounded-lg border transition-all ${
                          categoryFilter === 'all'
                            ? 'bg-orange-500 text-slate-950 border-orange-500 font-black'
                            : 'bg-[#0A0F1D] text-slate-400 border-[#23335A] hover:text-white'
                        }`}
                      >
                        Semua
                      </button>
                      <button
                        onClick={() => setCategoryFilter('Pekerjaan Pos')}
                        className={`px-2.5 py-1 rounded-lg border transition-all ${
                          categoryFilter === 'Pekerjaan Pos'
                            ? 'bg-orange-500 text-slate-950 border-orange-500 font-black'
                            : 'bg-[#0A0F1D] text-slate-400 border-[#23335A] hover:text-white'
                        }`}
                      >
                        Pekerjaan
                      </button>
                      <button
                        onClick={() => setCategoryFilter('Pelatihan Kerja')}
                        className={`px-2.5 py-1 rounded-lg border transition-all ${
                          categoryFilter === 'Pelatihan Kerja'
                            ? 'bg-orange-500 text-slate-950 border-orange-500 font-black'
                            : 'bg-[#0A0F1D] text-slate-400 border-[#23335A] hover:text-white'
                        }`}
                      >
                        Pelatihan
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs">
                    <button
                      onClick={toggleHideLocked}
                      className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold transition-all ${
                        hideLocked
                          ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                          : 'bg-[#0A0F1D] text-slate-400 border-[#23335A] hover:border-slate-500'
                      }`}
                    >
                      {hideLocked ? '🔒 Task Terkunci: SEMBUNYI' : '🔓 Task Terkunci: TAMPIL'}
                    </button>

                    <button
                      onClick={toggleHideLowLevel}
                      className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold transition-all ${
                        hideLowLevel
                          ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                          : 'bg-[#0A0F1D] text-slate-400 border-[#23335A] hover:border-slate-500'
                      }`}
                    >
                      {hideLowLevel ? '📉 Task Lv. Rendah: SEMBUNYI' : '📈 Task Lv. Rendah: TAMPIL'}
                    </button>
                  </div>
                </div>

                {/* List Task */}
                <div className="space-y-3 max-h-[460px] overflow-y-auto custom-scroll pr-1">
                  {filteredTasks.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-xs italic">
                      Tidak ada tugas yang sesuai dengan filter pilihan Anda.
                    </div>
                  ) : (
                    filteredTasks.map((task) => {
                      const isUnlocked = level >= task.reqLevel;
                      const isNearUnlock = level >= task.reqLevel - 2;
                      const isActive = activeTaskId === task.id;

                      if (!isUnlocked && !isNearUnlock) {
                        return (
                          <div
                            key={task.id}
                            className="p-3.5 rounded-xl border border-[#1C2B4E] bg-[#0A0F1D]/40 opacity-40 flex justify-between items-center"
                          >
                            <div>
                              <h3 className="font-bold text-slate-500 text-xs tracking-wider">🔒 ??? (Pekerjaan Rahasia)</h3>
                              <p className="text-[10px] text-slate-600 mt-0.5">Capai level karir lebih tinggi untuk mengungkap tugas ini</p>
                            </div>
                            <span className="text-[10px] font-bold text-slate-600 border border-slate-800 px-2.5 py-1 rounded-lg shrink-0">
                              Lv. {task.reqLevel}
                            </span>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={task.id}
                          className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                            isActive
                              ? 'bg-[#1E2D50] border-orange-500 shadow-lg animate-glow'
                              : isUnlocked
                              ? 'bg-[#0A0F1D]/60 border-[#23335A] hover:border-slate-500'
                              : 'bg-[#0A0F1D]/30 border-[#1C2B4E] opacity-60'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1.5">
                            <span className={`text-[9px] sm:text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                              task.category === 'Pekerjaan Pos' 
                                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' 
                                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            }`}>
                              {task.category}
                            </span>

                            {!isUnlocked && (
                              <span className="text-[9px] sm:text-[10px] text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                                🔒 Terkunci (Lv. {task.reqLevel})
                              </span>
                            )}
                          </div>

                          <h3 className="font-extrabold text-white text-xs sm:text-sm leading-snug">
                            {isUnlocked ? task.name : `🔒 ${task.name}`}
                          </h3>

                          <div className="flex justify-between items-end gap-2 mt-2 pt-2 border-t border-[#23335A]/50">
                            <p className="text-[10px] sm:text-[11px] text-slate-400 leading-tight">
                              ⏱️ {task.duration}s <br />
                              💰 <span className="text-emerald-400 font-semibold">+{formatRupiah(task.rewardGold)}</span> | ✨ +{task.rewardExp} EXP
                              {task.rewardStat && ` | +${task.rewardStat.amount} ${task.rewardStat.type.toUpperCase()}`}
                            </p>

                            {isUnlocked && (
                              <button
                                onClick={() => setActiveTask(task.id)}
                                disabled={isActive}
                                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all shrink-0 active:scale-95 ${
                                  isActive
                                    ? 'bg-orange-500 text-slate-950 font-black cursor-default'
                                    : 'bg-[#1E2D50] hover:bg-orange-600 hover:text-white text-slate-200 border border-[#304573]'
                                }`}
                              >
                                {isActive ? 'Bekerja...' : 'Kerjakan'}
                              </button>
                            )}
                          </div>

                          {isActive && (
                            <div className="w-full bg-[#0A0F1D] rounded-full h-1.5 mt-2.5 overflow-hidden border border-[#23335A]">
                              <div
                                className="bg-orange-400 h-full rounded-full transition-all duration-100"
                                style={{ width: `${taskProgress}%` }}
                              ></div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: PROYEK BESAR / TENDER */}
            {activeTab === 'projects' && (
              <div className="bg-[#141E36] border border-[#23335A] rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
                <div className="border-b border-[#23335A] pb-3">
                  <h2 className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                    Tender Proyek Besar & Logistik Nasional
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Daya Serang Proyek = (STA x 1.5) + (SPD x 2) + (TEL x 2.5) = <span className="text-emerald-400 font-bold">{currentWorkRate.toFixed(1)} WP/s</span>
                  </p>
                </div>

                <div className="space-y-3 max-h-[460px] overflow-y-auto custom-scroll pr-1">
                  {bigProjects.map((proj) => {
                    const isUnlocked = level >= proj.reqLevel;
                    const hasStats = stats.sta >= proj.reqStats.sta && stats.spd >= proj.reqStats.spd && stats.tel >= proj.reqStats.tel;
                    const isRunning = activeProjectId === proj.id;

                    return (
                      <div
                        key={proj.id}
                        className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                          isRunning
                            ? 'bg-[#1E2D50] border-orange-500 shadow-xl animate-glow'
                            : proj.completed
                            ? 'bg-emerald-950/20 border-emerald-800/50'
                            : isUnlocked && hasStats
                            ? 'bg-[#0A0F1D]/70 border-[#23335A] hover:border-slate-500'
                            : 'bg-[#0A0F1D]/30 border-[#1C2B4E] opacity-60'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2 border-b border-[#23335A]/50 pb-2">
                          <div>
                            <h3 className="font-extrabold text-white text-xs sm:text-sm leading-snug">{proj.name}</h3>
                            <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 leading-tight">{proj.description}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs sm:text-sm font-black text-emerald-400 block">{formatRupiah(proj.rewardGold)}</span>
                            <span className="text-[10px] text-orange-400 font-bold block mt-0.5">+{proj.rewardExp} EXP</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
                          <div className="flex flex-wrap gap-1.5">
                            <span className={`text-[9px] sm:text-[10px] px-2 py-0.5 rounded font-bold ${stats.sta >= proj.reqStats.sta ? 'bg-red-950/80 text-red-300 border border-red-800' : 'bg-slate-900 text-slate-500'}`}>
                              STA ≥ {proj.reqStats.sta}
                            </span>
                            <span className={`text-[9px] sm:text-[10px] px-2 py-0.5 rounded font-bold ${stats.spd >= proj.reqStats.spd ? 'bg-amber-950/80 text-amber-300 border border-amber-800' : 'bg-slate-900 text-slate-500'}`}>
                              SPD ≥ {proj.reqStats.spd}
                            </span>
                            <span className={`text-[9px] sm:text-[10px] px-2 py-0.5 rounded font-bold ${stats.tel >= proj.reqStats.tel ? 'bg-blue-950/80 text-blue-300 border border-blue-800' : 'bg-slate-900 text-slate-500'}`}>
                              TEL ≥ {proj.reqStats.tel}
                            </span>
                          </div>

                          <span className="text-[10px] text-slate-400 font-semibold">⏱️ {proj.timeLimit}s</span>
                        </div>

                        {isRunning && (
                          <div className="mt-3 space-y-1.5 bg-[#0A0F1D] p-2.5 rounded-lg border border-orange-500/50">
                            <div className="flex justify-between text-[11px] font-bold">
                              <span className="text-orange-300">
                                Work Points: {proj.currentWorkPoints.toFixed(0)} / {proj.totalWorkPoints}
                              </span>
                              <span className="text-red-400">⏱️ Sisa: {proj.timeRemaining.toFixed(0)}s</span>
                            </div>
                            <div className="w-full bg-[#141E36] rounded-full h-2.5 overflow-hidden border border-orange-500/30">
                              <div
                                className="bg-gradient-to-r from-orange-500 to-amber-400 h-full rounded-full transition-all duration-100"
                                style={{ width: `${Math.min(100, (proj.currentWorkPoints / proj.totalWorkPoints) * 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        <div className="mt-3 pt-2 border-t border-[#23335A]/50 flex justify-end items-center">
                          {proj.completed ? (
                            <span className="text-xs font-extrabold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-3 py-1 rounded-lg">
                              ✓ Proyek Selesai!
                            </span>
                          ) : isRunning ? (
                            <button
                              onClick={cancelBigProject}
                              className="w-full sm:w-auto px-3 py-1.5 text-xs font-bold bg-red-600/80 hover:bg-red-500 text-white rounded-xl transition active:scale-95"
                            >
                              Batalkan Proyek
                            </button>
                          ) : (
                            <button
                              onClick={() => startBigProject(proj.id)}
                              disabled={!isUnlocked || !hasStats || activeProjectId !== null}
                              className={`w-full sm:w-auto px-4 py-2 text-xs font-extrabold rounded-xl transition active:scale-95 ${
                                isUnlocked && hasStats && activeProjectId === null
                                  ? 'bg-orange-500 hover:bg-orange-400 text-slate-950 shadow-md font-black'
                                  : 'bg-[#0A0F1D] text-slate-500 cursor-not-allowed border border-[#23335A]'
                              }`}
                            >
                              {!isUnlocked
                                ? `Terkunci (Lv. ${proj.reqLevel})`
                                : !hasStats
                                ? 'Atribut Belum Cukup'
                                : activeProjectId !== null
                                ? 'Sedang Proyek Lain'
                                : 'Mulai Tender Proyek'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: TOKO ASET */}
            {activeTab === 'shop' && (
              <div className="bg-[#141E36] border border-[#23335A] rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
                <h2 className="text-xs font-bold text-orange-400 border-b border-[#23335A] pb-2 uppercase tracking-wider">
                  Toko Seragam, Kendaraan & Fasilitas PosIND
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto custom-scroll pr-1">
                  {shopItems.map((item) => {
                    const isUnlocked = level >= item.reqLevel;
                    const canAfford = gold >= item.cost;

                    if (!isUnlocked && level < item.reqLevel - 2) {
                      return (
                        <div
                          key={item.id}
                          className="bg-[#0A0F1D]/30 border border-[#1C2B4E] p-3.5 rounded-xl opacity-40 flex flex-col justify-between"
                        >
                          <div>
                            <h4 className="font-bold text-slate-500 text-xs">🔒 ??? (Aset Misteri)</h4>
                            <p className="text-[10px] text-slate-600 mt-0.5">Capai level lebih tinggi untuk membuka barang ini.</p>
                          </div>
                          <div className="mt-2 text-right">
                            <span className="text-[10px] text-slate-600 font-bold">Butuh Lv. {item.reqLevel}</span>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={item.id}
                        className="bg-[#0A0F1D]/70 border border-[#23335A] p-3.5 rounded-xl flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-slate-200 text-xs">{item.name}</h4>
                            <span className="text-[9px] bg-[#1E2D50] text-slate-300 px-2 py-0.5 rounded-full font-medium">
                              {item.category}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1 italic">{item.description}</p>
                          <p className="text-[10px] text-emerald-400 mt-1.5 font-bold">
                            ⚡ +{item.expMultiplierBonus * 100}% Bonus EXP
                          </p>
                        </div>

                        <div className="mt-3 flex justify-between items-center border-t border-[#23335A] pt-2.5">
                          <span className="text-xs font-black text-emerald-400">{formatRupiah(item.cost)}</span>
                          
                          {item.owned ? (
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded-lg">
                              Dimiliki
                            </span>
                          ) : (
                            <button
                              onClick={() => buyShopItem(item.id)}
                              disabled={!isUnlocked || !canAfford}
                              className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all active:scale-95 ${
                                isUnlocked && canAfford
                                  ? 'bg-orange-500 hover:bg-orange-400 text-slate-950 font-black'
                                  : 'bg-[#1E2D50] text-slate-500 cursor-not-allowed border border-[#23335A]'
                              }`}
                            >
                              Beli
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 4: STATISTIK, LENCANA & CUTI BESAR (CBS) */}
            {activeTab === 'stats' && (
              <div className="bg-[#141E36] border border-[#23335A] rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
                <h2 className="text-xs font-bold text-orange-400 border-b border-[#23335A] pb-2 uppercase tracking-wider">
                  Pencapaian & Cuti Besar (CBS)
                </h2>

                {/* KARTU PRESTIGE CUTI BESAR (CBS) */}
                <div className="bg-gradient-to-br from-amber-600/30 via-[#1E2D50] to-[#0A0F1D] border-2 border-amber-500/60 p-4 rounded-2xl shadow-xl space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🏖️</span>
                        <h3 className="font-black text-amber-400 text-sm sm:text-base">Program Cuti Besar (CBS)</h3>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                        Nikmati hak Cuti Besar setelah berbakti lama di PosIND. Reset ke Lv. 1 dengan pelipatgandaan gaji & EXP permanen!
                      </p>
                    </div>

                    <div className="text-right shrink-0 bg-[#0A0F1D] px-2.5 py-1 rounded-xl border border-amber-500/40">
                      <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold block">Total Poin</span>
                      <span className="text-xs sm:text-sm font-black text-amber-400">{cbsPoints} Poin</span>
                    </div>
                  </div>

                  {/* Multiplier Efek CBS Aktif */}
                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="bg-[#0A0F1D]/80 p-2 rounded-xl border border-[#23335A]">
                      <span className="text-[10px] text-slate-400 block font-semibold">Bonus Multiplier Gaji</span>
                      <span className="text-xs sm:text-sm font-black text-emerald-400">
                        {cbsPoints > 0 ? `+${(cbsGoldBonusMultiplier * 100).toFixed(0)}%` : '0%'}
                      </span>
                    </div>
                    <div className="bg-[#0A0F1D]/80 p-2 rounded-xl border border-[#23335A]">
                      <span className="text-[10px] text-slate-400 block font-semibold">Bonus Multiplier EXP</span>
                      <span className="text-xs sm:text-sm font-black text-orange-400">
                        {cbsPoints > 0 ? `+${(cbsExpBonusMultiplier * 100).toFixed(0)}%` : '0%'}
                      </span>
                    </div>
                  </div>

                  {/* Tombol Ambil CBS */}
                  <div className="flex justify-between items-center pt-2 border-t border-[#23335A]">
                    <span className="text-[10px] text-slate-300 font-semibold">
                      {level >= 15 ? (
                        <span className="text-emerald-400 font-bold">✨ Mendapat +{potentialCbsPoints} Poin CBS jika cuti sekarang</span>
                      ) : (
                        <span className="text-slate-400 italic">🔒 Butuh Lv. 15 (Saat ini Lv. {level})</span>
                      )}
                    </span>

                    <button
                      onClick={openCbsConfirmModal}
                      disabled={level < 15}
                      className={`px-4 py-2 text-xs font-black rounded-xl transition active:scale-95 ${
                        level >= 15
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg hover:brightness-110'
                          : 'bg-[#0A0F1D] text-slate-500 border border-[#23335A] cursor-not-allowed'
                      }`}
                    >
                      🏖️ Ambil Cuti Besar (CBS)
                    </button>
                  </div>
                </div>

                {/* Ringkasan Statistik */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-[#0A0F1D] p-3.5 rounded-xl border border-[#23335A]">
                    <p className="text-[10px] text-slate-400 font-semibold">Total Tugas Diselesaikan</p>
                    <p className="text-2xl font-black text-orange-400 mt-0.5">{totalTasksCompleted} Kali</p>
                  </div>

                  <div className="bg-[#0A0F1D] p-3.5 rounded-xl border border-[#23335A]">
                    <p className="text-[10px] text-slate-400 font-semibold">Total Pendapatan Karir</p>
                    <p className="text-xl font-black text-emerald-400 mt-0.5">{formatRupiah(totalEarnings)}</p>
                  </div>
                </div>

                {/* GRID LENCANA KARIR (ACHIEVEMENTS) */}
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold text-white">Daftar Lencana Karir:</h3>
                    <span className="text-[10px] text-emerald-400 font-bold">
                      {achievements.filter((a) => a.unlocked).length} / {achievements.length} Terbuka
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[340px] overflow-y-auto custom-scroll pr-1">
                    {achievements.map((ach) => (
                      <div
                        key={ach.id}
                        className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                          ach.unlocked
                            ? 'bg-[#1E2D50] border-amber-400 shadow-md'
                            : 'bg-[#0A0F1D]/40 border-[#23335A] opacity-50'
                        }`}
                      >
                        <span className="text-2xl p-2 bg-[#0A0F1D] rounded-xl border border-[#23335A] shrink-0">
                          {ach.unlocked ? ach.icon : '🔒'}
                        </span>

                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className={`font-bold text-xs ${ach.unlocked ? 'text-amber-300' : 'text-slate-400'}`}>
                              {ach.title}
                            </h4>
                            {ach.unlocked && (
                              <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-bold">
                                Terbuka
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">{ach.description}</p>
                          <p className="text-[10px] text-emerald-400 mt-1 font-bold">
                            ⚡ +{(ach.expBonusMultiplier * 100).toFixed(0)}% Bonus EXP Karir
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Aset Terbeli */}
                <div className="bg-[#0A0F1D] p-3.5 rounded-xl border border-[#23335A] mt-3">
                  <h3 className="text-xs font-bold text-white mb-2">Aset Terbeli:</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {shopItems.filter((i) => i.owned).length === 0 ? (
                      <p className="text-[10px] text-slate-500 italic">Belum ada aset yang dibeli.</p>
                    ) : (
                      shopItems
                        .filter((i) => i.owned)
                        .map((i) => (
                          <span key={i.id} className="bg-[#1E2D50] border border-[#304573] text-slate-200 text-[10px] px-2.5 py-0.5 rounded-full font-semibold">
                            ✓ {i.name}
                          </span>
                        ))
                    )}
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>
      </div>

      {/* 1. POPUP MODAL EVENT ACAK */}
      {currentEvent && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#141E36] border-2 border-orange-500 rounded-2xl max-w-xs sm:max-w-md w-full p-4 sm:p-6 shadow-2xl relative space-y-3 sm:space-y-4">
            <button
              onClick={closeCurrentEvent}
              className="absolute top-3 right-3 text-slate-400 hover:text-white bg-[#0A0F1D] hover:bg-[#1E2D50] w-7 h-7 rounded-full font-extrabold text-xs flex items-center justify-center border border-[#23335A] transition shadow-md"
              title="Tutup Modal"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 pr-6">
              <span className="text-xl sm:text-2xl">⚠️</span>
              <h3 className="font-extrabold text-orange-400 text-sm sm:text-base leading-tight">{currentEvent.title}</h3>
            </div>

            <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">{currentEvent.description}</p>

            <div className="space-y-2 pt-2 border-t border-[#23335A]">
              {currentEvent.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => resolveEventOption(idx)}
                  className="w-full text-left p-2.5 sm:p-3 rounded-xl bg-[#0A0F1D] hover:bg-[#1E2D50] border border-[#23335A] hover:border-orange-500/50 text-[11px] sm:text-xs font-bold text-slate-200 transition flex justify-between items-center group active:scale-95"
                >
                  <span className="pr-2">{option.text}</span>
                  <span className="text-orange-400 group-hover:translate-x-1 transition-transform">➔</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. POPUP SELEBRASI LEVEL UP JABATAN */}
      {levelUpCelebration && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#141E36] border-2 border-amber-400 rounded-2xl max-w-xs sm:max-w-sm w-full p-6 text-center shadow-2xl space-y-4 animate-glow relative">
            <button
              onClick={dismissLevelUpCelebration}
              className="absolute top-3 right-3 text-slate-400 hover:text-white bg-[#0A0F1D] hover:bg-[#1E2D50] w-7 h-7 rounded-full font-extrabold text-xs flex items-center justify-center border border-[#23335A] transition shadow-md"
              title="Tutup"
            >
              ✕
            </button>

            <div className="text-4xl animate-bounce">🎉</div>
            <div>
              <span className="text-[10px] uppercase font-black tracking-widest text-amber-400">Promosi Jabatan PosIND</span>
              <h3 className="text-2xl font-black text-white mt-1">Level {levelUpCelebration.newLevel}!</h3>
              <p className="text-xs text-blue-300 font-bold mt-1">{getJobTitle(levelUpCelebration.newLevel)}</p>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Selamat! Kerja keras Anda diapresiasi. Pekerjaan dan tender proyek baru siap dibuka!
            </p>

            <button
              onClick={dismissLevelUpCelebration}
              className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg hover:brightness-110 transition active:scale-95"
            >
              Terima Promosi! 🚀
            </button>
          </div>
        </div>
      )}

      {/* 3. POPUP LAPORAN GAJI OFFLINE */}
      {offlineReport && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#141E36] border-2 border-emerald-500 rounded-2xl max-w-xs sm:max-w-sm w-full p-6 text-center shadow-2xl space-y-4 animate-glow relative">
            <button
              onClick={dismissOfflineReport}
              className="absolute top-3 right-3 text-slate-400 hover:text-white bg-[#0A0F1D] hover:bg-[#1E2D50] w-7 h-7 rounded-full font-extrabold text-xs flex items-center justify-center border border-[#23335A] transition shadow-md"
              title="Tutup"
            >
              ✕
            </button>

            <div className="text-4xl animate-bounce">💰</div>
            <div>
              <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400">Laporan Gaji Offline PosIND</span>
              <h3 className="text-xl font-black text-white mt-1">Selamat Datang Kembali!</h3>
              <p className="text-xs text-slate-300 mt-1">
                Anda offline selama <span className="text-orange-400 font-bold">{formatDurationText(offlineReport.durationSeconds)}</span> (Rate 50% maks. 8 Jam).
              </p>
            </div>

            <div className="bg-[#0A0F1D] p-3 rounded-xl border border-emerald-500/30 space-y-1">
              <p className="text-xs text-slate-400 font-semibold">Gaji Terkumpul:</p>
              <p className="text-2xl font-black text-emerald-400">{formatRupiah(offlineReport.goldEarned)}</p>
              <p className="text-xs text-orange-400 font-bold">+{offlineReport.expEarned} EXP</p>
            </div>

            <button
              onClick={dismissOfflineReport}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition active:scale-95"
            >
              Ambil Gaji Offline! 💰
            </button>
          </div>
        </div>
      )}

      {/* 4. POPUP MODAL KONFIRMASI CUTI BESAR (CBS) */}
      {showCbsConfirmModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#141E36] border-2 border-amber-500 rounded-2xl max-w-xs sm:max-w-md w-full p-6 shadow-2xl space-y-4 relative">
            <button
              onClick={closeCbsConfirmModal}
              className="absolute top-3 right-3 text-slate-400 hover:text-white bg-[#0A0F1D] hover:bg-[#1E2D50] w-7 h-7 rounded-full font-extrabold text-xs flex items-center justify-center border border-[#23335A] transition shadow-md"
              title="Tutup"
            >
              ✕
            </button>

            <div className="text-center">
              <span className="text-4xl block animate-bounce">🏖️</span>
              <h3 className="text-lg font-black text-amber-400 mt-2">Ambil Cuti Besar (CBS)?</h3>
              <p className="text-xs text-slate-300 mt-1">
                Anda akan mendapatkan <span className="text-amber-400 font-extrabold">+{potentialCbsPoints} Poin CBS</span> secara permanen!
              </p>
            </div>

            <div className="bg-[#0A0F1D] p-3.5 rounded-xl border border-amber-500/30 text-xs space-y-2 text-slate-300">
              <p className="font-bold text-white border-b border-[#23335A] pb-1.5">Manfaat Cuti Besar (CBS):</p>
              <ul className="space-y-1 text-[11px]">
                <li className="text-emerald-400 font-bold">✓ Multiplier Gaji Permanen: +{(potentialCbsPoints * 25)}%</li>
                <li className="text-orange-400 font-bold">✓ Multiplier EXP Permanen: +{(potentialCbsPoints * 20)}%</li>
                <li className="text-blue-300 font-bold">✓ Base Stat Baru: +2 STA, +2 SPD, +2 TEL</li>
                <li className="text-yellow-400 font-bold">✓ Uang Saku Cuti: Rp 50.000</li>
                <li className="text-slate-400 italic">⚠️ Level karir & aset toko akan direset ke Lv. 1</li>
              </ul>
            </div>

            <div className="flex gap-2">
              <button
                onClick={closeCbsConfirmModal}
                className="flex-1 py-2.5 bg-[#0A0F1D] hover:bg-[#1E2D50] text-slate-300 font-bold text-xs rounded-xl border border-[#23335A] transition active:scale-95"
              >
                Batal
              </button>
              <button
                onClick={executeCbs}
                className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs rounded-xl shadow-lg hover:brightness-110 transition active:scale-95"
              >
                Konfirmasi CBS! 🏖️
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}