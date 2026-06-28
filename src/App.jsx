import { useState, useEffect } from 'react';
import Login from './Login';
import Admin from './Admin';
import './index.css';
import { supabase } from './supabase';

function App() {
// --- VARIABLES D'ÉTAT ---
  const [produits, setProduits] = useState([]); // 👈 المنتجات صارت تجي من قاعدة البيانات

  // --- VARIABLES D'ÉTAT ---
  const [pageCourante, setPageCourante] = useState('accueil'); 
  const [panier, setPanier] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [recherche, setRecherche] = useState("");
  const [theme, setTheme] = useState("light");
  const [notification, setNotification] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // 👉 LA VARIABLE MANQUANTE EST LÀ :
  const [utilisateur, setUtilisateur] = useState(null);

  // --- ESPION DE CONNEXION SUPABASE (Le cerveau manquant !) ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUtilisateur(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUtilisateur(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // --- جلب المنتجات من Supabase ---
  useEffect(() => {
    const fetchProduits = async () => {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        console.error("Erreur fetch produits:", error);
      } else {
        setProduits(data);
      }
    };
    fetchProduits();
  }, []);

  const getNomClient = () => {
    if (!utilisateur) return "";
    if (utilisateur.user_metadata?.full_name) return utilisateur.user_metadata.full_name;
    if (utilisateur.user_metadata?.prenom) return utilisateur.user_metadata.prenom;
    return utilisateur.email.split('@')[0];
  };

  const seDeconnecter = async () => {
    await supabase.auth.signOut();
    setNotification("👋 À bientôt !");
  };

  // --- LOGIQUE DU PANIER ---
  const ajouterAuPanier = (produit) => {
    const produitExistant = panier.find(item => item.id === produit.id);
    if (produitExistant) {
      setPanier(panier.map(item => 
        item.id === produit.id ? { ...item, quantite: item.quantite + 1 } : item
      ));
    } else {
      setPanier([...panier, { ...produit, quantite: 1 }]);
    }
    setNotification(`🛒 ${produit.nom} a été ajouté au panier !`);
  };

  const diminuerQuantite = (id) => {
    const produitExistant = panier.find(item => item.id === id);
    if (produitExistant.quantite === 1) {
      supprimerDuPanier(id);
    } else {
      setPanier(panier.map(item => 
        item.id === id ? { ...item, quantite: item.quantite - 1 } : item
      ));
    }
  };

  const supprimerDuPanier = (id) => {
    setPanier(panier.filter(item => item.id !== id));
  };

  const viderPanier = () => {
    setPanier([]);
  };

  const total = panier.reduce((somme, item) => somme + (item.prix * item.quantite), 0).toFixed(2);
  const nombreArticles = panier.reduce((total, item) => total + item.quantite, 0);

  // --- RECHERCHE ET THÈME ---
  const produitsFiltres = produits.filter(produit => 
    produit.nom.toLowerCase().includes(recherche.toLowerCase())
  );

  const cliqueSurSuggestion = (nomProduit) => {
    setRecherche(nomProduit);
    setShowSuggestions(false);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // --------------------------------------------------------
  // LE GRAND AIGUILLAGE DES PAGES 🚂
  // --------------------------------------------------------
  
  if (pageCourante === 'login') {
    return <Login setPageCourante={setPageCourante} />;
  }
  if (pageCourante === 'admin') {
    return <Admin setPageCourante={setPageCourante} />;
  }

  // SINON, ON AFFICHE TOUTE LA BOUTIQUE CLASSIQUE 👇
  return (
    <div>
      <nav className="navbar">
        <div className="logo">
          <i className="fa-solid fa-store"></i> ZAID <span>SHOP</span>
        </div>
        <ul className="nav-links">
          <li><a href="#accueil">Accueil</a></li>
          <li><a href="#boutique">Boutique</a></li>
          <li><a href="/contact.html">Contact</a></li>
          {/* 🕵️‍♂️ LE BOUTON SECRET ADMIN (Visible QUE par toi) */}
          {utilisateur && utilisateur.email === 'hassanhouweri60@gmail.com' && (
            <li>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); setPageCourante('admin'); }}
                style={{ color: '#10b981', fontWeight: 'bold' }}
              >
                <i className="fa-solid fa-lock"></i> Admin
              </a>
            </li>
          )}
          
          {/* --- AFFICHAGE CONDITIONNEL : UTILISATEUR CONNECTÉ OU NON --- */}
          {utilisateur ? (
            <li style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>
                <i className="fa-solid fa-face-smile"></i> Bonjour, {getNomClient()}
              </span>
              <button 
                onClick={seDeconnecter}
                style={{
                  background: 'none', border: 'none', color: '#ef4444', 
                  cursor: 'pointer', fontSize: '1rem'
                }}
                title="Se déconnecter"
              >
                <i className="fa-solid fa-right-from-bracket"></i>
              </button>
            </li>
          ) : (
            <li>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); setPageCourante('login'); }}
                style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}
              >
                <i className="fa-solid fa-user"></i> Se connecter
              </a>
            </li>
          )}
        </ul>
        
        <div className="theme-toggle" onClick={toggleTheme} style={{ cursor: 'pointer', marginRight: '20px', fontSize: '1.2rem' }}>
          <i className={theme === "light" ? "fa-solid fa-moon" : "fa-solid fa-sun"}></i>
        </div>
        
        <div className="cart-icon" onClick={() => setIsCartOpen(true)} style={{ cursor: 'pointer' }}>
          <i className="fa-solid fa-cart-shopping"></i>
          <span id="cart-count">{nombreArticles}</span>
        </div>
      </nav>

      <header id="accueil" className="hero">
        <div className="hero-content">
          <h1>Bienvenue chez l'Élite</h1>
          <p>Découvrez notre sélection exclusive de produits technologiques, de lecture et d'accessoires premium.</p>
        </div>
      </header>

      <main id="boutique" className="shop-section">
        <div className="section-title">
          <h2>Nos Produits Tendances</h2>
          <div className="underline"></div>
        </div>
        
        <div className="search-container">
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Rechercher un produit ..." 
              autoComplete="off"
              value={recherche}
              onChange={(e) => {
                setRecherche(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>

          {showSuggestions && recherche.length > 0 && produitsFiltres.length > 0 && (
            <div className="suggestions-box" style={{ display: 'block' }}>
              {produitsFiltres.map((produit) => (
                <div 
                  key={produit.id} 
                  className="suggestion-item"
                  onClick={() => cliqueSurSuggestion(produit.nom)}
                >
                  <i className="fa-solid fa-magnifying-glass" style={{ fontSize: '0.8rem', marginRight: '10px', color: 'var(--text-light)' }}></i>
                  {produit.nom}
                </div>
              ))}
            </div>
          )}
        </div>
        
       <div className="product-grid">
          {produitsFiltres.map((produit) => (
            <div key={produit.id} className="product-card">
              <img src={produit.image} alt={produit.nom} className="product-img" />
              <div className="product-info">
                <h3>{produit.nom}</h3>
                <p className="price">{produit.prix} €</p>
                <p style={{ fontSize: '0.8rem', color: produit.stock > 0 ? 'green' : 'red' }}>
                  {produit.stock > 0 ? (
                    <>
                      En stock 
                      {/* 🕵️‍♂️ Si c'est l'admin connecté, on affiche le chiffre exact à côté */}
                      {utilisateur && utilisateur.email === 'hassanhouweri60@gmail.com' && (
                        <span style={{ fontWeight: 'bold', marginLeft: '5px' }}>({produit.stock})</span>
                      )}
                    </>
                  ) : (
                    "Rupture de stock"
                  )}
                </p>
                
                {/* 👈 الشرط الذكي: إذا كان الستوك صفر، نعطل الزر ونغير شكله */}
                {produit.stock > 0 ? (
                  <button className="add-to-cart" onClick={() => ajouterAuPanier(produit)}>
                    Ajouter au panier <i className="fa-solid fa-cart-plus"></i>
                  </button>
                ) : (
                  <button className="add-to-cart" style={{ backgroundColor: '#ccc', cursor: 'not-allowed' }} disabled>
                    Hors Stock ❌
                  </button>
                )}
              </div>
            </div>
          ))}
          {produitsFiltres.length === 0 && (
            <p>Aucun produit ne correspond à votre recherche.</p>
          )}
        </div>
      </main>

      {/* PANIER MODAL */}
      { isCartOpen && (
        <div className="cart-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cart-header">
              <h2>Votre Panier</h2>
              <button id="close-cart" onClick={() => setIsCartOpen(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            <div className="cart-items">
              {panier.length === 0 ? (
                <p style={{ textAlign: 'center', marginTop: '20px' }}>Votre panier est vide.</p>
              ) : (
                panier.map((item) => (
                  <div key={item.id} className="cart-item">
                    <img src={item.image} alt={item.nom} />
                    <div className="item-details" style={{ flexGrow: 1 }}>
                      <h4>{item.nom}</h4>
                      <p style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{item.prix} €</p>
                      <div className="quantity-controls">
                        <button onClick={() => diminuerQuantite(item.id)}>-</button>
                        <span>{item.quantite}</span>
                        <button onClick={() => ajouterAuPanier(item)}>+</button>
                      </div>
                    </div>
                    <i 
                      className="fa-solid fa-trash remove-btn" 
                      onClick={() => supprimerDuPanier(item.id)}
                      title="Supprimer"
                    ></i>
                  </div>
                ))
              )}
            </div>
            
            <div className="cart-footer">
              <h3>Total : <span>{total}</span> €</h3>
              <button className="btn-checkout" onClick={viderPanier}>
                Passer la commande
              </button>
            </div>
          </div>
        </div>
      )}

      {notification && (
        <div className="toast-notification">
          {notification}
        </div>
      )}

      <footer>
        <p>&copy; 2026 ZAID SHOP. Tous droits réservés.</p>
      </footer>
    </div>
  );
}

export default App;