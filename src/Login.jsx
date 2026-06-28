import { useState } from 'react';
import { supabase } from './supabase';
import './index.css';

export default function Login({ setPageCourante }) {
  // --- ÉTATS ---
  const [email, setEmail] = useState(''); // 👈 On est revenu à un simple Email !
  const [password, setPassword] = useState('');
  
  // Champs supplémentaires pour l'inscription
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [age, setAge] = useState('');
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState('');

  // --- FONCTION CLASSIQUE (Email / Mot de passe + Infos) ---
  const handleAuth = async (e) => {
    e.preventDefault();
    setMessage('⏳ Chargement en cours...');

    if (isSignUp) {
      // 📝 LOGIQUE D'INSCRIPTION
      const { error } = await supabase.auth.signUp({ 
        email: email, 
        password: password,
        options: {
          data: {
            prenom: prenom,
            nom: nom,
            age: age
          }
        }
      });
      
      if (error) {
        setMessage('❌ Erreur : ' + error.message);
      } else {
        setMessage('✅ Super ! Vérifie tes emails pour confirmer ton compte.');
      }
    } else {
      // 🔐 LOGIQUE DE CONNEXION
      const { error } = await supabase.auth.signInWithPassword({ 
        email: email, 
        password: password 
      });
      
      if (error) {
        setMessage('❌ Erreur : Vérifie tes identifiants.');
      } else {
        setMessage('✅ Connexion réussie ! Retour à la boutique...');
        setTimeout(() => setPageCourante('accueil'), 1500);
      }
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
    <div className="login-page">
      
      {/* 🌟 NOS DÉCORATIONS FLOTTANTES 🌟 */}
      <div className="floating-emoji emoji-1">🛍️</div>
      <div className="floating-emoji emoji-2">✨</div>
      <div className="floating-emoji emoji-3">🚀</div>
      <div className="floating-emoji emoji-4">💻</div>
      <div className="floating-emoji emoji-5">🎧</div>
      <div className="floating-emoji emoji-6">🛒</div>
      <div className="floating-emoji emoji-7">📱</div>
      <div className="floating-emoji emoji-8">🎮</div>

      <div className="login-box">
        <h2 style={{ color: 'var(--primary-color)', marginBottom: '20px' }}>
          {isSignUp ? 'Créer ton profil ZAID SHOP' : 'Bon retour chez l\'Élite'}
        </h2>
        
        <form onSubmit={handleAuth} className="login-form">
          
          {isSignUp && (
            <>
              {/* Le container flex corrigé avec width: 100% */}
              <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                <input 
                  type="text" 
                  placeholder="Prénom" 
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  required={isSignUp} 
                />
                <input 
                  type="text" 
                  placeholder="Nom" 
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  required={isSignUp}
                />
              </div>
              <input 
                type="number" 
                placeholder="Ton âge" 
                min="13"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required={isSignUp} 
              />
            </>
          )}

          <input 
            type="email" 
            placeholder="Ton adresse email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <input 
            type="password" 
            placeholder="Ton mot de passe secret" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          
          <button type="submit" className="btn-login">
            {isSignUp ? "Créer mon compte" : "Se connecter"}
          </button>
        </form>

        <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <button 
            type="button" 
            className="btn-google" 
            onClick={handleGoogleLogin}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#fff',
              color: '#333',
              border: '1px solid #ccc',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
            }}
          >
            <i className="fa-brands fa-google" style={{ color: '#DB4437' }}></i> 
            Continuer avec Google
          </button>
        </div>

        {message && <p className="auth-message">{message}</p>}

        <p className="toggle-auth" onClick={() => {
            setIsSignUp(!isSignUp);
            setMessage(''); 
          }}>
          {isSignUp ? 'Tu as déjà un compte ? Connecte-toi' : "Pas encore de compte ? Inscris-toi"}
        </p>
        
        <button className="btn-back" onClick={() => setPageCourante('accueil')}>
          <i className="fa-solid fa-arrow-left"></i> Retour à la boutique
        </button>
      </div>
    </div>
  );
}