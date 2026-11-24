import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function fetchBookDetail() {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`${API_URL}/books/${id}`, {
          signal: controller.signal,
        });

        if (response.status === 404) {
          throw new Error('This book could not be found in the catalog.');
        }
        if (!response.ok) {
          throw new Error(`Failed to load book details (HTTP ${response.status})`);
        }

        const data = await response.json();
        setBook(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to fetch book details.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchBookDetail();
    return () => controller.abort();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl animate-pulse space-y-6">
        <div className="h-10 w-40 rounded-xl bg-purple-100" />
        <div className="overflow-hidden rounded-2xl border border-purple-200 bg-white shadow-sm">
          <div className="h-48 bg-purple-200" />
          <div className="space-y-4 p-8">
            <div className="h-8 w-2/3 rounded-lg bg-slate-200" />
            <div className="h-5 w-1/3 rounded-lg bg-slate-200" />
            <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-3">
              <div className="h-24 rounded-xl bg-purple-50" />
              <div className="h-24 rounded-xl bg-purple-50" />
              <div className="h-24 rounded-xl bg-purple-50" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl border border-purple-200 bg-white px-4 py-2.5 text-sm font-semibold text-purple-800 shadow-sm transition hover:bg-purple-50"
        >
          &larr; Back to Catalog
        </Link>

        <div
          role="alert"
          className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center"
        >
          <h1 className="text-xl font-bold text-rose-900">
            Book Unavailable
          </h1>
          <p className="mt-2 text-base font-normal text-rose-800">
            {error || 'No book record returned.'}
          </p>
        </div>
      </div>
    );
  }

  const availableCopies =
    typeof book.availableCopies === 'number'
      ? book.availableCopies
      : book.totalCopies;
  const genreName = book.genre?.name || 'General Collection';

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl border border-purple-200 bg-white px-4 py-2.5 text-sm font-semibold text-purple-800 shadow-sm transition hover:bg-purple-700 hover:text-white"
        >
          &larr; Back to Catalog
        </Link>
      </div>

      <article className="overflow-hidden rounded-2xl border border-purple-200 bg-white shadow-sm">
        <div className="bg-purple-700 p-8 text-white sm:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-purple-950/50 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-purple-100">
              {genreName}
            </span>
            <span className="rounded-full bg-white/15 px-3.5 py-1 text-xs font-semibold text-white">
              {availableCopies > 0
                ? `${availableCopies} of ${book.totalCopies} available`
                : 'All copies checked out'}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {book.title}
          </h1>
          <p className="mt-2 text-lg font-normal text-purple-100">
            Written by <span className="font-semibold text-white">{book.author}</span>
          </p>
        </div>

        <div className="space-y-8 p-8 sm:p-10">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-purple-200 bg-purple-50/70 p-5">
              <span className="block text-xs font-semibold uppercase tracking-wider text-purple-700">
                ISBN Number
              </span>
              <span className="mt-1.5 block font-mono text-base font-bold text-slate-900">
                {book.isbn}
              </span>
            </div>

            <div className="rounded-xl border border-purple-200 bg-purple-50/70 p-5">
              <span className="block text-xs font-semibold uppercase tracking-wider text-purple-700">
                Genre Category
              </span>
              <span className="mt-1.5 block text-base font-bold text-slate-900">
                {genreName}
              </span>
            </div>

            <div className="rounded-xl border border-purple-200 bg-purple-50/70 p-5">
              <span className="block text-xs font-semibold uppercase tracking-wider text-purple-700">
                Inventory Status
              </span>
              <span className="mt-1.5 block text-base font-bold text-slate-900">
                {availableCopies} / {book.totalCopies} Copies
              </span>
            </div>
          </div>

          {book.genre?.description && (
            <div className="rounded-xl border border-purple-100 bg-purple-50/40 p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-purple-900">
                About the {genreName} Section
              </h2>
              <p className="mt-2 text-base leading-relaxed text-slate-700">
                {book.genre.description}
              </p>
            </div>
          )}

          {book.description && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-purple-900">
                Synopsis
              </h2>
              <p className="mt-2 text-base leading-relaxed text-slate-700">
                {book.description}
              </p>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}