import React from 'react';

export default function ProductCard({ produit, langue, traductions, ajouterAuPanier }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col border border-gray-100 dark:border-gray-700 group">
      
      {/* صورة المنتج */}
      <div className="w-full h-56 bg-gray-100 dark:bg-gray-700 overflow-hidden relative">
        <img 
          src={produit.image} 
          alt={produit.nom} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
        />
      </div>
      
      {/* محتوى الكرت (الاسم، السعر، المخزون، الزر) */}
      <div className="p-5 flex flex-col grow">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{produit.nom}</h3>
          <span className="text-xl font-black text-[#10b981] whitespace-nowrap">{produit.prix} €</span>
        </div>
        
        <div className="mb-5">
          {produit.stock > 0 ? (
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {traductions[langue].enStock} <span className="opacity-70 font-medium">({produit.stock})</span>
            </p>
          ) : (
            <p className="text-sm font-semibold text-red-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              {traductions[langue].rupture}
            </p>
          )}
        </div>
        
        <div className="mt-auto">
          {produit.stock > 0 ? (
            <button 
              className="w-full h-12 bg-[#111827] hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 dark:text-gray-900 text-white font-bold rounded-2xl flex justify-center items-center gap-2 transition-transform active:scale-95 shadow-md"
              onClick={() => ajouterAuPanier(produit)}
            >
              {traductions[langue].ajouter} <i className="fa-solid fa-cart-shopping"></i>
            </button>
          ) : (
            <button 
              className="w-full h-12 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold rounded-2xl flex justify-center items-center gap-2 cursor-not-allowed" disabled
            >
              {traductions[langue].horsStock} <i className="fa-solid fa-ban"></i>
            </button>
          )}
        </div>
      </div>
      
    </div>
  );
}