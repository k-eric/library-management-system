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
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-purple-700 p-8 text-white shadow-sm">
        <div>
          <span className="inline-block rounded-full bg-purple-950/50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-purple-100">
            Patron Borrow Queue
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">
            My Reading List
          </h1>
          <p className="mt-1.5 text-base font-normal text-purple-100">
            Review selected titles and submit a borrow request when ready.
          </p>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={clearList}
            className="rounded-xl bg-purple-900 px-4 py-2.5 text-sm font-semibold text-purple-100 transition hover:bg-purple-950"
          >
            Clear List
          </button>
        )}
      </section>

      {statusMessage && (
        <div
          role="status"
          className="rounded-2xl border border-purple-300 bg-purple-50 p-5 text-base font-medium text-purple-950"
        >
          {statusMessage}
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-base font-medium text-rose-800"
        >
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <div className="rounded-2xl border border-purple-200 bg-white p-12 text-center shadow-sm">
          <h2 className="text-xl font-bold text-purple-950">
            Your reading list is empty
          </h2>
          <p className="mt-2 text-base text-slate-600">
            Browse the catalog and add books you want to borrow.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block rounded-xl bg-purple-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-800"
          >
            Browse Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="divide-y divide-purple-100 overflow-hidden rounded-2xl border border-purple-200 bg-white shadow-sm">
            {items.map((book) => (
              <div
                key={book.id}
                className="flex flex-wrap items-center justify-between gap-4 p-6"
              >
                <div>
                  <Link
                    to={`/books/${book.id}`}
                    className="text-lg font-bold text-slate-900 transition hover:text-purple-700"
                  >
                    {book.title}
                  </Link>
                  <p className="mt-1 text-sm text-slate-600">
                    by <span className="font-medium text-slate-800">{book.author}</span>
                    {book.isbn ? ` — ISBN ${book.isbn}` : ''}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => removeBook(book.id)}
                  className="rounded-xl border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-900 transition hover:bg-purple-200"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-purple-200 bg-white p-6 shadow-sm">
            <span className="text-base font-semibold text-slate-800">
              {items.length} {items.length === 1 ? 'book' : 'books'} ready to borrow
            </span>
            <button
              type="button"
              disabled={submitting}
              onClick={handleBorrowSubmit}
              className="rounded-xl bg-purple-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-800 disabled:bg-purple-400"
            >
              {submitting ? 'Submitting Request...' : 'Submit Borrow Request'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}