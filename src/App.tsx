import { useEffect, useState } from 'react';
import { useGameStore, INITIAL_TASKS } from './store/useGameStore';

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
    activeProjectId,
    activeTab,
    totalTasksCompleted,
    totalEarnings,
    hideLocked,
    hideLowLevel,
    categoryFilter,
    currentEvent,
    activeBuff,
    timeUntilNextEvent,
    eventNotification,
    setActiveTab,
    setActiveTask,
    startBigProject,
    cancelBigProject,
    buyShopItem,
    toggleHideLocked,
    toggleHideLowLevel,
    setCategoryFilter,
    resolveEventOption,
    dismissEventNotification,
    gameTick,
  } = useGameStore();

  const [activeStatTooltip, setActiveStatTooltip] = useState<'sta' | 'spd' | 'tel' | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      gameTick(0.1);
    }, 100);

    return () => clearInterval(interval);
  }, [gameTick]);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
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

  const activeBonusMultiplier = shopItems
    .filter((i) => i.owned)
    .reduce((sum, i) => sum + i.expMultiplierBonus, 0);

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

  return (
    <div className="min-h-screen bg-[#0A0F1D] text-slate-100 p-4 md:p-8 font-sans select-none antialiased relative">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* NOTIFIKASI EVENT */}
        {eventNotification && (
          <div className="bg-[#1E2D50] border border-orange-500 text-orange-300 p-3.5 rounded-xl shadow-xl flex justify-between items-center text-xs">
            <span>📢 {eventNotification}</span>
            <button
              onClick={dismissEventNotification}
              className="bg-orange-500 text-slate-950 px-3 py-1 rounded-lg font-black text-[10px] hover:bg-orange-400 transition"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Header Logo POS iND Style */}
        <div className="bg-[#141E36] border border-[#23335A] rounded-2xl p-6 text-center shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-600 via-orange-500 to-blue-600"></div>

          <div className="inline-flex flex-col items-center justify-center">
            <div className="flex items-baseline font-black text-3xl md:text-4xl tracking-tighter select-none">
              <span className="text-white">POS</span>
              <span className="text-orange-500 relative ml-1">
                <span className="inline-block w-2 h-2 bg-orange-500 rounded-tl-full rounded-tr-full absolute -top-1 left-0"></span>
                i
              </span>
              <span className="text-white">ND</span>
            </div>
            <span className="text-[9px] md:text-[10px] text-slate-300 font-bold uppercase tracking-[0.25em] -mt-1">
              Logistik Indonesia
            </span>
          </div>

          <h1 className="text-lg md:text-xl font-extrabold text-orange-400 mt-2 tracking-tight">
            Artuphay Gabut di Pos Indonesia
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Simulasi Karir Pegawai PosIND — Kerjakan Tugas, Raih Gaji, dan Beli Aset Logistik!
          </p>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'tasks'
                  ? 'bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20 font-black'
                  : 'bg-[#0A0F1D] text-slate-300 hover:bg-[#1E2D50] border border-[#23335A]'
              }`}
            >
              📋 Tugas & Pelatihan
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'projects'
                  ? 'bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20 font-black'
                  : 'bg-[#0A0F1D] text-slate-300 hover:bg-[#1E2D50] border border-[#23335A]'
              }`}
            >
              💼 Proyek Besar / Tender
            </button>
            <button
              onClick={() => setActiveTab('shop')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'shop'
                  ? 'bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20 font-black'
                  : 'bg-[#0A0F1D] text-slate-300 hover:bg-[#1E2D50] border border-[#23335A]'
              }`}
            >
              🛒 Toko Aset
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'stats'
                  ? 'bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20 font-black'
                  : 'bg-[#0A0F1D] text-slate-300 hover:bg-[#1E2D50] border border-[#23335A]'
              }`}
            >
              📊 Statistik Karir
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Panel Profil Pegawai Sidebar */}
          <div className="bg-[#141E36] border border-[#23335A] rounded-2xl p-5 shadow-xl h-fit space-y-4">
            <div className="border-b border-[#23335A] pb-3">
              <h2 className="text-xs font-bold text-orange-400 uppercase tracking-wider">Jabatan Karir</h2>
              <p className="text-xs text-blue-300 font-extrabold mt-0.5">{getJobTitle(level)}</p>
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
              {activeBonusMultiplier > 0 && (
                <p className="text-[10px] text-emerald-400 mt-1 font-semibold text-right">
                  ⚡ +{(activeBonusMultiplier * 100).toFixed(0)}% Bonus EXP
                </p>
              )}
            </div>

            {/* Total Gaji / Uang */}
            <div className="bg-[#0A0F1D] p-3 rounded-xl border border-orange-500/20">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Gaji / Uang Terkumpul</p>
              <p className="text-xl font-black text-emerald-400 mt-0.5">{formatRupiah(gold)}</p>
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
                    <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-48 bg-[#1E2D50] border border-orange-500 rounded-xl p-2.5 text-left text-xs shadow-2xl z-30 pointer-events-none">
                      <p className="font-extrabold text-red-400 text-[11px]">🔴 STA (Stamina)</p>
                      <p className="text-[10px] text-slate-300 leading-tight mt-1">
                        Ketahanan fisik pegawai. Memberikan 1.5 Work Points/detik pada Proyek Besar & lolos inspeksi.
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
                    <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-48 bg-[#1E2D50] border border-orange-500 rounded-xl p-2.5 text-left text-xs shadow-2xl z-30 pointer-events-none">
                      <p className="font-extrabold text-orange-400 text-[11px]">🟠 SPD (Kecepatan)</p>
                      <p className="text-[10px] text-slate-300 leading-tight mt-1">
                        Kelincahan sortir paket. Memberikan 2.0 Work Points/detik pada Proyek Besar & bonus inspeksi.
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
                    <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-48 bg-[#1E2D50] border border-orange-500 rounded-xl p-2.5 text-left text-xs shadow-2xl z-30 pointer-events-none">
                      <p className="font-extrabold text-blue-400 text-[11px]">🔵 TEL (Ketelitian)</p>
                      <p className="text-[10px] text-slate-300 leading-tight mt-1">
                        Akurasi sistem & pabean. Memberikan 2.5 Work Points/detik pada Proyek Besar & rakit mesin kopi.
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
              <div className="bg-[#141E36] border border-[#23335A] rounded-2xl p-5 shadow-xl space-y-4">
                
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
                <div className="space-y-3 max-h-[460px] overflow-y-auto custom-scroll pr-2">
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
                            <span className="text-[10px] font-bold text-slate-600 border border-slate-800 px-2.5 py-1 rounded-lg">
                              Butuh Lv. {task.reqLevel}
                            </span>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={task.id}
                          className={`p-3.5 rounded-xl border transition-all ${
                            isActive
                              ? 'bg-[#1E2D50] border-orange-500 shadow-md'
                              : isUnlocked
                              ? 'bg-[#0A0F1D]/60 border-[#23335A] hover:border-slate-500'
                              : 'bg-[#0A0F1D]/30 border-[#1C2B4E] opacity-60'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1.5">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h3 className="font-bold text-white text-xs">
                                  {isUnlocked ? task.name : `🔒 ${task.name}`}
                                </h3>
                                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                                  task.category === 'Pekerjaan Pos' 
                                    ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' 
                                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                }`}>
                                  {task.category}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 mt-1">
                                Durasi: {task.duration}s | Reward: +{formatRupiah(task.rewardGold)}, +{task.rewardExp} EXP
                                {task.rewardStat && `, +${task.rewardStat.amount} ${task.rewardStat.type.toUpperCase()}`}
                              </p>
                            </div>

                            {isUnlocked ? (
                              <button
                                onClick={() => setActiveTask(task.id)}
                                disabled={isActive}
                                className={`px-3.5 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                                  isActive
                                    ? 'bg-orange-500 text-slate-950 font-black cursor-default'
                                    : 'bg-[#1E2D50] hover:bg-orange-600 hover:text-white text-slate-200 border border-[#304573]'
                                }`}
                              >
                                {isActive ? 'Bekerja...' : 'Kerjakan'}
                              </button>
                            ) : (
                              <span className="text-[10px] text-amber-500 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-lg">
                                Terkunci (Lv. {task.reqLevel})
                              </span>
                            )}
                          </div>

                          {isActive && (
                            <div className="w-full bg-[#0A0F1D] rounded-full h-1.5 mt-2 overflow-hidden border border-[#23335A]">
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
              <div className="bg-[#141E36] border border-[#23335A] rounded-2xl p-5 shadow-xl space-y-4">
                <div className="border-b border-[#23335A] pb-3">
                  <h2 className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                    Tender Proyek Besar & Logistik Nasional
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Daya Serang Proyek = (STA x 1.5) + (SPD x 2) + (TEL x 2.5) = <span className="text-emerald-400 font-bold">{currentWorkRate.toFixed(1)} WP/s</span>
                  </p>
                </div>

                <div className="space-y-4 max-h-[460px] overflow-y-auto custom-scroll pr-2">
                  {bigProjects.map((proj) => {
                    const isUnlocked = level >= proj.reqLevel;
                    const hasStats = stats.sta >= proj.reqStats.sta && stats.spd >= proj.reqStats.spd && stats.tel >= proj.reqStats.tel;
                    const isRunning = activeProjectId === proj.id;

                    return (
                      <div
                        key={proj.id}
                        className={`p-4 rounded-xl border transition-all ${
                          isRunning
                            ? 'bg-[#1E2D50] border-orange-500 shadow-xl'
                            : proj.completed
                            ? 'bg-emerald-950/20 border-emerald-800/50'
                            : isUnlocked && hasStats
                            ? 'bg-[#0A0F1D]/70 border-[#23335A] hover:border-slate-500'
                            : 'bg-[#0A0F1D]/30 border-[#1C2B4E] opacity-50'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h3 className="font-extrabold text-white text-sm">{proj.name}</h3>
                            <p className="text-[11px] text-slate-400 mt-0.5">{proj.description}</p>
                            
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${stats.sta >= proj.reqStats.sta ? 'bg-red-950/80 text-red-300 border border-red-800' : 'bg-slate-900 text-slate-500'}`}>
                                STA ≥ {proj.reqStats.sta}
                              </span>
                              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${stats.spd >= proj.reqStats.spd ? 'bg-amber-950/80 text-amber-300 border border-amber-800' : 'bg-slate-900 text-slate-500'}`}>
                                SPD ≥ {proj.reqStats.spd}
                              </span>
                              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${stats.tel >= proj.reqStats.tel ? 'bg-blue-950/80 text-blue-300 border border-blue-800' : 'bg-slate-900 text-slate-500'}`}>
                                TEL ≥ {proj.reqStats.tel}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-black text-emerald-400 block">{formatRupiah(proj.rewardGold)}</span>
                            <span className="text-[10px] text-orange-400 font-bold block mt-0.5">+{proj.rewardExp} EXP</span>
                          </div>
                        </div>

                        {isRunning && (
                          <div className="mt-3 space-y-1.5 bg-[#0A0F1D] p-3 rounded-lg border border-orange-500/50">
                            <div className="flex justify-between text-xs font-bold">
                              <span className="text-orange-300">
                                Work Points: {proj.currentWorkPoints.toFixed(0)} / {proj.totalWorkPoints}
                              </span>
                              <span className="text-red-400">⏱️ Sisa Waktu: {proj.timeRemaining.toFixed(0)}s</span>
                            </div>
                            <div className="w-full bg-[#141E36] rounded-full h-3 overflow-hidden border border-orange-500/30">
                              <div
                                className="bg-gradient-to-r from-orange-500 to-amber-400 h-full rounded-full transition-all duration-100"
                                style={{ width: `${Math.min(100, (proj.currentWorkPoints / proj.totalWorkPoints) * 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        <div className="mt-3 flex justify-between items-center border-t border-[#23335A] pt-2.5">
                          <span className="text-[10px] text-slate-400 font-semibold">Batas Waktu: {proj.timeLimit}s</span>

                          {proj.completed ? (
                            <span className="text-xs font-extrabold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-3 py-1 rounded-lg">
                              ✓ Proyek Selesai!
                            </span>
                          ) : isRunning ? (
                            <button
                              onClick={cancelBigProject}
                              className="px-3 py-1 text-xs font-bold bg-red-600/80 hover:bg-red-500 text-white rounded-lg transition"
                            >
                              Batalkan
                            </button>
                          ) : (
                            <button
                              onClick={() => startBigProject(proj.id)}
                              disabled={!isUnlocked || !hasStats || activeProjectId !== null}
                              className={`px-4 py-1.5 text-xs font-extrabold rounded-lg transition ${
                                isUnlocked && hasStats && activeProjectId === null
                                  ? 'bg-orange-500 hover:bg-orange-400 text-slate-950 shadow-md font-black'
                                  : 'bg-[#1E2D50] text-slate-500 cursor-not-allowed border border-[#23335A]'
                              }`}
                            >
                              {activeProjectId !== null ? 'Sedang Proyek Lain' : 'Mulai Tender Proyek'}
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
              <div className="bg-[#141E36] border border-[#23335A] rounded-2xl p-5 shadow-xl space-y-4">
                <h2 className="text-xs font-bold text-orange-400 border-b border-[#23335A] pb-2 uppercase tracking-wider">
                  Toko Seragam, Kendaraan & Fasilitas PosIND
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto custom-scroll pr-2">
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
                              className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all ${
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

            {/* TAB 4: STATISTIK KARIR */}
            {activeTab === 'stats' && (
              <div className="bg-[#141E36] border border-[#23335A] rounded-2xl p-5 shadow-xl space-y-4">
                <h2 className="text-xs font-bold text-orange-400 border-b border-[#23335A] pb-2 uppercase tracking-wider">
                  Pencapaian & Statistik Karir
                </h2>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#0A0F1D] p-3.5 rounded-xl border border-[#23335A]">
                    <p className="text-[10px] text-slate-400 font-semibold">Total Tugas Diselesaikan</p>
                    <p className="text-2xl font-black text-orange-400 mt-0.5">{totalTasksCompleted} Kali</p>
                  </div>

                  <div className="bg-[#0A0F1D] p-3.5 rounded-xl border border-[#23335A]">
                    <p className="text-[10px] text-slate-400 font-semibold">Total Pendapatan Karir</p>
                    <p className="text-xl font-black text-emerald-400 mt-0.5">{formatRupiah(totalEarnings)}</p>
                  </div>
                </div>

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

      {/* POPUP MODAL EVENT ACAK KANTOR POS */}
      {currentEvent && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141E36] border-2 border-orange-500 rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              <h3 className="font-extrabold text-orange-400 text-lg">{currentEvent.title}</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{currentEvent.description}</p>

            <div className="space-y-2 pt-2 border-t border-[#23335A]">
              {currentEvent.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => resolveEventOption(idx)}
                  className="w-full text-left p-3 rounded-xl bg-[#0A0F1D] hover:bg-[#1E2D50] border border-[#23335A] hover:border-orange-500/50 text-xs font-bold text-slate-200 transition flex justify-between items-center group"
                >
                  <span>{option.text}</span>
                  <span className="text-orange-400 group-hover:translate-x-1 transition-transform">➔</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}