export default function Footer({ langue, traductions }) {
  return (
    <footer className="bg-[#1e3a8a] dark:bg-gray-950 text-white py-8 text-center text-sm font-medium shrink-0">
      <p>&copy; 2026 ZAID SHOP. {traductions[langue].droits}</p>
    </footer>
  );
}