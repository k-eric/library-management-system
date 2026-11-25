import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useReadingList } from '../context/ReadingListContext.jsx';

export default function Navbar() {
  const { count } = useReadingList();
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navLinkClass = (path) =>
    `rounded-xl px-4 py-2 text-sm font-semibold transition ${
      location.pathname === path
        ? 'bg-purple-700 text-white'
        : 'text-purple-900 hover:bg-purple-100'
    }`;

  return (
    <header className="sticky top-0 z-20 border-b border-purple-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link to="/" className="group flex items-center gap-3">
          <span className="h-10 w-10 rounded-xl bg-purple-700 transition-colors group-hover:bg-purple-800" />
          <div>
            <span className="block font-['Plus_Jakarta_Sans'] text-xl font-bold tracking-tight text-purple-950">
              PrismLibrary Catalog
            </span>
            <span className="block text-sm font-normal text-purple-700">
              Discover, Borrow &amp; Reserve
            </span>
          </div>
        </Link>

        <nav
          aria-label="Primary Navigation"
          className="flex flex-wrap items-center gap-2"
        >
          <Link to="/" className={navLinkClass('/')}>
            Catalog
          </Link>

          <Link to="/reading-list" className={navLinkClass('/reading-list')}>
            <span>Reading List</span>
            <span
              aria-label="Reading list count"
              className={`ml-2 inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                location.pathname === '/reading-list'
                  ? 'bg-white text-purple-800'
                  : 'bg-purple-700 text-white'
              }`}
            >
              {count}
            </span>
          </Link>

          <Link to="/spaces/book" className={navLinkClass('/spaces/book')}>
            Book a Space
          </Link>

          {token ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-purple-300 bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-900 transition hover:bg-purple-200"
            >
              Sign Out
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className={navLinkClass('/login')}>
                Sign In
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-purple-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-800"
              >
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}