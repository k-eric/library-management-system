import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import BookDetail from './pages/BookDetail.jsx';

export default function App() {
  return (
    <div className="min-h-screen bg-purple-50/60 text-base text-slate-900">
      <header className="sticky top-0 z-20 border-b border-purple-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="group flex items-center gap-3">
            <span className="h-10 w-10 rounded-xl bg-purple-700 transition-colors group-hover:bg-purple-800" />
            <div>
              <span className="block font-['Plus_Jakarta_Sans'] text-xl font-bold tracking-tight text-purple-950">
                PrismLibrary Catalog
              </span>
              <span className="block text-sm font-normal text-purple-700">
                Discover, Filter &amp; Explore
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-3 text-base font-medium">
            <Link
              to="/"
              className="rounded-xl bg-purple-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-800"
            >
              Catalog
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/books/:id" element={<BookDetail />} />
        </Routes>
      </main>
    </div>
  );
}