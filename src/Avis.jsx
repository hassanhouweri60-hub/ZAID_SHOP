import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import './index.css';

function Avis({ setPageCourante, utilisateur, langue }) {
  const [listeAvis, setListeAvis] = useState([]);
  const [note, setNote] = useState(5);
  const [commentaire, setCommentaire] = useState("");
  const [message, setMessage] = useState("");

  // Charger les avis depuis la base de données
  useEffect(() => {
    const fetchAvis = async () => {
      const { data, error } = await supabase
        .from('avis')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setListeAvis(data);
      }
    };
    fetchAvis();
  }, []);

  // Fonction pour envoyer un nouvel avis
  const soumettreAvis = async (e) => {
    e.preventDefault();
    if (!utilisateur) return;

    let nom = utilisateur.user_metadata?.full_name || utilisateur.user_metadata?.prenom || utilisateur.email.split('@')[0];

    const { error } = await supabase
      .from('avis')
      .insert([{ nom_client: nom, note: note, commentaire: commentaire }]);

    if (error) {
      setMessage(langue === 'fr' ? "❌ Erreur de connexion" : "❌ Connection error");
    } else {
      setMessage(langue === 'fr' ? "✅ Avis publié avec succès !" : "✅ Review published successfully!");
      setCommentaire("");
      setNote(5);
      
      const { data } = await supabase.from('avis').select('*').order('created_at', { ascending: false });
      if (data) setListeAvis(data);
      
      setTimeout(() => setMessage(""), 3000);
    }
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
          
      {/* 2. LE CONTENEUR DE LA PAGE (my-auto est la magie qui centre verticalement sur PC !) */}
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
          ⭐ {langue === 'fr' ? "Avis de nos clients" : "Customer Reviews"}
        </h2>

        {/* --- FORMULAIRE D'AVIS --- 
            Ajout de style={{ padding: '40px' }} pour forcer l'espace et empêcher le texte de coller aux bords 
        */}
        <div 
          className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 mb-12 w-full transition-all"
          style={{ padding: '40px' }}
        >
          <h3 className="mb-6 text-gray-900 dark:text-white text-2xl font-bold tracking-tight">
            {langue === 'fr' ? "Laissez votre avis" : "Leave a review"}
          </h3>
          
          {utilisateur ? (
            <form onSubmit={soumettreAvis} className="flex flex-col gap-6">
              <div>
                <p className="mb-3 font-semibold text-gray-600 dark:text-gray-300 text-lg">Note :</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i 
                      key={star} 
                      className={`${star <= note ? "fa-solid fa-star" : "fa-regular fa-star"} text-amber-400 text-3xl cursor-pointer hover:scale-125 transition-transform duration-200`}
                      onClick={() => setNote(star)}
                    ></i>
                  ))}
                </div>
              </div>

              {/* Zone de texte avec padding forcé */}
              <textarea 
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
                placeholder={langue === 'fr' ? "Écrivez votre expérience ici..." : "Write your experience here..."}
                className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white min-h-[140px] resize-y outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-lg font-medium placeholder-gray-400"
                style={{ padding: '20px' }}
                required
              />
              
              {/* Bouton avec hauteur (h-14) forcée */}
              <button 
                type="submit" 
                className="w-full h-14 flex justify-center items-center bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl border-none cursor-pointer transition-all shadow-lg shadow-emerald-500/30 active:scale-95 text-lg mt-2"
              >
                {langue === 'fr' ? "Publier l'avis" : "Publish review"}
              </button>
              
              {message && (
                <p className={`text-center font-bold mt-4 text-lg ${message.includes('✅') ? 'text-emerald-500' : 'text-red-500'}`}>
                  {message}
                </p>
              )}
            </form>
          ) : (
            <div className="text-center bg-gray-50 dark:bg-gray-700 rounded-[2rem] border border-gray-100 dark:border-gray-600" style={{ padding: '40px' }}>
              <p className="mb-6 text-gray-600 dark:text-gray-300 text-lg font-medium">
                {langue === 'fr' ? "Veuillez vous connecter pour laisser un avis." : "Please log in to leave a review."}
              </p>
              <button 
                onClick={() => setPageCourante('login')} 
                className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white font-bold h-14 px-10 rounded-2xl border-none cursor-pointer transition-all shadow-md active:scale-95 text-lg flex justify-center items-center mx-auto"
              >
                {langue === 'fr' ? "Se connecter" : "Login"}
              </button>
            </div>
          )}
        </div>

        {/* --- LISTE DES AVIS --- */}
        <div className="flex flex-col gap-6 w-full">
          <div>
            <h3 className="border-b-4 border-emerald-500 pb-2 inline-block text-gray-900 dark:text-white text-2xl font-bold tracking-tight">
              {langue === 'fr' ? "Derniers avis" : "Latest reviews"}
            </h3>
          </div>
          
          {listeAvis.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 italic text-center mt-8 text-lg">
              {langue === 'fr' ? "Aucun avis pour le moment. Soyez le premier !" : "No reviews yet. Be the first!"}
            </p>
          ) : (
            listeAvis.map((avis) => (
              <div 
                key={avis.id} 
                className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 w-full transition-shadow duration-300 group"
                style={{ padding: '30px' }} // Padding forcé ici aussi !
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-5 gap-3">
                  <strong className="text-emerald-600 dark:text-emerald-400 text-xl font-bold tracking-tight">{avis.nom_client}</strong>
                  <div className="text-amber-400 text-xl flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i key={star} className={star <= avis.note ? "fa-solid fa-star" : "fa-regular fa-star"}></i>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg font-medium">"{avis.commentaire}"</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Avis;