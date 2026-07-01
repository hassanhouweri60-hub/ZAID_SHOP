import React from 'react';

export default function CartModal({
  setIsCartOpen, panier, supprimerDuPanier, diminuerQuantite, 
  ajouterAuPanier, total, passerCommande, langue, traductions
}) {
  return (
    <div className="fixed inset-0 bg-black/50 z-[200] flex justify-end" onClick={() => setIsCartOpen(false)}>
      <div className="w-full md:w-[450px] bg-white dark:bg-gray-900 h-full flex flex-col shadow-2xl transition-colors animate-slide-in-right" onClick={(e) => e.stopPropagation()}>
        <div className="h-20 px-6 bg-[#1e3a8a] text-white flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold flex items-center gap-3"><i className="fa-solid fa-cart-shopping"></i> {traductions[langue].votrePanier}</h2>
          <button onClick={() => setIsCartOpen(false)} className="text-2xl hover:text-red-400 transition-colors"><i className="fa-solid fa-xmark"></i></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-gray-50 dark:bg-gray-800">
          {panier.length === 0 ? (
            <div className="m-auto text-center opacity-50">
              <i className="fa-solid fa-cart-arrow-down text-6xl mb-4 text-gray-400"></i>
              <p className="text-xl font-bold text-gray-500">{traductions[langue].panierVide}</p>
            </div>
          ) : (
            panier.map((item) => (
              <div key={item.id} className="flex gap-4 bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <img src={item.image} alt={item.nom} className="w-20 h-20 rounded-xl object-cover" />
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-2 pr-2">{item.nom}</h4>
                    <button onClick={() => supprimerDuPanier(item.id)} className="text-red-500 hover:text-red-700 transition-colors p-1"><i className="fa-solid fa-trash"></i></button>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <p className="font-black text-[#10b981]">{item.prix} €</p>
                    <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
                      <button onClick={() => diminuerQuantite(item.id)} className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-colors">-</button>
                      <span className="font-bold text-gray-900 dark:text-white min-w-[20px] text-center">{item.quantite}</span>
                      <button onClick={() => ajouterAuPanier(item)} className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-colors">+</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shrink-0">
          <div className="flex justify-between items-center mb-6 text-xl text-gray-900 dark:text-white">
            <span className="font-bold">{traductions[langue].total}</span>
            <span className="font-black text-[#1e3a8a] dark:text-[#10b981]">{total} €</span>
          </div>
          <button 
            onClick={passerCommande} 
            disabled={panier.length === 0} 
            className={`w-full h-14 rounded-2xl font-bold text-lg flex justify-center items-center gap-3 transition-all ${panier.length === 0 ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-[#f59e0b] hover:bg-amber-600 text-white shadow-lg active:scale-95 cursor-pointer'}`}
          >
            {traductions[langue].commander} <i className="fa-solid fa-credit-card"></i>
          </button>
        </div>
      </div>
    </div>
  );
}