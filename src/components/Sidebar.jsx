import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({
  setIsMenuOpen, langue, setLangue, utilisateur, 
  getNomClient, seDeconnecter, traductions, isAdmin // 👈 استقبلنا isAdmin هنا
}) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black/50 z-100 flex" onClick={() => setIsMenuOpen(false)}>
      <div className="w-80 h-full bg-white dark:bg-gray-900 p-6 shadow-2xl relative transition-colors duration-300 animate-slide-in-left" onClick={(e) => e.stopPropagation()}>
        <button className="absolute top-6 right-6 text-2xl text-gray-500 hover:text-red-500 transition-colors" onClick={() => setIsMenuOpen(false)}>
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="flex gap-2 mt-10 mb-8 sm:hidden">
          <button onClick={() => setLangue('fr')} className={`flex-1 py-2 rounded-lg font-bold border-2 ${langue === 'fr' ? 'bg-[#10b981] border-[#10b981] text-white' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'}`}>FR</button>
          <button onClick={() => setLangue('en')} className={`flex-1 py-2 rounded-lg font-bold border-2 ${langue === 'en' ? 'bg-[#10b981] border-[#10b981] text-white' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'}`}>EN</button>
        </div>

        <ul className="flex flex-col gap-6 text-xl font-bold mt-8">
          <li><a href="#accueil" className="hover:text-[#10b981] transition-colors" onClick={(e) => { e.preventDefault(); navigate('/'); setIsMenuOpen(false); }}>{traductions[langue].accueil}</a></li>
          <li><a href="#boutique" className="hover:text-[#10b981] transition-colors" onClick={() => setIsMenuOpen(false)}>{traductions[langue].boutique}</a></li>
          <li><a href="#" className="hover:text-[#10b981] transition-colors" onClick={(e) => { e.preventDefault(); navigate('/contact'); setIsMenuOpen(false); }}>{traductions[langue].contact}</a></li>
          <li><a href="#" className="hover:text-amber-500 transition-colors" onClick={(e) => { e.preventDefault(); navigate('/avis'); setIsMenuOpen(false); }}>⭐ {traductions[langue].avis}</a></li>
          
          {/* 👈 الشرط الجديد النظيف للتحقق من الإدمن */}
          {isAdmin && (
            <li className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <a href="#" className="text-[#10b981] flex items-center gap-3" onClick={(e) => { e.preventDefault(); navigate('/admin'); setIsMenuOpen(false); }}>
                <i className="fa-solid fa-lock"></i> {traductions[langue].admin}
              </a>
            </li>
          )}
        </ul>

        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider mb-4">{traductions[langue].infoPersonnel}</h3>
          {utilisateur ? (
            <div className="flex flex-col gap-3">
              <p className="font-bold text-lg flex items-center gap-2"><i className="fa-solid fa-user text-[#10b981]"></i> {getNomClient()}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 break-all"><i className="fa-solid fa-envelope"></i> {utilisateur.email}</p>
              <button onClick={() => { navigate('/commandes'); setIsMenuOpen(false); }} className="mt-4 w-full bg-[#1e3a8a] text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 shadow-md hover:bg-blue-800 transition-colors">
                <i className="fa-solid fa-box-open"></i> {traductions[langue].mesCommandes}
              </button>
              <button onClick={seDeconnecter} className="w-full bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 font-bold py-3 rounded-xl flex justify-center items-center gap-2 transition-colors mt-2">
                <i className="fa-solid fa-right-from-bracket"></i> {traductions[langue].seDeconnecter}
              </button>
            </div>
          ) : (
            <button onClick={() => { navigate('/login'); setIsMenuOpen(false); }} className="w-full bg-[#10b981] text-white font-bold py-3 rounded-xl shadow-md hover:bg-emerald-600 transition-colors">
              {traductions[langue].seConnecter}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}