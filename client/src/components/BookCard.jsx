import { Link } from 'react-router-dom';
import { useReadingList } from '../context/ReadingListContext.jsx';

const PURPLE_HEADERS = [
  'bg-purple-700',
  'bg-purple-800',
  'bg-purple-600',
];

export default function BookCard({ book }) {
  const { addBook, removeBook, isInReadingList } = useReadingList();
  const headerClass =
    PURPLE_HEADERS[Number(book.id || 0) % PURPLE_HEADERS.length];
  const genreName = book.genre?.name || 'General Collection';
  const availableCopies =
    typeof book.availableCopies === 'number'
      ? book.availableCopies
      : book.totalCopies;
  const saved = isInReadingList(book.id);

  const handleToggleList = () => {
    if (saved) {
      removeBook(book.id);
    } else {
      addBook(book);
    }
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-purple-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <div
        className={`relative flex h-36 flex-col justify-between ${headerClass} p-5 text-white`}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-purple-950/50 px-3.5 py-1 text-xs font-semibold tracking-wide text-purple-100">
            {genreName}
          </span>
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
            {availableCopies > 0
              ? `${availableCopies} available`
              : 'Checked out'}
          </span>
        </div>

        <p className="font-mono text-xs text-purple-100">ISBN {book.isbn}</p>
      </div>

      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <h3 className="line-clamp-2 text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-purple-700">
            {book.title}
          </h3>
          <p className="mt-2 text-base font-normal text-slate-600">
            by <span className="font-medium text-slate-800">{book.author}</span>
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between gap-2 border-t border-purple-100 pt-4">
          <button
            type="button"
            onClick={handleToggleList}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
              saved
                ? 'bg-purple-700 text-white hover:bg-purple-800'
                : 'border border-purple-200 bg-purple-50 text-purple-900 hover:bg-purple-100'
            }`}
          >
            {saved ? 'In Reading List' : 'Add to List'}
          </button>

          <Link
            to={`/books/${book.id}`}
            className="rounded-xl bg-purple-100 px-4 py-2 text-xs font-semibold text-purple-900 transition hover:bg-purple-700 hover:text-white"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}