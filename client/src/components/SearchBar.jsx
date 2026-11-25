import { useState, useEffect } from 'react';

export default function SearchBar({ onSearch, initialValue = '' }) {
  const [query, setQuery] = useState(initialValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
        <svg
          className="h-4 w-4 text-[#001B5E]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
          />
        </svg>
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search books by title or author..."
        aria-label="Search books by title or author"
        className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-20 text-sm font-normal text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#001B5E] focus:ring-2 focus:ring-[#001B5E]/15"
      />

      {query && (
        <button
          type="button"
          onClick={() => setQuery('')}
          className="absolute inset-y-1.5 right-1.5 rounded-md bg-slate-100 px-3 text-xs font-semibold text-[#001B5E] transition hover:bg-slate-200"
        >
          Clear
        </button>
      )}
    </div>
  );
}