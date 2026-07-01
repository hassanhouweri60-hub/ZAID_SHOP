import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import './index.css';

function Commandes({ setPageCourante, utilisateur, langue }) {
  const [listeCommandes, setListeCommandes] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const fetchCommandes = async () => {
      if (!utilisateur) return;

      // On va chercher uniquement les commandes de l'utilisateur connecté
      const { data, error } = await supabase
        .from('commandes')
        .select('*')
        .eq('client_email', utilisateur.email)
        .order('created_at', { ascending: false }); // Les plus récentes en premier
      
      if (!error && data) {
        setListeCommandes(data);
      }
      setChargement(false);
    };

    fetchCommandes();
  }, [utilisateur]);

  // Fonction pour formater la date proprement
  const formaterDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(langue === 'fr' ? 'fr-FR' : 'en-US', options);
  };

  return (
    /* 1. LE GRAND PARENT (min-h-screen et flex pour préparer le centrage) */
    <div className="relative min-h-screen w-full bg-gray-50 dark:bg-gray-900 flex justify-center py-10 overflow-hidden transition-colors duration-300 antialiased font-sans">
        
      {/* --- LE BLOC DES EMOJIS --- */}
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

      {/* 2. LE CONTENEUR DE LA PAGE (my-auto pour centrer sur PC) */}
      <div className="relative z-10 w-full max-w-3xl px-5 sm:px-8 my-auto">
        
        {/* Bouton Retour */}
        <button 
          onClick={() => setPageCourante('accueil')} 
          className="flex items-center gap-3 mb-8 bg-transparent border-none text-gray-500 dark:text-gray-400 font-medium cursor-pointer text-lg hover:text-emerald-500 transition-colors"
        >
          <i className="fa-solid fa-arrow-left"></i> {langue === 'fr' ? "Retour" : "Back"}
        </button>

        {/* Titre Principal */}
        <h2 className="text-center text-emerald-500 mb-10 text-4xl sm:text-5xl font-extrabold tracking-tight drop-shadow-sm">
          📦 {langue === 'fr' ? "Mes Commandes" : "My Orders"}
        </h2>

        {chargement ? (
          <p className="text-center text-gray-500 dark:text-gray-400 font-medium text-xl animate-pulse">
            {langue === 'fr' ? "Chargement..." : "Loading..."}
          </p>
        ) : listeCommandes.length === 0 ? (
          
          /* --- DESIGN SI AUCUNE COMMANDE --- */
          <div 
            className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 w-full transition-all flex flex-col items-center text-center" 
            style={{ padding: '50px 30px' }}
          >
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex justify-center items-center mb-6">
              <i className="fa-solid fa-box-open text-5xl text-gray-400 dark:text-gray-500"></i>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 font-medium mb-8">
              {langue === 'fr' ? "Vous n'avez pas encore passé de commande." : "You haven't placed any orders yet."}
            </p>
            <button 
              onClick={() => setPageCourante('accueil')} 
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-14 px-10 rounded-2xl border-none cursor-pointer transition-all shadow-lg shadow-emerald-500/30 active:scale-95 text-lg flex items-center justify-center gap-3"
            >
              {langue === 'fr' ? "Aller à la boutique" : "Go to shop"} <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>

        ) : (
          
          /* --- LISTE DES COMMANDES --- */
          <div className="flex flex-col gap-6 w-full">
            {listeCommandes.map((commande) => (
              <div 
                key={commande.id} 
                className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-sm hover:shadow-lg border border-gray-100 dark:border-gray-700 w-full transition-shadow duration-300"
                style={{ padding: '30px' }} // Padding forcé !
              >
                
                {/* En-tête de la commande */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b-2 border-gray-100 dark:border-gray-700 pb-5 mb-5 gap-4">
                  <div>
                    <strong className="text-emerald-600 dark:text-emerald-400 text-xl font-bold tracking-tight">
                      {langue === 'fr' ? "Commande" : "Order"} #{commande.id}
                    </strong>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium flex items-center gap-2">
                      <i className="fa-regular fa-clock"></i> {formaterDate(commande.created_at)}
                    </p>
                  </div>
                  <div className="text-left sm:text-right bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-xl border border-amber-100 dark:border-amber-800/30 w-fit">
                    <strong className="text-2xl font-black text-amber-500">{commande.prix_total} €</strong>
                  </div>
                </div>

                {/* Détails des articles */}
                <ul className="flex flex-col gap-3 list-none p-0 m-0">
                  {commande.contenu_panier.map((article, index) => (
                    <li key={index} className="flex justify-between items-center text-gray-700 dark:text-gray-200 text-lg group bg-gray-50 dark:bg-gray-700/30 p-3 rounded-xl transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
                      <span className="flex items-center gap-3">
                        <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400 font-bold px-2 py-1 rounded-lg text-sm min-w-[32px] text-center">
                          {article.quantite}x
                        </span> 
                        <span className="font-medium">{article.nom}</span>
                      </span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {(article.prix * article.quantite).toFixed(2)} €
                      </span>
                    </li>
                  ))}
                </ul>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Commandes;