import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import './index.css';

export default function Admin({ setPageCourante }) {
  // --- ÉTATS DE LA PAGE ET RECHERCHE ---
  const [mode, setMode] = useState('ajouter'); 
  const [message, setMessage] = useState('');
  const [produitsDb, setProduitsDb] = useState([]); 
  const [recherche, setRecherche] = useState('');
  const [produitSelectionne, setProduitSelectionne] = useState(null);
  const [enCours, setEnCours] = useState(false);

  // --- ÉTATS DU FORMULAIRE ---
  const [reference, setReference] = useState('');
  const [nom, setNom] = useState('');
  const [prix, setPrix] = useState('');
  const [image, setImage] = useState('');
  const [stock, setStock] = useState('');
  const [fichierImage, setFichierImage] = useState(null);

  // --- CHARGER LES PRODUITS ---
  const fetchProduits = async () => {
    const { data } = await supabase.from('products').select('*');
    if (data) setProduitsDb(data);
  };

  useEffect(() => {
    setMessage(''); setRecherche(''); setProduitSelectionne(null);
    setReference(''); setNom(''); setPrix(''); setImage(''); setStock(''); setFichierImage(null);
    if (mode === 'modifier' || mode === 'supprimer') {
      fetchProduits();
    }
  }, [mode]);

  // --- 🪄 FONCTION MAGIQUE D'UPLOAD ---
  const uploaderImage = async (fichier) => {
    const extension = fichier.name.split('.').pop();
    const nomFichierUnique = `${Date.now()}.${extension}`;
    
    const { error: uploadError } = await supabase.storage
      .from('produits')
      .upload(nomFichierUnique, fichier);

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from('produits')
      .getPublicUrl(nomFichierUnique);

    return urlData.publicUrl;
  };

  // --- FONCTION 1 : AJOUTER ---
  const gererAjout = async (e) => {
    e.preventDefault();
    setEnCours(true);
    setMessage('⏳ Traitement en cours...');

    try {
      const { data: existants } = await supabase.from('products').select('*')
        .or(`nom.eq."${nom}",reference.eq."${reference}"`);

      if (existants && existants.length > 0) {
        setMessage('⚠️ Action bloquée : Ce produit ou cette référence existe déjà !');
        setEnCours(false);
        return;
      }

      let urlFinale = image;
      if (fichierImage) {
        urlFinale = await uploaderImage(fichierImage);
      } else if (!image) {
        setMessage('❌ Veuillez choisir une image ou coller un lien.');
        setEnCours(false);
        return;
      }

      const { error } = await supabase.from('products').insert([{ 
        reference, nom, prix: parseFloat(prix), image: urlFinale, stock: parseInt(stock) 
      }]);

      if (error) throw error;
      
      setMessage('✅ Produit ajouté avec succès !');
      setReference(''); setNom(''); setPrix(''); setImage(''); setStock(''); setFichierImage(null);
      if (document.getElementById('file-upload')) document.getElementById('file-upload').value = '';

    } catch (error) {
      setMessage('❌ Erreur : ' + error.message);
    } finally {
      setEnCours(false);
    }
  };

  // --- FONCTION 2 : MODIFIER ---
  const gererModification = async (e) => {
    e.preventDefault();
    if (!produitSelectionne) return;
    setEnCours(true);
    setMessage('⏳ Modification en cours...');
    
    try {
      let urlFinale = image;
      if (fichierImage) {
        urlFinale = await uploaderImage(fichierImage);
      }

      const { error } = await supabase.from('products')
        .update({ reference, nom, prix: parseFloat(prix), image: urlFinale, stock: parseInt(stock) })
        .eq('id', produitSelectionne.id);

      if (error) throw error;
      
      setMessage('✅ Produit mis à jour avec succès !');
      setFichierImage(null);
      if (document.getElementById('file-upload-mod')) document.getElementById('file-upload-mod').value = '';
      fetchProduits(); 

    } catch (error) {
      setMessage('❌ Erreur : ' + error.message);
    } finally {
      setEnCours(false);
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
      setProduitSelectionne(null); setRecherche(''); fetchProduits(); 
    }
  };

  // --- LA BARRE DE RECHERCHE MAGIQUE ---
  const renderSearchBar = () => {
    const suggestions = produitsDb.filter(p => 
      p.nom.toLowerCase().includes(recherche.toLowerCase()) || 
      (p.reference && p.reference.toLowerCase().includes(recherche.toLowerCase()))
    );

    return (
      <div className="relative w-full mb-8 z-20">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <i className="fa-solid fa-magnifying-glass text-gray-400"></i>
          </div>
          <input
            type="text" 
            placeholder="Rechercher par nom ou référence..." 
            value={recherche}
            onChange={(e) => { setRecherche(e.target.value); setProduitSelectionne(null); }}
            /* Ajout de h-14 pour forcer la hauteur */
            className="w-full h-14 pl-12 pr-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-sm text-base"
          />
        </div>
        
        {recherche && !produitSelectionne && suggestions.length > 0 && (
          <div className="absolute w-full mt-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl max-h-60 overflow-y-auto z-50">
            {suggestions.map(p => (
              <div 
                key={p.id} 
                onClick={() => {
                  setProduitSelectionne(p); setRecherche(p.nom);
                  setReference(p.reference || ''); setNom(p.nom); setPrix(p.prix); setImage(p.image); setStock(p.stock); setMessage(''); setFichierImage(null);
                }} 
                className="p-4 cursor-pointer border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 flex justify-between items-center transition-colors"
              >
                <span className="text-gray-900 dark:text-white font-medium">
                  {p.nom} <span className="text-sm text-gray-400 font-normal">({p.reference || 'Sans réf'})</span>
                </span>
                <span className={`px-3 py-1 rounded-md text-sm font-bold ${p.stock > 0 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                  📦 {p.stock} en stock
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 flex justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 antialiased font-sans">
      
      <div className="bg-white dark:bg-gray-800 w-full max-w-2xl p-8 sm:p-10 rounded-[2rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 h-fit">
        
        {/* Titre */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-emerald-500 mb-8 text-center drop-shadow-sm flex justify-center items-center gap-4">
          <i className="fa-solid fa-lock"></i> Panneau de Contrôle
        </h2>
        
        {/* BOUTONS DE NAVIGATION (Onglets) -> Ajout de h-12 pour forcer la hauteur */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10 bg-gray-100 dark:bg-gray-900 p-2 rounded-2xl">
          <button 
            className={`flex-1 h-12 rounded-xl font-bold flex justify-center items-center gap-2 transition-all duration-200 text-base ${mode === 'ajouter' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            onClick={() => setMode('ajouter')}
          >
            <i className="fa-solid fa-plus"></i> Ajouter
          </button>
          <button 
            className={`flex-1 h-12 rounded-xl font-bold flex justify-center items-center gap-2 transition-all duration-200 text-base ${mode === 'modifier' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            onClick={() => setMode('modifier')}
          >
            <i className="fa-solid fa-pen"></i> Modifier
          </button>
          <button 
            className={`flex-1 h-12 rounded-xl font-bold flex justify-center items-center gap-2 transition-all duration-200 text-base ${mode === 'supprimer' ? 'bg-red-500 text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            onClick={() => setMode('supprimer')}
          >
            <i className="fa-solid fa-trash"></i> Supprimer
          </button>
        </div>

        {/* ================= ONGLET : AJOUTER ================= */}
        {mode === 'ajouter' && (
          <form onSubmit={gererAjout} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Ajout systématique de h-14 et text-base aux inputs */}
              <input type="text" placeholder="Référence" value={reference} onChange={(e) => setReference(e.target.value)} required className="w-full h-14 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-base" />
              <input type="text" placeholder="Nom du produit" value={nom} onChange={(e) => setNom(e.target.value)} required className="w-full h-14 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-base" />
              <input type="number" step="0.01" placeholder="Prix (€)" value={prix} onChange={(e) => setPrix(e.target.value)} required className="w-full h-14 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-base" />
              <input type="number" placeholder="Stock initial" value={stock} onChange={(e) => setStock(e.target.value)} required className="w-full h-14 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-base" />
            </div>
            
            {/* ZONE IMAGE */}
            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col gap-4 mt-2">
              <label className="text-gray-700 dark:text-gray-300 font-bold text-lg">🖼️ Image du produit :</label>
              <input id="file-upload" type="file" accept="image/*" onChange={(e) => setFichierImage(e.target.files[0])} className="w-full h-12 text-gray-600 dark:text-gray-400 file:h-full file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 dark:file:bg-emerald-900/30 dark:file:text-emerald-400 cursor-pointer" />
              <div className="flex items-center gap-4">
                <hr className="flex-1 border-gray-200 dark:border-gray-700" />
                <span className="text-gray-400 text-sm font-medium">OU</span>
                <hr className="flex-1 border-gray-200 dark:border-gray-700" />
              </div>
              <input type="text" placeholder="Coller un lien existant (https://...)" value={image} onChange={(e) => setImage(e.target.value)} className="w-full h-14 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-base" />
            </div>

            {/* Bouton de validation forcé à h-14 */}
            <button type="submit" disabled={enCours} className={`w-full h-14 flex items-center justify-center font-bold rounded-2xl border-none transition-all shadow-lg text-lg mt-4 text-white ${enCours ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30 active:scale-95 cursor-pointer'}`}>
              {enCours ? ( <><i className="fa-solid fa-spinner fa-spin mr-2"></i> Ajout en cours...</> ) : "Ajouter au catalogue"}
            </button>
          </form>
        )}

        {/* ================= ONGLET : MODIFIER ================= */}
        {mode === 'modifier' && (
          <div className="flex flex-col">
            {renderSearchBar()}
            
            {produitSelectionne && (
              <form onSubmit={gererModification} className="flex flex-col gap-5 mt-4 pt-8 border-t border-gray-100 dark:border-gray-700 animate-fade-in">
                <p className="text-blue-500 font-bold text-lg flex items-center gap-2">
                  <i className="fa-solid fa-pen"></i> Modification de : {produitSelectionne.nom}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <input type="text" placeholder="Référence" value={reference} onChange={(e) => setReference(e.target.value)} required className="w-full h-14 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-base" />
                  <input type="text" placeholder="Nom du produit" value={nom} onChange={(e) => setNom(e.target.value)} required className="w-full h-14 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-base" />
                  <input type="number" step="0.01" placeholder="Prix (€)" value={prix} onChange={(e) => setPrix(e.target.value)} required className="w-full h-14 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-base" />
                  <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} required className="w-full h-14 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-base" />
                </div>
                
                {/* ZONE IMAGE */}
                <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col gap-4 mt-2">
                  <label className="text-gray-700 dark:text-gray-300 font-bold">Changer l'image (Optionnel) :</label>
                  <input id="file-upload-mod" type="file" accept="image/*" onChange={(e) => setFichierImage(e.target.files[0])} className="w-full h-12 text-gray-600 dark:text-gray-400 file:h-full file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-400 cursor-pointer" />
                  <p className="text-sm font-medium text-gray-500 mt-2">Lien actuel :</p>
                  <input type="text" placeholder="Lien actuel" value={image} onChange={(e) => setImage(e.target.value)} required className="w-full h-14 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-base" />
                </div>

                <button type="submit" disabled={enCours} className={`w-full h-14 flex items-center justify-center font-bold rounded-2xl border-none transition-all shadow-lg text-lg mt-4 text-white ${enCours ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/30 active:scale-95 cursor-pointer'}`}>
                  {enCours ? ( <><i className="fa-solid fa-spinner fa-spin mr-2"></i> Modification...</> ) : "Enregistrer les modifications"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ================= ONGLET : SUPPRIMER ================= */}
        {mode === 'supprimer' && (
          <div className="flex flex-col">
            {renderSearchBar()}
            
            {produitSelectionne && (
              <div className="mt-4 pt-8 border-t border-gray-100 dark:border-gray-700 flex flex-col items-center text-center animate-fade-in">
                <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-md mb-6 border-4 border-white dark:border-gray-700">
                  <img src={produitSelectionne.image} alt="produit" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{produitSelectionne.nom}</h3>
                <p className="text-red-500 font-bold mb-8 bg-red-50 dark:bg-red-900/20 py-2 px-6 rounded-full inline-block">
                  <i className="fa-solid fa-circle-exclamation mr-2"></i> Attention, cette action est irréversible !
                </p>
                
                <button onClick={gererSuppression} className="w-full h-14 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl border-none transition-all shadow-lg shadow-red-500/30 active:scale-95 text-lg cursor-pointer gap-3">
                  <i className="fa-solid fa-trash"></i> Confirmer la suppression
                </button>
              </div>
            )}
          </div>
        )}

        {/* MESSAGES */}
        {message && (
          <div className={`mt-8 min-h-[56px] flex items-center justify-center p-4 rounded-xl font-bold text-center text-lg gap-2 ${message.includes('✅') ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : (message.includes('⚠️') ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400')}`}>
            {message}
          </div>
        )}

        {/* Bouton Retour */}
        <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-center">
          <button 
            onClick={() => setPageCourante('accueil')} 
            className="flex items-center h-12 px-4 gap-2 bg-transparent border-none text-gray-500 dark:text-gray-400 font-medium cursor-pointer text-lg hover:text-emerald-500 transition-colors"
          >
            <i className="fa-solid fa-arrow-left"></i> Retour à la boutique
          </button>
        </div>
        
      </div>
    </div>
  );
}