import { useState, useEffect, useMemo } from 'react';
import BookCard from './BookCard.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function BookGrid({ genreId = '', search = '', sortBy = 'title-asc' }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function fetchBooks() {
      setLoading(true);
      setError('');

      try {
        const params = new URLSearchParams();
        if (genreId) params.set('genreId', genreId);
        if (search) params.set('search', search);

        const queryString = params.toString();
        const url = `${API_URL}/books${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Failed to fetch books (HTTP ${response.status})`);
        }

        const payload = await response.json();
        const list = Array.isArray(payload) ? payload : payload.data || [];
        setBooks(list);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to load books from the server.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchBooks();
    return () => controller.abort();
  }, [genreId, search]);

  const sortedBooks = useMemo(() => {
    const copy = [...books];
    copy.sort((a, b) => {
      if (sortBy === 'title-desc') {
        return (b.title || '').localeCompare(a.title || '');
      }
      if (sortBy === 'author-asc') {
        return (a.author || '').localeCompare(b.author || '');
      }
      if (sortBy === 'author-desc') {
        return (b.author || '').localeCompare(a.author || '');
      }
      return (a.title || '').localeCompare(b.title || '');
    });
    return copy;
  }, [books, sortBy]);

  if (loading) {
    return (
      <div
        aria-label="Loading books"
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="h-32 bg-slate-200" />
            <div className="space-y-3 p-5">
              <div className="h-4 w-3/4 rounded bg-slate-200" />
              <div className="h-3.5 w-1/2 rounded bg-slate-200" />
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3.5">
                <div className="h-4 w-20 rounded bg-slate-200" />
                <div className="h-8 w-24 rounded-lg bg-slate-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="rounded-xl border border-rose-200 bg-rose-50 p-7 text-center shadow-sm"
      >
        <h2 className="text-base font-bold text-rose-900">
          Could not load catalog
        </h2>
        <p className="mt-1.5 text-sm font-normal text-rose-800">{error}</p>
        <p className="mt-1.5 text-xs text-rose-700">
          Verify your NestJS server is running at {API_URL}.
        </p>
      </div>
    );
  }

  if (sortedBooks.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h2 className="text-base font-bold text-[#001B5E]">
          No matching books found
        </h2>
        <p className="mt-1.5 text-sm font-normal text-slate-600">
          Try clearing your search term or selecting a different genre filter.
        </p>
      </div>
    );
  }

  return (
    <section aria-label="Book catalog results">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-700">
          Showing{' '}
          <span className="rounded bg-[#001B5E] px-2 py-0.5 text-xs font-bold text-[#D9A528]">
            {sortedBooks.length}
          </span>{' '}
          {sortedBooks.length === 1 ? 'book' : 'books'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {sortedBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
}