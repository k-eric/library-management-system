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
    <div className="space-y-8">
      <section className="overflow-hidden rounded-2xl bg-purple-700 p-8 text-white shadow-sm sm:p-10">
        <span className="inline-block rounded-full bg-purple-950/50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-purple-100">
          Public Patron Catalog
        </span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Explore Our Library Collection
        </h1>
        <p className="mt-2.5 max-w-2xl text-base font-normal leading-relaxed text-purple-100">
          Browse titles across every genre, search by author or book title in real time, and check live copy availability.
        </p>
      </section>

      <section className="space-y-4 rounded-2xl border border-purple-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex-1">
            <SearchBar onSearch={handleSearch} />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="sr-only" htmlFor="genre-select">
              Filter by Genre
            </label>
            <select
              id="genre-select"
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="rounded-xl border border-purple-300 bg-purple-50 px-4 py-3 text-sm font-semibold text-purple-950 outline-none transition focus:border-purple-700"
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
              className="rounded-xl border border-purple-300 bg-purple-50 px-4 py-3 text-sm font-semibold text-purple-950 outline-none transition focus:border-purple-700"
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
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                selectedGenre === ''
                  ? 'bg-purple-700 text-white'
                  : 'bg-purple-100 text-purple-900 hover:bg-purple-200'
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
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                    active
                      ? 'bg-purple-700 text-white'
                      : 'bg-purple-50 text-purple-900 hover:bg-purple-100'
                  }`}
                >
                  {genre.name}
                </button>
              );
            })}
          </div>
        )}

        {hasActiveFilters && (
          <div className="flex items-center justify-between border-t border-purple-100 pt-3 text-sm">
            <span className="font-medium text-slate-600">
              Active filters applied
            </span>
            <button
              type="button"
              onClick={() => {
                setSelectedGenre('');
                setSearchTerm('');
              }}
              className="font-semibold text-purple-700 hover:text-purple-950"
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