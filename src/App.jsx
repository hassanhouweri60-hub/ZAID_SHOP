import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { supabase } from './supabase';
import './index.css';

// Importation des pages
import Login from './Login';
import Admin from './Admin';
import Avis from './Avis';
import Commandes from './Commandes';
import Contact from './Contact';
import Payement from './Payement';

// Importation des composants isolés
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import CartModal from './components/CartModal';
import ProductCard from './components/ProductCard'; // 👈 استيراد كرت المنتج الجديد

// --- LE DICTIONNAIRE DE TRADUCTION ---
const traductions = {
  fr: {
    accueil: "Accueil", boutique: "Boutique", contact: "Contact", panier: "Panier", recherche: "Rechercher un produit...",
    enStock: "En stock", rupture: "Rupture de stock", ajouter: "Ajouter au panier", bonjour: "Bonjour", admin: "Admin",
    seConnecter: "Se connecter", seDeconnecter: "Se déconnecter", titreHero: "Bienvenue chez l'Élite",
    descHero: "Découvrez notre sélection exclusive de produits technologiques, de lecture et d'accessoires premium.",
    nosProduits: "Nos Produits Tendances", horsStock: "Hors Stock", aucunProduit: "Aucun produit ne correspond à votre recherche.",
    votrePanier: "Votre Panier", panierVide: "Votre panier est vide.", total: "Total", commander: "Passer la commande",
    droits: "Tous droits réservés.", ajouteNotif: "a été ajouté au panier !", aBientot: "À bientôt !", avis: "Avis Clients",
    infoPersonnel: "Infos Personnelles", mesCommandes: "Mes Commandes", erreurConnexion: "Veuillez vous connecter pour commander.",
    commandeSucces: "Commande passée avec succès !"
  },
  en: {
    accueil: "Home", boutique: "Shop", contact: "Contact", panier: "Cart", recherche: "Search a product...",
    enStock: "In stock", rupture: "Out of stock", ajouter: "Add to cart", bonjour: "Hello", admin: "Admin",
    seConnecter: "Login", seDeconnecter: "Logout", titreHero: "Welcome to the Elite",
    descHero: "Discover our exclusive selection of technological products, reading materials, and premium accessories.",
    nosProduits: "Trending Products", horsStock: "Out of Stock", aucunProduit: "No products match your search.",
    votrePanier: "Your Cart", panierVide: "Your cart is empty.", total: "Total", commander: "Checkout",
    droits: "All rights reserved.", ajouteNotif: "has been added to the cart!", aBientot: "See you soon!", avis: "Customer Reviews",
    infoPersonnel: "Personal Info", mesCommandes: "My Orders", erreurConnexion: "Please log in to checkout.",
    commandeSucces: "Order placed successfully!"
  }
};

