import { useState } from 'react';
import { supabase } from './supabase';
import './index.css';

export default function Login({ setPageCourante }) {
  // --- ÉTATS ---
  const [etape, setEtape] = useState('email'); 
  const [email, setEmail] = useState(''); 
  const [code, setCode] = useState('');
  
  // Champs supplémentaires pour l'inscription
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [age, setAge] = useState('');
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState('');

  // --- ÉTAPE 1 : ENVOYER LE CODE PAR EMAIL ---
  const handleSendCode = async (e) => {
    e.preventDefault();
    setMessage('⏳ Envoi du code en cours...');

    const { error } = await supabase.auth.signInWithOtp({ 
      email: email,
      options: isSignUp ? {
        data: {
          prenom: prenom,
          nom: nom,
          age: age
        }
      } : {}
    });
    
    if (error) {
      setMessage('❌ Erreur : ' + error.message);
    } else {
      setMessage('✅ Code envoyé ! Vérifie ta boîte mail.');
      setEtape('code'); 
    }
  };

  // --- ÉTAPE 2 : VÉRIFIER LE CODE À 4 CHIFFRES ---
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setMessage('⏳ Vérification du code...');

    const { error } = await supabase.auth.verifyOtp({
      email: email,
      token: code,
      type: 'email' 
    });

    if (error) {
      setMessage('❌ Code incorrect ou expiré.');
    } else {
      setMessage('✅ Connexion réussie ! Retour à la boutique...');
      setTimeout(() => setPageCourante('accueil'), 1500);
    }
  };

  // --- FONCTION POUR LA CONNEXION GOOGLE ---
  const handleGoogleLogin = async () => {
    setMessage('⏳ Redirection vers Google...');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) setMessage('❌ Erreur Google : ' + error.message);
  };

  return (
    <div className="relative min-h-screen w-full bg-gray-50 dark:bg-gray-900 flex justify-center items-center p-4 transition-colors duration-300 font-sans antialiased overflow-hidden">
      
      {/* 🌟 NOS DÉCORATIONS FLOTTANTES 🌟 */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="floating-emoji emoji-1">🛍️</div>
        <div className="floating-emoji emoji-2">✨</div>
        <div className="floating-emoji emoji-3">🚀</div>
        <div className="floating-emoji emoji-4">💻</div>
        <div className="floating-emoji emoji-5">🎧</div>
        <div className="floating-emoji emoji-6">🛒</div>
        <div className="floating-emoji emoji-7">📱</div>
        <div className="floating-emoji emoji-8">🎮</div>
      </div>

      {/* --- CARTE DE CONNEXION --- */}
      <div className="relative z-10 bg-white dark:bg-gray-800 p-8 sm:p-12 rounded-[2rem] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 w-full max-w-md text-center transition-all">
        
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a8a] dark:text-white mb-8 tracking-tight">
          {isSignUp ? 'Créer ton profil ZAID SHOP' : 'Bon retour chez l\'Élite'}
        </h2>
        
        {/* --- AFFICHAGE SELON L'ÉTAPE --- */}
        {etape === 'email' ? (
          <form onSubmit={handleSendCode} className="flex flex-col gap-5">
            {isSignUp && (
              <>
                <div className="flex gap-4 w-full">
                  <input 
                    type="text" 
                    placeholder="Prénom" 
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    required={isSignUp} 
                    className="w-full h-14 px-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#10b981] outline-none transition-all text-lg placeholder-gray-400"
                  />
                  <input 
                    type="text" 
                    placeholder="Nom" 
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    required={isSignUp}
                    className="w-full h-14 px-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#10b981] outline-none transition-all text-lg placeholder-gray-400"
                  />
                </div>
                <input 
                  type="number" 
                  placeholder="Ton âge" 
                  min="13"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required={isSignUp} 
                  className="w-full h-14 px-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#10b981] outline-none transition-all text-lg placeholder-gray-400"
                />
              </>
            )}

            <input 
              type="email" 
              placeholder="Ton adresse email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              className="w-full h-14 px-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#10b981] outline-none transition-all text-lg placeholder-gray-400"
            />
            
            <button type="submit" className="w-full h-14 bg-[#10b981] hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/30 active:scale-95 transition-all text-lg mt-2">
              Recevoir mon code
            </button>
          </form>

        ) : (
          <form onSubmit={handleVerifyCode} className="flex flex-col gap-5">
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-2">
              Un code à 6 chiffres a été envoyé à <br/><strong className="text-gray-900 dark:text-white">{email}</strong>
            </p>
            <input 
              type="text" 
              placeholder="000000" 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength="6"
              required 
              className="w-full h-16 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#10b981] outline-none transition-all text-center text-3xl tracking-[0.5em] font-black placeholder-gray-300 dark:placeholder-gray-700"
            />
            
            <button type="submit" className="w-full h-14 bg-[#10b981] hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/30 active:scale-95 transition-all text-lg mt-2">
              Valider le code
            </button>
            
            <button 
              type="button" 
              onClick={() => setEtape('email')} 
              className="text-gray-500 dark:text-gray-400 hover:text-[#10b981] dark:hover:text-[#10b981] underline font-medium transition-colors"
            >
              Modifier l'adresse email
            </button>
          </form>
        )}

        {/* --- BOUTON GOOGLE --- */}
        {etape === 'email' && (
          <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
            <button 
              type="button" 
              onClick={handleGoogleLogin}
              className="w-full h-14 bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-600 font-bold rounded-2xl flex justify-center items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all shadow-sm active:scale-95 text-lg"
            >
              <i className="fa-brands fa-google text-[#DB4437] text-xl"></i> 
              Continuer avec Google
            </button>
          </div>
        )}

        {/* --- MESSAGES D'ERREUR/SUCCÈS --- */}
        {message && (
          <p className={`font-bold mt-6 text-lg p-3 rounded-xl ${message.includes('✅') ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'}`}>
            {message}
          </p>
        )}

        {/* --- BASCULER CONNEXION / INSCRIPTION --- */}
        {etape === 'email' && (
          <p 
            onClick={() => { setIsSignUp(!isSignUp); setMessage(''); }} 
            className="cursor-pointer mt-6 text-gray-500 dark:text-gray-400 hover:text-[#1e3a8a] dark:hover:text-[#10b981] font-medium transition-colors"
          >
            {isSignUp ? 'Tu as déjà un compte ? Connecte-toi' : "Pas encore de compte ? Inscris-toi"}
          </p>
        )}
        
        {/* --- BOUTON RETOUR --- */}
        <button 
          onClick={() => setPageCourante('accueil')} 
          className="mt-8 flex justify-center items-center gap-2 w-full text-gray-500 dark:text-gray-400 hover:text-[#10b981] dark:hover:text-[#10b981] font-medium transition-colors"
        >
          <i className="fa-solid fa-arrow-left"></i> Retour à la boutique
        </button>

      </div>
    </div>
  );
}