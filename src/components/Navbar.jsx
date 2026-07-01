import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ 
  setIsMenuOpen, langue, setLangue, utilisateur, getNomClient, 
  seDeconnecter, theme, toggleTheme, setIsCartOpen, nombreArticles, traductions 
}) {
  const navigate = useNavigate();

  return (
    <nav className="h-20 bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 px-6 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-4">
        <div className="cursor-pointer text-2xl text-gray-800 dark:text-white hover:text-emerald-500 transition-colors" onClick={() => setIsMenuOpen(true)}>
          <i className="fa-solid fa-bars"></i>
        </div>
        <div className="cursor-pointer text-2xl font-black tracking-tight text-[#1e3a8a] dark:text-white flex items-center gap-2" onClick={() => navigate('/')}>
          <i className="fa-solid fa-store text-[#10b981]"></i> ZAID <span className="text-[#10b981]">SHOP</span>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="hidden sm:flex gap-2">
          <button onClick={() => setLangue('fr')} className={`px-3 py-1.5 rounded-lg font-bold text-sm border-2 transition-colors ${langue === 'fr' ? 'bg-[#10b981] border-[#10b981] text-white' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-[#10b981]'}`}>FR</button>
          <button onClick={() => setLangue('en')} className={`px-3 py-1.5 rounded-lg font-bold text-sm border-2 transition-colors ${langue === 'en' ? 'bg-[#10b981] border-[#10b981] text-white' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-[#10b981]'}`}>EN</button>
        </div>

        {utilisateur ? (
          <div className="flex items-center gap-4">
            <span className="hidden md:block font-bold text-[#1e3a8a] dark:text-[#10b981]">
              👋 {traductions[langue].bonjour}, {getNomClient()}
            </span>
            <button onClick={seDeconnecter} className="text-red-500 hover:text-red-600 text-xl transition-colors" title={traductions[langue].seDeconnecter}>
              <i className="fa-solid fa-right-from-bracket"></i>
            </button>
          </div>
        ) : (
          <button onClick={() => navigate('/login')} className="flex items-center gap-2 font-bold text-[#f59e0b] hover:text-amber-600 transition-colors">
            <i className="fa-solid fa-user text-xl"></i> <span className="hidden sm:inline">{traductions[langue].seConnecter}</span>
          </button>
        )}

        <div className="cursor-pointer text-xl text-gray-700 dark:text-yellow-400 hover:scale-110 transition-transform" onClick={toggleTheme}>
          <i className={theme === "light" ? "fa-solid fa-moon" : "fa-solid fa-sun"}></i>
        </div>
        
        <div className="relative cursor-pointer text-2xl text-[#1e3a8a] dark:text-white hover:scale-110 transition-transform" onClick={() => setIsCartOpen(true)}>
          <i className="fa-solid fa-cart-shopping"></i>
          <span className="absolute -top-2 -right-2 bg-[#f59e0b] text-white text-xs font-black h-5 w-5 flex items-center justify-center rounded-full border-2 border-white dark:border-gray-900">{nombreArticles}</span>
        </div>
      </div>
    </nav>
  );
}