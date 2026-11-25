import { Link } from 'react-router-dom';
import { useReadingList } from '../context/ReadingListContext.jsx';

const NAVY_HEADERS = [
  'bg-[#001B5E]',
  'bg-[#00247D]',
  'bg-[#0A2540]',
];

export default function BookCard({ book }) {
  const { addBook, removeBook, isInReadingList } = useReadingList();
  const headerClass =
    NAVY_HEADERS[Number(book.id || 0) % NAVY_HEADERS.length];
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
    <article className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div
        className={`relative flex h-32 flex-col justify-between ${headerClass} p-4 text-white`}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-white/10 px-3 py-0.5 text-[11px] font-semibold tracking-wide text-[#D9A528]">
            {genreName}
          </span>
          <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-medium text-white">
            {availableCopies > 0
              ? `${availableCopies} available`
              : 'Checked out'}
          </span>
        </div>

        <p className="font-mono text-[11px] text-slate-300">ISBN {book.isbn}</p>
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <h3 className="line-clamp-2 text-base font-bold leading-snug text-slate-900 transition-colors group-hover:text-[#001B5E]">
            {book.title}
          </h3>
          <p className="mt-1.5 text-xs font-normal text-slate-600">
            by <span className="font-medium text-slate-800">{book.author}</span>
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between gap-2 border-t border-slate-100 pt-3.5">
          <button
            type="button"
            onClick={handleToggleList}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              saved
                ? 'bg-[#D9A528] text-[#001B5E] hover:bg-[#c6931f]'
                : 'border border-slate-300 bg-white text-slate-700 hover:border-[#001B5E] hover:text-[#001B5E]'
            }`}
          >
            {saved ? 'In Reading List' : 'Add to List'}
          </button>

          <Link
            to={`/books/${book.id}`}
            className="rounded-lg bg-[#001B5E] px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-[#002885]"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}