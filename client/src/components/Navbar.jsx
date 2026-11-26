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
    `rounded-lg px-3.5 py-2 text-xs font-semibold tracking-wide transition ${
      location.pathname === path
        ? 'bg-[#001B5E] text-white'
        : 'text-slate-700 hover:bg-slate-100 hover:text-[#001B5E]'
    }`;

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <Link to="/" className="group flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#001B5E] transition-colors group-hover:bg-[#002885]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#D9A528]" />
          </span>
          <div>
            <span className="block text-base font-bold tracking-tight text-[#001B5E]">
              PrismLibrary Catalog
            </span>
            <span className="block text-xs font-normal text-slate-500">
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

          <Link to="/admin" className={navLinkClass('/admin')}>
            Admin
          </Link>
          
          <Link to="/reading-list" className={navLinkClass('/reading-list')}>
            <span>Reading List</span>
            <span
              aria-label="Reading list count"
              className={`ml-2 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[11px] font-bold ${
                location.pathname === '/reading-list'
                  ? 'bg-[#D9A528] text-[#001B5E]'
                  : 'bg-[#001B5E] text-[#D9A528]'
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
              className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:border-[#001B5E] hover:text-[#001B5E]"
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
                className="rounded-lg bg-[#001B5E] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#002885]"
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