function App() {
  const navigate = useNavigate();

  // --- VARIABLES D'ÉTAT ---
  const [produits, setProduits] = useState([]);
  const [panier, setPanier] = useState(() => {
    const panierSauvegarde = localStorage.getItem('zaid_shop_panier');
    return panierSauvegarde ? JSON.parse(panierSauvegarde) : [];
  });
  
  useEffect(() => localStorage.setItem('zaid_shop_panier', JSON.stringify(panier)), [panier]);
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [recherche, setRecherche] = useState("");
  const [theme, setTheme] = useState("light");
  const [notification, setNotification] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [langue, setLangue] = useState('fr'); 
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const [utilisateur, setUtilisateur] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); 

  const setPageCourante = (page) => {
    if (page === 'accueil') navigate('/');
    else navigate(`/${page}`);
  };

  useEffect(() => {
    const verifierAdmin = async (user) => {
      setUtilisateur(user);
      if (user) {
        const { data } = await supabase.from('admins').select('email').eq('email', user.email).single();
        setIsAdmin(!!data); 
      } else {
        setIsAdmin(false);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => verifierAdmin(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => verifierAdmin(session?.user ?? null));
    
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProduits = async () => {
      const { data, error } = await supabase.from('products').select('*');
      if (!error) setProduits(data);
    };
    fetchProduits();
  }, []);

  const getNomClient = () => {
    if (!utilisateur) return "";
    return utilisateur.user_metadata?.full_name || utilisateur.user_metadata?.prenom || utilisateur.email.split('@')[0];
  };

  const seDeconnecter = async () => {
    await supabase.auth.signOut();
    setIsMenuOpen(false);
    setNotification(`👋 ${traductions[langue].aBientot}`);
  };

  const ajouterAuPanier = (produit) => {
    const produitExistant = panier.find(item => item.id === produit.id);
    if (produitExistant && produitExistant.quantite >= produit.stock) {
      setNotification(langue === 'fr' ? `⚠️ Stock maximum atteint pour ${produit.nom}` : `⚠️ Maximum stock reached for ${produit.nom}`);
      return;
    }
    if (produitExistant) {
      setPanier(panier.map(item => item.id === produit.id ? { ...item, quantite: item.quantite + 1 } : item));
    } else {
      setPanier([...panier, { ...produit, quantite: 1 }]);
    }
    setNotification(`🛒 ${produit.nom} ${traductions[langue].ajouteNotif}`);
  };

  const diminuerQuantite = (id) => {
    const produitExistant = panier.find(item => item.id === id);
    if (produitExistant.quantite === 1) supprimerDuPanier(id);
    else setPanier(panier.map(item => item.id === id ? { ...item, quantite: item.quantite - 1 } : item));
  };

  const supprimerDuPanier = (id) => setPanier(panier.filter(item => item.id !== id));
  const viderPanier = () => setPanier([]);

  const passerCommande = async () => {
    if (panier.length === 0) return;
    if (!utilisateur) {
      setNotification(`⚠️ ${traductions[langue].erreurConnexion}`);
      setIsCartOpen(false);
      navigate('/login'); 
      return; 
    }

    setNotification(langue === 'fr' ? "⏳ Traitement en cours..." : "⏳ Processing...");
    
    let toutEstEnStock = true;
    let produitEnRupture = "";

    for (const item of panier) {
      const { data: success, error: rpcError } = await supabase.rpc('diminuer_stock', {
        p_id: item.id,
        p_quantite: item.quantite
      });
      
      if (rpcError || !success) {
        toutEstEnStock = false;
        produitEnRupture = item.nom;
        break; 
      }
    }

    if (!toutEstEnStock) {
      setNotification(langue === 'fr' 
        ? `❌ Désolé, le produit "${produitEnRupture}" n'est plus en stock suffisant !` 
        : `❌ Sorry, "${produitEnRupture}" is out of stock!`);
      return; 
    }

    const { error } = await supabase.from('commandes').insert([{ 
      client_nom: getNomClient(), 
      client_email: utilisateur.email, 
      prix_total: parseFloat(total), 
      contenu_panier: panier 
    }]);

    if (!error) {
      viderPanier(); 
      setIsCartOpen(false);
      navigate('/succes');
    } else {
      console.error("Erreur lors de la création de la commande :", error);
      setNotification(langue === 'fr' ? "❌ Erreur de serveur." : "❌ Server error.");
    }
  };

  const total = panier.reduce((somme, item) => somme + (item.prix * item.quantite), 0).toFixed(2);
  const nombreArticles = panier.reduce((total, item) => total + item.quantite, 0);
  const produitsFiltres = produits.filter(p => p.nom.toLowerCase().includes(recherche.toLowerCase()));
  const cliqueSurSuggestion = (nomProduit) => { setRecherche(nomProduit); setShowSuggestions(false); };
  
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  useEffect(() => { document.body.className = theme; }, [theme]);
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="font-sans antialiased text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {notification && <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-6 py-3 rounded-full shadow-2xl font-bold z-[9999] flex items-center gap-2 animate-bounce">{notification}</div>}

      <Routes>
        <Route path="/login" element={<Login setPageCourante={setPageCourante} />} />
        <Route path="/admin" element={<Admin setPageCourante={setPageCourante} />} />
        <Route path="/avis" element={<Avis setPageCourante={setPageCourante} utilisateur={utilisateur} langue={langue} />} />
        <Route path="/commandes" element={<Commandes setPageCourante={setPageCourante} utilisateur={utilisateur} langue={langue} />} />
        <Route path="/contact" element={<Contact setPageCourante={setPageCourante} langue={langue} />} />
        <Route path="/succes" element={<Payement setPageCourante={setPageCourante} theme={theme} traductions={traductions} langue={langue} />} />
        
        <Route path="/" element={
          <div className="flex flex-col min-h-screen">
            
            <Navbar 
              setIsMenuOpen={setIsMenuOpen} langue={langue} setLangue={setLangue} 
              utilisateur={utilisateur} getNomClient={getNomClient} seDeconnecter={seDeconnecter} 
              theme={theme} toggleTheme={toggleTheme} setIsCartOpen={setIsCartOpen} 
              nombreArticles={nombreArticles} traductions={traductions} isAdmin={isAdmin}
            />

            {isMenuOpen && (
              <Sidebar 
                setIsMenuOpen={setIsMenuOpen} langue={langue} setLangue={setLangue} 
                utilisateur={utilisateur} getNomClient={getNomClient} seDeconnecter={seDeconnecter} 
                traductions={traductions} isAdmin={isAdmin}
              />
            )}

            <Hero langue={langue} traductions={traductions} />

            <main id="boutique" className="py-16 px-4 max-w-7xl mx-auto flex-grow w-full">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#1e3a8a] dark:text-white mb-4">{traductions[langue].nosProduits}</h2>
                <div className="h-1 w-20 bg-[#f59e0b] mx-auto rounded-full"></div>
              </div>
              
              <div className="max-w-2xl mx-auto relative mb-12 z-20">
                <div className="relative flex items-center bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 h-16 overflow-hidden">
                  <div className="pl-6 text-gray-400 text-xl"><i className="fa-solid fa-magnifying-glass"></i></div>
                  <input 
                    type="text" placeholder={traductions[langue].recherche} autoComplete="off" 
                    value={recherche} onChange={(e) => { setRecherche(e.target.value); setShowSuggestions(true); }} 
                    onFocus={() => setShowSuggestions(true)} onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="w-full h-full bg-transparent border-none px-4 text-gray-900 dark:text-white outline-none font-medium text-lg placeholder-gray-400"
                  />
                </div>
                {showSuggestions && recherche.length > 0 && produitsFiltres.length > 0 && (
                  <div className="absolute top-20 left-0 w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden max-h-60 overflow-y-auto">
                    {produitsFiltres.map((produit) => (
                      <div key={produit.id} className="px-6 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-50 dark:border-gray-700 flex items-center gap-3 transition-colors text-gray-800 dark:text-gray-200 font-medium" onClick={() => cliqueSurSuggestion(produit.nom)}>
                        <i className="fa-solid fa-magnifying-glass text-gray-400 text-sm"></i> {produit.nom}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* 👈 استخدام المكون الجديد بدلاً من الكود الطويل */}
                {produitsFiltres.map((produit) => (
                  <ProductCard 
                    key={produit.id} 
                    produit={produit} 
                    langue={langue} 
                    traductions={traductions} 
                    ajouterAuPanier={ajouterAuPanier} 
                  />
                ))}
                
                {produitsFiltres.length === 0 && (
                  <div className="col-span-full py-20 text-center opacity-50">
                    <i className="fa-solid fa-box-open text-6xl text-gray-400 mb-4"></i>
                    <p className="text-xl font-bold text-gray-500">{traductions[langue].aucunProduit}</p>
                  </div>
                )}
              </div>
            </main>

            {isCartOpen && (
              <CartModal 
                setIsCartOpen={setIsCartOpen} panier={panier} supprimerDuPanier={supprimerDuPanier} 
                diminuerQuantite={diminuerQuantite} ajouterAuPanier={ajouterAuPanier} total={total} 
                passerCommande={passerCommande} langue={langue} traductions={traductions}
              />
            )}

            <Footer langue={langue} traductions={traductions} />

          </div>
        } />
      </Routes>
    </div>
  );
}

export default App;