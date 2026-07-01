export default function Hero({ langue, traductions }) {
  return (
    <header id="accueil" className="relative w-full h-[60vh] flex flex-col justify-center items-center text-center text-white px-4 shrink-0">
      <div className="absolute inset-0 bg-black/60 z-0"></div>
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center mix-blend-overlay z-0"></div>
      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight drop-shadow-lg">{traductions[langue].titreHero}</h1>
        <p className="text-lg md:text-2xl font-medium drop-shadow-md text-gray-200">{traductions[langue].descHero}</p>
      </div>
    </header>
  );
}