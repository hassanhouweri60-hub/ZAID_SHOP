import React from 'react';
import './index.css';

function Contact({ setPageCourante, langue }) {
  return (
    /* 1. LE GRAND PARENT (min-h-screen et flex pour centrer verticalement) */
    <div className="relative min-h-screen w-full bg-gray-50 dark:bg-gray-900 flex justify-center py-10 overflow-hidden transition-colors duration-300 antialiased font-sans">

      {/* 2. LES EMOJIS FLOTTANTS */}
      <div className="absolute inset-0 pointer-events-none">
        <span className="floating-emoji emoji-1">🛒</span>
        <span className="floating-emoji emoji-2">💻</span>
        <span className="floating-emoji emoji-3">🎧</span>
        <span className="floating-emoji emoji-4">📦</span>
        <span className="floating-emoji emoji-5">🚀</span>
        <span className="floating-emoji emoji-6">📱</span>
        <span className="floating-emoji emoji-7">✨</span>
        <span className="floating-emoji emoji-8">⭐</span>
      </div>

      {/* 3. LE CONTENEUR DE LA PAGE (my-auto pour le centrage parfait sur PC) */}
      <div className="relative z-10 w-full max-w-2xl px-5 sm:px-8 my-auto">
        
        {/* Bouton Retour */}
        <button 
          onClick={() => setPageCourante('accueil')} 
          className="flex items-center gap-3 mb-8 bg-transparent border-none text-gray-500 dark:text-gray-400 font-medium cursor-pointer text-lg hover:text-emerald-500 transition-colors"
        >
          <i className="fa-solid fa-arrow-left"></i> {langue === 'fr' ? "Retour à la boutique" : "Back to shop"}
        </button>

        {/* La Carte de Contact Premium */}
        <div 
          className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 w-full transition-all flex flex-col items-center" 
          style={{ padding: '50px 30px' }}
        >
          
          {/* Icône En-tête */}
          <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex justify-center items-center mb-6 shadow-inner">
            <i className="fa-solid fa-headset text-5xl text-emerald-500"></i>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight">
            {langue === 'fr' ? "Contactez-nous" : "Contact Us"}
          </h2>
          
          <p className="text-gray-500 dark:text-gray-400 mb-10 text-lg font-medium text-center max-w-md">
            {langue === 'fr' ? "Nous sommes à votre disposition pour toute question ou demande de support." : "We are at your disposal for any questions or support requests."}
          </p>

          {/* Les Infos de Contact (Design moderne avec des "pilules") */}
          <div className="flex flex-col gap-6 w-full max-w-md bg-gray-50 dark:bg-gray-900/50 p-8 rounded-3xl border border-gray-100 dark:border-gray-700">
            
            <div className="flex items-center gap-4 text-gray-800 dark:text-gray-200 text-lg group">
              <div className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-800 shadow-sm flex justify-center items-center shrink-0 border border-gray-100 dark:border-gray-700 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-user text-emerald-500 text-2xl"></i>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{langue === 'fr' ? "Direction" : "Management"}</span>
                <strong className="font-bold text-gray-900 dark:text-white">Hassan el Houwari</strong>
              </div>
            </div>

            <div className="flex items-center gap-4 text-gray-800 dark:text-gray-200 text-lg group">
              <div className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-800 shadow-sm flex justify-center items-center shrink-0 border border-gray-100 dark:border-gray-700 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-envelope text-blue-500 text-2xl"></i>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Email</span>
                <strong className="font-bold text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-none">zaid.shop.contact@gmail.com</strong>
              </div>
            </div>

            <div className="flex items-center gap-4 text-gray-800 dark:text-gray-200 text-lg group">
              <div className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-800 shadow-sm flex justify-center items-center shrink-0 border border-gray-100 dark:border-gray-700 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-phone text-amber-500 text-2xl"></i>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{langue === 'fr' ? "Téléphone" : "Phone"}</span>
                <strong className="font-bold text-gray-900 dark:text-white">06 65 79 84 07</strong>
              </div>
            </div>

            <div className="flex items-center gap-4 text-gray-800 dark:text-gray-200 text-lg group">
              <div className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-800 shadow-sm flex justify-center items-center shrink-0 border border-gray-100 dark:border-gray-700 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-location-dot text-red-500 text-2xl"></i>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{langue === 'fr' ? "Siège" : "Headquarters"}</span>
                <strong className="font-bold text-gray-900 dark:text-white">PARIS</strong>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
