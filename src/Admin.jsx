import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import './index.css';

export default function Admin({ setPageCourante }) {
  // --- ÉTATS DE LA PAGE ET RECHERCHE ---
  const [mode, setMode] = useState('ajouter'); 
  const [message, setMessage] = useState('');
  const [produitsDb, setProduitsDb] = useState([]); // Tous les produits pour la recherche
  const [recherche, setRecherche] = useState('');
  const [produitSelectionne, setProduitSelectionne] = useState(null);

  // --- ÉTATS DU FORMULAIRE ---
  const [reference, setReference] = useState('');
  const [nom, setNom] = useState('');
  const [prix, setPrix] = useState('');
  const [image, setImage] = useState('');
  const [stock, setStock] = useState('');

  // --- CHARGER LES PRODUITS (Pour la barre de recherche) ---
  const fetchProduits = async () => {
    const { data } = await supabase.from('products').select('*');
    if (data) setProduitsDb(data);
  };

  // Dès qu'on change d'onglet, on nettoie tout et on recharge les produits
  useEffect(() => {
    setMessage(''); setRecherche(''); setProduitSelectionne(null);
    setReference(''); setNom(''); setPrix(''); setImage(''); setStock('');
    if (mode === 'modifier' || mode === 'supprimer') {
      fetchProduits();
    }
  }, [mode]);

  // --- FONCTION 1 : AJOUTER ---
  const gererAjout = async (e) => {
    e.preventDefault();
    setMessage('⏳ Vérification...');
    const { data: existants } = await supabase.from('products').select('*')
      .or(`nom.eq."${nom}",reference.eq."${reference}"`);

    if (existants && existants.length > 0) {
      setMessage('⚠️ Action bloquée : Ce produit ou cette référence existe déjà !');
      return;
    }

    const { error } = await supabase.from('products').insert([{ 
      reference, nom, prix: parseFloat(prix), image, stock: parseInt(stock) 
    }]);

    if (error) setMessage('❌ Erreur : ' + error.message);
    else {
      setMessage('✅ Produit ajouté avec succès !');
      setReference(''); setNom(''); setPrix(''); setImage(''); setStock(''); 
    }
  };

  // --- FONCTION 2 : MODIFIER ---
  const gererModification = async (e) => {
    e.preventDefault();
    if (!produitSelectionne) return;
    setMessage('⏳ Modification en cours...');
    
    const { error } = await supabase.from('products')
      .update({ reference, nom, prix: parseFloat(prix), image, stock: parseInt(stock) })
      .eq('id', produitSelectionne.id);

    if (error) setMessage('❌ Erreur : ' + error.message);
    else {
      setMessage('✅ Produit mis à jour avec succès !');
      fetchProduits(); // Met à jour la liste cachée
    }
  };

  // --- FONCTION 3 : SUPPRIMER ---
  const gererSuppression = async () => {
    if (!produitSelectionne) return;
    setMessage('⏳ Suppression en cours...');
    
    const { error } = await supabase.from('products').delete().eq('id', produitSelectionne.id);

    if (error) setMessage('❌ Erreur : ' + error.message);
    else {
      setMessage('✅ Produit supprimé définitivement !');
      setProduitSelectionne(null);
      setRecherche('');
      fetchProduits(); // Met à jour la liste
    }
  };

  // --- LA BARRE DE RECHERCHE MAGIQUE ---
  const renderSearchBar = () => {
    const suggestions = produitsDb.filter(p => 
      p.nom.toLowerCase().includes(recherche.toLowerCase()) || 
      (p.reference && p.reference.toLowerCase().includes(recherche.toLowerCase()))
    );

    return (
      <div style={{ marginBottom: '20px', position: 'relative', textAlign: 'left' }}>
        <input
          type="text"
          placeholder="🔍 Rechercher par nom ou référence..."
          value={recherche}
          onChange={(e) => {
            setRecherche(e.target.value);
            setProduitSelectionne(null); // On désélectionne si on retape quelque chose
          }}
          style={{ width: '100%', padding: '12px', border: '2px solid #ccc', borderRadius: '8px', outline: 'none' }}
        />
        {/* LA BOÎTE DE SUGGESTIONS */}
        {recherche && !produitSelectionne && suggestions.length > 0 && (
          <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #ccc', zIndex: 20, maxHeight: '200px', overflowY: 'auto', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginTop: '5px' }}>
            {suggestions.map(p => (
              <div 
                key={p.id} 
                onClick={() => {
                  setProduitSelectionne(p);
                  setRecherche(p.nom);
                  setReference(p.reference || ''); setNom(p.nom); setPrix(p.prix); setImage(p.image); setStock(p.stock);
                  setMessage('');
                }} 
                style={{ padding: '12px', cursor: 'pointer', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span><strong>{p.nom}</strong> <small style={{color: 'gray'}}>({p.reference || 'Sans réf'})</small></span>
                <span style={{ backgroundColor: p.stock > 0 ? '#d1fae5' : '#fee2e2', color: p.stock > 0 ? '#065f46' : '#991b1b', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  📦 {p.stock} en stock
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // --- STYLES DES BOUTONS ONGLETS ---
  const btnStyle = { flex: 1, padding: '10px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' };
  const activeStyle = { ...btnStyle, backgroundColor: '#10b981', color: 'white' };
  const inactiveStyle = { ...btnStyle, backgroundColor: '#f3f4f6', color: '#6b7280' };

  return (
    <div className="login-page">
      <div className="login-box" style={{ maxWidth: '600px', zIndex: 10 }}>
        <h2 style={{ color: '#10b981', marginBottom: '20px' }}>
          <i className="fa-solid fa-lock"></i> Panneau de Contrôle
        </h2>
        
        {/* BOUTONS DE NAVIGATION */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
          <button style={mode === 'ajouter' ? activeStyle : inactiveStyle} onClick={() => setMode('ajouter')}>
            <i className="fa-solid fa-plus"></i> Ajouter
          </button>
          <button style={mode === 'modifier' ? { ...activeStyle, backgroundColor: '#3b82f6' } : inactiveStyle} onClick={() => setMode('modifier')}>
            <i className="fa-solid fa-pen"></i> Modifier
          </button>
          <button style={mode === 'supprimer' ? { ...activeStyle, backgroundColor: '#ef4444' } : inactiveStyle} onClick={() => setMode('supprimer')}>
            <i className="fa-solid fa-trash"></i> Supprimer
          </button>
        </div>

        {/* ================= ONGLET : AJOUTER ================= */}
        {mode === 'ajouter' && (
          <form onSubmit={gererAjout} className="login-form">
            <input type="text" placeholder="Référence" value={reference} onChange={(e) => setReference(e.target.value)} required />
            <input type="text" placeholder="Nom du produit" value={nom} onChange={(e) => setNom(e.target.value)} required />
            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
              <input type="number" step="0.01" placeholder="Prix (€)" value={prix} onChange={(e) => setPrix(e.target.value)} required />
              <input type="number" placeholder="Stock initial" value={stock} onChange={(e) => setStock(e.target.value)} required />
            </div>
            <input type="text" placeholder="Lien de l'image" value={image} onChange={(e) => setImage(e.target.value)} required />
            <button type="submit" className="btn-login" style={{ backgroundColor: '#10b981' }}>Ajouter au catalogue</button>
          </form>
        )}

        {/* ================= ONGLET : MODIFIER ================= */}
        {mode === 'modifier' && (
          <div>
            {renderSearchBar()}
            {produitSelectionne && (
              <form onSubmit={gererModification} className="login-form" style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                <p style={{ textAlign: 'left', margin: '0 0 10px 0', color: '#3b82f6', fontWeight: 'bold' }}>✏️ Modification de : {produitSelectionne.nom}</p>
                <input type="text" placeholder="Référence" value={reference} onChange={(e) => setReference(e.target.value)} required />
                <input type="text" placeholder="Nom du produit" value={nom} onChange={(e) => setNom(e.target.value)} required />
                <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                  <input type="number" step="0.01" placeholder="Prix (€)" value={prix} onChange={(e) => setPrix(e.target.value)} required />
                  <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} required />
                </div>
                <input type="text" placeholder="Lien de l'image" value={image} onChange={(e) => setImage(e.target.value)} required />
                <button type="submit" className="btn-login" style={{ backgroundColor: '#3b82f6' }}>Enregistrer les modifications</button>
              </form>
            )}
          </div>
        )}

        {/* ================= ONGLET : SUPPRIMER ================= */}
        {mode === 'supprimer' && (
          <div>
            {renderSearchBar()}
            {produitSelectionne && (
              <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px', textAlign: 'center' }}>
                <img src={produitSelectionne.image} alt="produit" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} />
                <h3 style={{ margin: '0 0 5px 0' }}>{produitSelectionne.nom}</h3>
                <p style={{ color: '#ef4444', fontWeight: 'bold', marginBottom: '20px' }}>Attention, cette action est irréversible !</p>
                
                <button onClick={gererSuppression} className="btn-login" style={{ backgroundColor: '#ef4444' }}>
                  <i className="fa-solid fa-triangle-exclamation"></i> Confirmer la suppression
                </button>
              </div>
            )}
          </div>
        )}

        {/* MESSAGES */}
        {message && (
          <p style={{ marginTop: '15px', fontWeight: 'bold', color: message.includes('✅') ? '#10b981' : (message.includes('⚠️') ? '#f59e0b' : 'red') }}>
            {message}
          </p>
        )}

        <button className="btn-back" onClick={() => setPageCourante('accueil')} style={{ marginTop: '25px' }}>
          <i className="fa-solid fa-arrow-left"></i> Retour à la boutique
        </button>
      </div>
    </div>
  );
}