import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Payement({ theme, traductions, langue }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-300 font-sans">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-4xl shadow-2xl p-10 text-center border border-gray-100 dark:border-gray-700 relative overflow-hidden">
        
        {/* --- ديكور الخلفية (تأثير ضوئي) --- */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 dark:opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-emerald-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 dark:opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="relative z-10">
          {/* أيقونة وضع التطوير */}
          <div className="w-28 h-28 bg-amber-50 dark:bg-amber-900/30 text-amber-500 rounded-full flex items-center justify-center text-6xl mx-auto mb-8 shadow-inner border-4 border-amber-100 dark:border-amber-800/50">
            🚧
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
            {langue === 'fr' ? "Site en cours de développement" : "Site Under Development"}
          </h1>
          
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 font-medium leading-relaxed px-4">
            {langue === 'fr' 
              ? "Merci d'avoir testé ZAID SHOP ! Aucune transaction bancaire réelle n'a été effectuée. Votre commande a été enregistrée avec succès en mode 'Démo'." 
              : "Thank you for testing ZAID SHOP! No real bank transaction was made. Your order has been successfully recorded in 'Demo' mode."}
          </p>

          {/* أزرار التوجيه */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/commandes')}
              className="h-14 px-8 bg-[#1e3a8a] hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold rounded-2xl transition-transform active:scale-95 shadow-lg flex items-center justify-center gap-3 text-lg w-full sm:w-auto"
            >
              <i className="fa-solid fa-box-open"></i> 
              {langue === 'fr' ? "Voir mes commandes" : "View my orders"}
            </button>
            
            <button 
              onClick={() => navigate('/')}
              className="h-14 px-8 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-transform active:scale-95 shadow-lg flex items-center justify-center gap-3 text-lg w-full sm:w-auto"
            >
              <i className="fa-solid fa-store"></i> 
              {langue === 'fr' ? "Retour à la boutique" : "Back to shop"}
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}