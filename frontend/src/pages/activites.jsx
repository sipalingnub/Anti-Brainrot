import React, { useState, useEffect } from 'react';
import axios from 'axios';
import bgMain from '../assets/648115.jpg'; 

const Activities = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    // State untuk Modal Gambar Fullscreen
    const [selectedImage, setSelectedImage] = useState(null);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) { setError('Login dulu bang.'); return; }

            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            const response = await axios.get('http://localhost:5000/api/activities', config);
            setActivities(response.data.data.activities);
        } catch (err) {
            console.error(err);
            setError('Gagal konek ke server.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleDelete = async (id) => {
        if(!window.confirm("Yakin mau hapus log ini?")) return;
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            await axios.delete(`http://localhost:5000/api/activities/${id}`, config);
            fetchData(); 
        } catch (err) { alert("Gagal hapus."); }
    };

    const getImageUrl = (path) => {
        if (!path) return null;
        return `http://localhost:5000/${path.replace(/\\/g, '/')}`;
    };

    return (
        <div className="min-h-screen py-8 bg-cover bg-center bg-fixed relative font-pixel" style={{ backgroundImage: `url(${bgMain})` }}>
            <div className="absolute inset-0 bg-rpg-bg/90 z-0"></div>

            {/* --- MODAL FULLSCREEN IMAGE --- */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 cursor-pointer animate-fade-in"
                    onClick={() => setSelectedImage(null)} // Klik dimanapun untuk tutup
                >
                    <div className="relative max-w-4xl max-h-screen">
                        <img src={selectedImage} alt="Full Evidence" className="max-w-full max-h-[90vh] object-contain border-4 border-rpg-gold shadow-[0_0_50px_rgba(255,215,0,0.3)]" />
                        <p className="text-white text-center mt-4 text-xl animate-pulse">Click anywhere to close</p>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto px-4 relative z-10 animate-fade-up">
                <h1 className="text-4xl font-bold mb-8 text-rpg-gold text-center drop-shadow-md tracking-widest border-b-4 border-rpg-border pb-4 w-fit mx-auto">
                    QUEST LOG (HISTORY)
                </h1>

                {error && <div className="bg-red-900/80 border-2 border-red-500 text-white p-4 text-center mb-6">⚠️ {error}</div>}

                {loading ? (
                    <p className="text-center text-rpg-gold animate-pulse text-xl">Loading Grimoire...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activities.map((activity) => (
                            <div key={activity._id} className="bg-rpg-card border-4 border-rpg-border p-4 shadow-pixel flex flex-col h-full group transition-all hover:-translate-y-1 hover:border-gray-500">
                                
                                {/* Header */}
                                <div className="flex justify-between items-start mb-3">
                                    <h2 className="text-xl font-bold text-rpg-text capitalize truncate w-2/3">{activity.platform}</h2>
                                    <span className={`text-[10px] px-2 py-1 border-2 border-black font-bold uppercase ${
                                        activity.category === 'productive' ? 'bg-green-600 text-white' : 
                                        activity.category === 'brainrot' ? 'bg-red-600 text-white' : 'bg-gray-500 text-white'
                                    }`}>
                                        {activity.category}
                                    </span>
                                </div>

                                {/* Stats */}
                                <div className="flex items-center gap-2 mb-4 border-b-2 border-rpg-border pb-2 border-dashed">
                                    <span className="text-2xl">⏳</span>
                                    <span className="text-2xl font-bold text-rpg-gold">{activity.duration}m</span>
                                    <span className="text-xs text-gray-400 ml-auto font-mono">
                                        {activity.category === 'productive' ? `+${activity.duration * 10} XP` : 
                                         activity.category === 'neutral' ? `+${activity.duration * 2} XP` : '+0 XP'}
                                    </span>
                                </div>

                                {/* EVIDENCE SECTION - DIPERBAIKI */}
                                <div className="mb-4 bg-black/50 border-2 border-dashed border-gray-700 p-2 min-h-[100px] flex items-center justify-center relative overflow-hidden group-hover:border-rpg-gold transition-colors">
                                    {activity.screenshot ? (
                                        <div className="relative w-full h-32 cursor-zoom-in" onClick={() => setSelectedImage(getImageUrl(activity.screenshot))}>
                                            <p className="absolute top-0 left-0 bg-black/70 text-[10px] px-1 text-white z-10">EVIDENCE FOUND</p>
                                            <img 
                                                src={getImageUrl(activity.screenshot)} 
                                                alt="Proof" 
                                                className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity hover:scale-105 duration-300"
                                            />
                                            {/* Hover Hint */}
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/40 transition-opacity">
                                                <span className="text-white text-xs font-bold border border-white px-2 py-1 bg-black/50">🔍 ENLARGE</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center text-gray-600">
                                            <span className="text-2xl block mb-1">🚫</span>
                                            <span className="text-[10px]">NO EVIDENCE ATTACHED</span>
                                        </div>
                                    )}
                                </div>

                                {/* Deskripsi */}
                                <div className="bg-black/30 p-2 rounded mb-auto">
                                    <p className="text-gray-300 text-xs italic line-clamp-3">"{activity.description || "-"}"</p>
                                </div>

                                {/* Footer */}
                                <div className="flex justify-between items-end mt-4 pt-2 border-t border-gray-700">
                                    <span className="text-[10px] text-gray-500 font-bold">
                                        {new Date(activity.date).toLocaleDateString()}
                                    </span>
                                    <button onClick={() => handleDelete(activity._id)} className="text-red-500 hover:text-red-300 text-[10px] font-bold">
                                        [DELETE]
                                    </button>
                                </div>
                            </div>
                        ))}
                        
                        {activities.length === 0 && (
                            <div className="col-span-full text-center py-10 text-gray-500">Belum ada quest yang tercatat.</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Activities;