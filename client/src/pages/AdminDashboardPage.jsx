import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const BORROW_STATUSES = ['PENDING', 'APPROVED', 'RETURNED', 'REJECTED'];

export default function AdminDashboardPage() {
  const [borrowRequests, setBorrowRequests] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionNotice, setActionNotice] = useState('');
  const [updatingId, setUpdatingId] = useState('');

  const loadAdminData = useCallback(async () => {
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    try {
      const [borrowRes, bookingRes] = await Promise.all([
        fetch(`${API_URL}/borrow-requests`, { headers }),
        fetch(`${API_URL}/bookings`, { headers }),
      ]);

      if (borrowRes.status === 403 || bookingRes.status === 403) {
        throw new Error(
          'Librarian role required to view admin borrow requests and bookings.',
        );
      }

      if (!borrowRes.ok || !bookingRes.ok) {
        throw new Error('Could not load admin records from the server.');
      }

      const borrowData = await borrowRes.json();
      const bookingData = await bookingRes.json();

      setBorrowRequests(
        Array.isArray(borrowData) ? borrowData : borrowData.data || [],
      );
      setBookings(
        Array.isArray(bookingData) ? bookingData : bookingData.data || [],
      );
    } catch (err) {
      setError(err.message || 'Failed to load admin dashboard.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  const handleStatusUpdate = async (requestId, nextStatus) => {
    setUpdatingId(requestId);
    setActionNotice('');
    setError('');

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API_URL}/borrow-requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const msg = Array.isArray(data.message)
          ? data.message.join(', ')
          : data.message || `Status update failed (HTTP ${response.status})`;
        throw new Error(msg);
      }

      setBorrowRequests((prev) =>
        prev.map((item) => (item.id === requestId ? data : item)),
      );

      const fineText =
        typeof data.fineAmount === 'number' && data.fineAmount > 0
          ? ` Fine calculated: $${data.fineAmount.toFixed(2)}.`
          : '';
      setActionNotice(
        `Updated request ${requestId.slice(0, 8)} to ${nextStatus}.${fineText}`,
      );
    } catch (err) {
      setError(err.message || 'Unable to update borrow request status.');
    } finally {
      setUpdatingId('');
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-[#001B5E] p-7 text-white shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="h-[2px] w-6 bg-[#D9A528]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#D9A528]">
              Librarian Operations
            </span>
          </div>
          <h1 className="mt-2.5 text-2xl font-bold tracking-tight sm:text-3xl">
            Admin <span className="text-[#D9A528]">management.</span>
          </h1>
          <p className="mt-1 text-xs font-normal text-slate-200">
            Review patron borrow requests, process returns with late fine calculation, and inspect space bookings.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadAdminData}
            className="rounded-lg border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
          >
            Refresh Records
          </button>
          <Link
            to="/"
            className="rounded-lg bg-[#D9A528] px-4 py-2 text-xs font-bold text-[#001B5E] transition hover:bg-[#c6931f]"
          >
            Catalog View
          </Link>
        </div>
      </section>

      {actionNotice && (
        <div
          role="status"
          className="rounded-xl border border-[#D9A528] bg-amber-50/70 px-4 py-3 text-xs font-semibold text-[#001B5E]"
        >
          {actionNotice}
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-800"
        >
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600 shadow-sm">
          Loading borrow requests and bookings...
        </div>
      ) : (
        <>
          <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#001B5E]">
                Borrow Requests ({borrowRequests.length})
              </h2>
            </div>

            {borrowRequests.length === 0 ? (
              <p className="py-4 text-xs text-slate-600">
                No borrow requests recorded yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-[#001B5E]">
                      <th className="py-2.5 pr-4">Book</th>
                      <th className="py-2.5 pr-4">Patron</th>
                      <th className="py-2.5 pr-4">Status</th>
                      <th className="py-2.5 pr-4">Fine</th>
                      <th className="py-2.5">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {borrowRequests.map((req) => (
                      <tr key={req.id} className="align-middle">
                        <td className="py-3 pr-4 font-semibold text-slate-900">
                          {req.book?.title || req.bookId}
                        </td>
                        <td className="py-3 pr-4 text-slate-600">
                          {req.user?.email || req.user?.name || req.userId}
                        </td>
                        <td className="py-3 pr-4">
                          <span className="rounded-full bg-[#001B5E]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#001B5E]">
                            {req.status}
                          </span>
                        </td>
                        <td className="py-3 pr-4 font-mono text-xs font-semibold text-slate-800">
                          ${Number(req.fineAmount || 0).toFixed(2)}
                        </td>
                        <td className="py-3">
                          <select
                            aria-label={`Status for ${req.book?.title || req.id}`}
                            disabled={updatingId === req.id}
                            value={req.status}
                            onChange={(e) =>
                              handleStatusUpdate(req.id, e.target.value)
                            }
                            className="rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-[#001B5E] outline-none focus:border-[#001B5E]"
                          >
                            {BORROW_STATUSES.map((statusOption) => (
                              <option key={statusOption} value={statusOption}>
                                {statusOption}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-[#001B5E]">
              Space Bookings ({bookings.length})
            </h2>

            {bookings.length === 0 ? (
              <p className="py-4 text-xs text-slate-600">
                No space bookings recorded yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-[#001B5E]">
                      <th className="py-2.5 pr-4">Space</th>
                      <th className="py-2.5 pr-4">Patron</th>
                      <th className="py-2.5 pr-4">Date</th>
                      <th className="py-2.5 pr-4">Time Window</th>
                      <th className="py-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="align-middle">
                        <td className="py-3 pr-4 font-semibold text-slate-900">
                          {booking.space?.name || booking.spaceId}
                        </td>
                        <td className="py-3 pr-4 text-slate-600">
                          {booking.user?.email || booking.user?.name || booking.userId}
                        </td>
                        <td className="py-3 pr-4 text-slate-700">
                          {booking.date
                            ? new Date(booking.date).toLocaleDateString()
                            : '-'}
                        </td>
                        <td className="py-3 pr-4 font-mono text-[11px] text-slate-700">
                          {booking.startTime
                            ? new Date(booking.startTime).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : ''}{' '}
                          -{' '}
                          {booking.endTime
                            ? new Date(booking.endTime).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : ''}
                        </td>
                        <td className="py-3">
                          <span className="rounded-full bg-[#D9A528]/20 px-2.5 py-0.5 text-[11px] font-bold text-[#001B5E]">
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}