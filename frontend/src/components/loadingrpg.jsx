import React from 'react';

const LoadingRPG = () => {
  return (
    // Container memenuhi layar dengan background gelap
    <div className="fixed inset-0 bg-rpg-bg z-50 flex flex-col items-center justify-center font-pixel">
      
      {/* Ikon Pedang/Tengkorak (Emoji dulu sementara) */}
      <div className="text-6xl animate-bounce mb-4">⚔️</div>
      
      {/* Teks Loading */}
      <h2 className="text-2xl text-rpg-gold tracking-widest animate-pulse mb-4">
        SUMMONING DATA...
      </h2>
      
      {/* Progress Bar Kotak Retro */}
      <div className="w-64 h-6 border-4 border-rpg-border bg-rpg-card p-1">
        <div className="h-full bg-rpg-danger w-full animate-pulse origin-left"></div>
      </div>
    </div>
  );
};

export default LoadingRPG;