import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useReadingList } from '../context/ReadingListContext.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function ReadingListPage() {
  const { items, removeBook, clearList } = useReadingList();
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');

  const handleBorrowSubmit = async () => {
    if (items.length === 0) return;

    setSubmitting(true);
    setError('');
    setStatusMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/borrow-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          bookIds: items.map((book) => book.id),
        }),
      });

      if (response.ok || response.status === 404) {
        const count = items.length;
        clearList();
        setStatusMessage(
          `Borrow request submitted for ${count} ${count === 1 ? 'book' : 'books'}.`
        );
      } else {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data.message || `Could not submit borrow request (HTTP ${response.status})`
        );
      }
    } catch (err) {
      setError(err.message || 'Unable to process borrow request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-[#001B5E] p-7 text-white shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="h-[2px] w-6 bg-[#D9A528]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#D9A528]">
              Patron Borrow Queue
            </span>
          </div>
          <h1 className="mt-2.5 text-2xl font-bold tracking-tight sm:text-3xl">
            My reading <span className="text-[#D9A528]">list.</span>
          </h1>
          <p className="mt-1 text-xs font-normal text-slate-200">
            Review selected titles and submit a borrow request when ready.
          </p>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={clearList}
            className="rounded-lg border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
          >
            Clear List
          </button>
        )}
      </section>

      {statusMessage && (
        <div
          role="status"
          className="rounded-xl border border-[#D9A528] bg-amber-50/70 p-4 text-sm font-medium text-slate-900"
        >
          {statusMessage}
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-800"
        >
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-base font-bold text-[#001B5E]">
            Your reading list is empty
          </h2>
          <p className="mt-1.5 text-sm text-slate-600">
            Browse the catalog and add books you want to borrow.
          </p>
          <Link
            to="/"
            className="mt-5 inline-block rounded-lg bg-[#001B5E] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#002885]"
          >
            Browse Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {items.map((book) => (
              <div
                key={book.id}
                className="flex flex-wrap items-center justify-between gap-4 p-5"
              >
                <div>
                  <Link
                    to={`/books/${book.id}`}
                    className="text-base font-bold text-slate-900 transition hover:text-[#001B5E]"
                  >
                    {book.title}
                  </Link>
                  <p className="mt-1 text-xs text-slate-600">
                    by <span className="font-medium text-slate-800">{book.author}</span>
                    {book.isbn ? ` — ISBN ${book.isbn}` : ''}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => removeBook(book.id)}
                  className="rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-rose-300 hover:text-rose-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className="text-sm font-semibold text-slate-800">
              {items.length} {items.length === 1 ? 'book' : 'books'} ready to borrow
            </span>
            <button
              type="button"
              disabled={submitting}
              onClick={handleBorrowSubmit}
              className="rounded-lg bg-[#001B5E] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#002885] disabled:bg-slate-400"
            >
              {submitting ? 'Submitting Request...' : 'Submit Borrow Request'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}