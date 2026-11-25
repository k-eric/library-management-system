import { useState, useEffect, useCallback } from 'react';
import SearchBar from '../components/SearchBar.jsx';
import BookGrid from '../components/BookGrid.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function HomePage() {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title-asc');

  useEffect(() => {
    async function loadGenres() {
      try {
        const res = await fetch(`${API_URL}/genres`);
        if (res.ok) {
          const data = await res.json();
          setGenres(Array.isArray(data) ? data : data.data || []);
        }
      } catch {
        // Keep genre list empty if genres endpoint is unreachable
      }
    }
    loadGenres();
  }, []);

  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  const hasActiveFilters = Boolean(selectedGenre || searchTerm);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-xl bg-[#001B5E] px-7 py-9 text-white shadow-sm sm:px-10 sm:py-11">
        <div className="flex items-center gap-3">
          <span className="h-[2px] w-7 bg-[#D9A528]" />
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#D9A528]">
            Public Patron Catalog
          </span>
        </div>

        <h1 className="mt-3 max-w-xl text-2xl font-bold leading-[1.15] tracking-tight text-white sm:text-4xl">
          Explore our library{' '}
          <span className="text-[#D9A528]">collection.</span>
        </h1>

        <p className="mt-3 max-w-xl text-sm font-normal leading-relaxed text-slate-200">
          Browse titles across every genre, search by author or book title in real time, and check live copy availability.
        </p>
      </section>

      <section className="space-y-3.5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex-1">
            <SearchBar onSearch={handleSearch} />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <label className="sr-only" htmlFor="genre-select">
              Filter by Genre
            </label>
            <select
              id="genre-select"
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-[#001B5E] outline-none transition focus:border-[#001B5E]"
            >
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre.id} value={String(genre.id)}>
                  {genre.name}
                </option>
              ))}
            </select>

            <label className="sr-only" htmlFor="sort-select">
              Sort Books
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-[#001B5E] outline-none transition focus:border-[#001B5E]"
            >
              <option value="title-asc">Sort: Title (A-Z)</option>
              <option value="title-desc">Sort: Title (Z-A)</option>
              <option value="author-asc">Sort: Author (A-Z)</option>
              <option value="author-desc">Sort: Author (Z-A)</option>
            </select>
          </div>
        </div>

        {genres.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setSelectedGenre('')}
              className={`rounded-full px-3.5 py-1 text-xs font-semibold transition ${
                selectedGenre === ''
                  ? 'bg-[#001B5E] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            {genres.map((genre) => {
              const active = selectedGenre === String(genre.id);
              return (
                <button
                  key={genre.id}
                  type="button"
                  onClick={() =>
                    setSelectedGenre(active ? '' : String(genre.id))
                  }
                  className={`rounded-full px-3.5 py-1 text-xs font-semibold transition ${
                    active
                      ? 'bg-[#001B5E] text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {genre.name}
                </button>
              );
            })}
          </div>
        )}

        {hasActiveFilters && (
          <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
            <span className="font-medium text-slate-500">
              Active filters applied
            </span>
            <button
              type="button"
              onClick={() => {
                setSelectedGenre('');
                setSearchTerm('');
              }}
              className="font-semibold text-[#001B5E] hover:underline"
            >
              Reset all filters
            </button>
          </div>
        )}
      </section>

      <BookGrid
        genreId={selectedGenre}
        search={searchTerm}
        sortBy={sortBy}
      />
    </div>
  );
}