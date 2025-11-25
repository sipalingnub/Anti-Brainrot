import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; 
import LoadingRPG from '../components/loadingrpg';
import bgMain from '../assets/648115.jpg'; 

// --- KAMUS DETAIL MEDAL ---
// Ini untuk mapping ID medal ke deskripsi & cara dapatnya
const MEDAL_DETAILS = {
    'first_step': {
        description: "Langkah awal dari seribu langkah.",
        unlock: "Catat aktivitas pertamamu (Productive/Brainrot)."
    },
    'novice': {
        description: "Mulai konsisten membangun kebiasaan.",
        unlock: "Capai Level 2 (Kumpulkan 500 XP)."
    },
    'master': {
        description: "Produktivitas sudah mendarah daging.",
        unlock: "Kumpulkan total 1000 XP."
    }
    // Kalau nanti nambah medal di backend, tambahkan penjelasannya di sini
};

const Dashboard = () => {
  // State Data
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
      totalMinutes: 0,
      totalHours: 0,
      todayMinutes: 0,
      brainrotMinutes: 0,
      brainrotPercentage: 0,
      dailyAverage: 0,
      isOverLimit: false
  });
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('week'); 
  
  // State Modal Medal
  const [selectedMedal, setSelectedMedal] = useState(null);

  // Fungsi Fetch Data
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return; 

      const config = { 
        headers: { 'Authorization': `Bearer ${token}` } 
      };

      const [statsRes, meRes, leaderboardRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/activities/stats?period=${period}`, config),
          axios.get('http://localhost:5000/api/auth/me', config),
          axios.get('http://localhost:5000/api/auth/leaderboard')
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (meRes.data.success) setUser(meRes.data.data.user);
      if (leaderboardRes.data.success) setLeaderboard(leaderboardRes.data.data);

    } catch (error) {
      console.error("Gagal memuat dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [period]);

  // Hitung XP
  const xpNeeded = (user?.level || 1) * 500; 
  const currentXP = user?.xp || 0;
  const xpProgress = Math.min((currentXP / xpNeeded) * 100, 100);

  const calculatePeriodXP = () => {
    if (!stats) return 0;
    const neutralMinutes = stats.totalMinutes - stats.brainrotMinutes - stats.productiveMinutes;
    return (stats.productiveMinutes * 10) + (Math.max(0, neutralMinutes) * 2);
  };

  if (loading) return <LoadingRPG />;

  return (
    <div 
      className="min-h-screen py-8 bg-cover bg-center bg-fixed relative font-pixel"
      style={{ backgroundImage: `url(${bgMain})` }}
    >
      <div className="absolute inset-0 bg-rpg-bg/90 z-0"></div>

      {/* --- MODAL MEDAL (POPUP) --- */}
      {selectedMedal && (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-4"
            onClick={() => setSelectedMedal(null)} // Klik luar untuk tutup
        >
            <div 
                className="bg-rpg-card border-4 border-rpg-gold p-6 max-w-sm w-full relative shadow-[0_0_30px_rgba(255,215,0,0.2)]"
                onClick={(e) => e.stopPropagation()} // Supaya klik dalam tidak menutup
            >
                <div className="text-center mb-4">
                    <div className="text-6xl mb-2 animate-bounce">{selectedMedal.icon}</div>
                    <h2 className="text-2xl font-bold text-rpg-gold uppercase tracking-widest border-b-2 border-rpg-border pb-2 inline-block">
                        {selectedMedal.name}
                    </h2>
                </div>
                
                <div className="space-y-4 text-center">
                    <div>
                        <h4 className="text-xs text-gray-500 font-bold uppercase mb-1">Description</h4>
                        <p className="text-gray-200 text-sm">
                            {MEDAL_DETAILS[selectedMedal.id]?.description || "Sebuah pencapaian legendaris."}
                        </p>
                    </div>
                    
                    <div className="bg-black/40 p-3 border border-dashed border-gray-600 rounded">
                        <h4 className="text-xs text-green-400 font-bold uppercase mb-1">How to Unlock</h4>
                        <p className="text-white text-xs font-mono">
                            {MEDAL_DETAILS[selectedMedal.id]?.unlock || "Teruslah berjuang untuk mengungkap rahasia ini."}
                        </p>
                    </div>
                </div>

                <button 
                    onClick={() => setSelectedMedal(null)}
                    className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 border-b-4 border-red-800 active:border-b-0 active:translate-y-1 transition-all"
                >
                    CLOSE
                </button>
            </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 animate-fade-up">
        
        {/* HERO SECTION */}
        <div className="bg-rpg-card border-4 border-rpg-border p-6 mb-8 shadow-pixel flex flex-col md:flex-row items-center gap-6">
            <div className="text-center md:text-left flex-1">
                <h1 className="text-4xl font-bold text-rpg-gold drop-shadow-md tracking-wider mb-1 capitalize">
                    Lv.{user?.level || 1} {user?.name || "Player"}
                </h1>
                <p className="text-rpg-text text-sm opacity-80">Class: Productivity Mage</p>
            </div>
            <div className="w-full md:w-1/2">
                <div className="flex justify-between text-xs text-rpg-gold mb-1 font-bold">
                    <span>XP: {currentXP}</span>
                    <span>Next Lv: {xpNeeded}</span>
                </div>
                <div className="w-full h-6 bg-black border-2 border-rpg-border relative">
                    <div 
                        className="h-full bg-blue-500 transition-all duration-1000 ease-out"
                        style={{ width: `${xpProgress}%` }}
                    ></div>
                </div>
            </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            
            {/* Stats Column */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Daily Mana */}
                <div className="bg-rpg-card border-4 border-rpg-border p-4 shadow-pixel relative">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-rpg-gold uppercase tracking-widest">DAILY MANA</h3>
                        <span className="text-2xl">🔮</span>
                    </div>
                    <p className="text-3xl font-bold text-rpg-text mb-2">
                        {Math.floor((stats.todayMinutes || 0) / 60)}h {(stats.todayMinutes || 0) % 60}m
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                        <span>Limit: {Math.floor((user?.dailyLimit || 120) / 60)}h {(user?.dailyLimit || 120) % 60}m</span>
                        {stats.isOverLimit && <span className="text-red-500 font-bold animate-pulse">⚠️ CRITICAL!</span>}
                    </div>
                    <div className="mt-2 bg-black border-2 border-rpg-border h-4 p-0.5">
                        <div
                            className={`h-full transition-all duration-500 ${stats.isOverLimit ? 'bg-red-600' : 'bg-blue-400'}`}
                            style={{ width: `${Math.min(((stats.todayMinutes || 0) / (user?.dailyLimit || 120)) * 100, 100)}%` }}
                        />
                    </div>
                </div>

                {/* Total Playtime */}
                <div className="bg-rpg-card border-4 border-rpg-border p-4 shadow-pixel relative">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-rpg-gold uppercase tracking-widest">TOTAL PLAYTIME</h3>
                        <span className="text-2xl">⏱️</span>
                    </div>
                    <p className="text-3xl font-bold text-rpg-text mb-2">{stats.totalHours}h</p>
                    <p className="text-xs text-gray-400">Avg: {stats.dailyAverage} min/day</p>
                </div>

                {/* Cursed Time */}
                <div className="bg-rpg-card border-4 border-rpg-border p-4 shadow-pixel relative">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-rpg-gold uppercase tracking-widest">CURSED TIME</h3>
                        <span className="text-2xl">💀</span>
                    </div>
                    <p className="text-3xl font-bold text-red-500 mb-2">
                        {Math.floor((stats.brainrotMinutes || 0) / 60)}h {(stats.brainrotMinutes || 0) % 60}m
                    </p>
                    <div className="mt-2 bg-black border-2 border-rpg-border h-4 p-0.5">
                        <div className="bg-red-600 h-full transition-all duration-500" style={{ width: `${stats.brainrotPercentage}%` }} />
                    </div>
                    <p className="text-xs text-right mt-1 text-gray-500">{stats.brainrotPercentage}% Brainrot</p>
                </div>

                {/* XP GAINED */}
                <div className="bg-rpg-card border-4 border-rpg-border p-4 shadow-pixel relative">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-rpg-gold uppercase tracking-widest">XP GAINED</h3>
                        <span className="text-2xl">✨</span>
                    </div>
                    <p className="text-3xl font-bold text-green-400 mb-2">
                      +{calculatePeriodXP()} XP
                    </p>
                    <p className="text-xs text-gray-400">From checked activities</p>
                </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                
                {/* MEDALS SECTION (UPDATED) */}
                <div className="bg-rpg-card border-4 border-rpg-border p-4 shadow-pixel">
                    <h3 className="text-lg font-bold text-rpg-gold mb-4 border-b-2 border-rpg-border pb-2">MEDALS</h3>
                    <div className="flex flex-wrap gap-3">
                        {user?.badges && user.badges.length > 0 ? (
                            user.badges.map((badge, index) => (
                                <button 
                                    key={index} 
                                    onClick={() => setSelectedMedal(badge)} // Klik untuk buka modal
                                    className="flex flex-col items-center bg-black/40 border-2 border-gray-700 p-2 w-20 h-24 justify-center text-center hover:border-rpg-gold hover:bg-white/5 transition-all cursor-pointer group" 
                                    title="Click for details"
                                >
                                    <span className="text-3xl mb-1 group-hover:scale-110 transition-transform">{badge.icon}</span>
                                    <span className="text-[9px] leading-tight text-gray-300 font-bold group-hover:text-rpg-gold">{badge.name}</span>
                                </button>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm italic w-full text-center py-4">No medals yet. Grinding required.</p>
                        )}
                    </div>
                    <p className="text-[10px] text-gray-500 text-center mt-2 italic">(Click medal for info)</p>
                </div>

                {/* Guild Rankings */}
                <div className="bg-rpg-card border-4 border-rpg-border p-4 shadow-pixel">
                    <h3 className="text-lg font-bold text-rpg-gold mb-4 border-b-2 border-rpg-border pb-2">GUILD RANKINGS</h3>
                    <ul className="space-y-2">
                        {leaderboard.map((player, idx) => (
                            <li key={player._id} className={`flex justify-between items-center text-sm p-2 border-b border-gray-800 last:border-0 ${player._id === user?._id ? 'bg-white/10 border-l-2 border-l-rpg-gold' : ''}`}>
                                <div className="flex items-center gap-2">
                                    <span className={`font-bold w-6 text-center ${idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-orange-400' : 'text-gray-600'}`}>
                                        #{idx + 1}
                                    </span>
                                    <span className="text-gray-200 truncate max-w-[100px]">{player.name}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-rpg-gold font-bold block text-xs">Lv.{player.level}</span>
                                    <span className="text-[10px] text-gray-500">{player.xp} XP</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>

        <div className="mt-8 text-center pb-8">
          <Link to="/add-activity" className="inline-block bg-rpg-gold text-black font-bold py-3 px-8 border-b-4 border-yellow-700 hover:border-yellow-800 hover:translate-y-1 active:border-b-0 active:translate-y-2 transition-all">
            📜 NEW QUEST (LOG ACTIVITY)
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;