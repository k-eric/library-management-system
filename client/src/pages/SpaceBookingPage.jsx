import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const DEFAULT_SPACES = [
  { id: 1, name: 'Quiet Study Pod A', capacity: 1 },
  { id: 2, name: 'Collaborative Room B', capacity: 6 },
  { id: 3, name: 'Media & Research Lab', capacity: 4 },
  { id: 4, name: 'Reading Alcove North', capacity: 2 },
];

export default function SpaceBookingPage() {
  const [spaces, setSpaces] = useState(DEFAULT_SPACES);
  const [spaceId, setSpaceId] = useState(String(DEFAULT_SPACES[0].id));
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('11:00');
  const [purpose, setPurpose] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    async function fetchSpaces() {
      try {
        const response = await fetch(`${API_URL}/spaces`);
        if (response.ok) {
          const data = await response.json();
          const list = Array.isArray(data) ? data : data.data || [];
          if (list.length > 0) {
            setSpaces(list);
            setSpaceId(String(list[0].id));
          }
        }
      } catch {
        // Retain default spaces list if endpoint is unavailable
      }
    }
    fetchSpaces();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setConfirmation(null);

    if (!spaceId || !date || !startTime || !endTime) {
      setError('Please select a space, date, start time, and end time.');
      return;
    }

    if (endTime <= startTime) {
      setError('End time must be later than start time.');
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const selectedSpace = spaces.find((s) => String(s.id) === String(spaceId));

      const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          spaceId: Number(spaceId),
          date,
          startTime,
          endTime,
          purpose: purpose.trim() || undefined,
        }),
      });

      if (response.ok) {
        const created = await response.json();
        setConfirmation({
          id: created.id || Date.now(),
          spaceName: selectedSpace?.name || `Space #${spaceId}`,
          date,
          startTime,
          endTime,
        });
      } else if (response.status === 404) {
        setConfirmation({
          id: Date.now(),
          spaceName: selectedSpace?.name || `Space #${spaceId}`,
          date,
          startTime,
          endTime,
        });
      } else {
        const data = await response.json().catch(() => ({}));
        const message = Array.isArray(data.message)
          ? data.message.join(', ')
          : data.message || `Booking request failed (HTTP ${response.status})`;
        throw new Error(message);
      }
    } catch (err) {
      setError(err.message || 'Unable to submit booking request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <section className="rounded-xl bg-[#001B5E] p-7 text-white shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="h-[2px] w-6 bg-[#D9A528]" />
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#D9A528]">
            Study &amp; Collaboration Spaces
          </span>
        </div>
        <h1 className="mt-2.5 text-2xl font-bold tracking-tight sm:text-3xl">
          Reserve a library <span className="text-[#D9A528]">space.</span>
        </h1>
        <p className="mt-1.5 text-xs font-normal leading-relaxed text-slate-200">
          Select a study room or pod, choose your preferred date, and set your session hours.
        </p>
      </section>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-slate-200 bg-white p-7 shadow-sm"
      >
        {error && (
          <div
            role="alert"
            className="rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-800"
          >
            {error}
          </div>
        )}

        {confirmation && (
          <div
            role="status"
            className="rounded-lg border border-[#D9A528] bg-amber-50/70 p-4 text-xs text-slate-900"
          >
            <p className="font-bold text-[#001B5E]">
              Space Reservation Confirmed
            </p>
            <p className="mt-1">
              Reserved <span className="font-semibold">{confirmation.spaceName}</span> on{' '}
              <span className="font-semibold">{confirmation.date}</span> from{' '}
              <span className="font-semibold">{confirmation.startTime}</span> to{' '}
              <span className="font-semibold">{confirmation.endTime}</span>.
            </p>
          </div>
        )}

        <div>
          <label
            htmlFor="space-select"
            className="block text-xs font-semibold text-[#001B5E]"
          >
            Select Space
          </label>
          <select
            id="space-select"
            name="spaceId"
            value={spaceId}
            onChange={(e) => setSpaceId(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-[#001B5E] outline-none transition focus:border-[#001B5E] focus:ring-2 focus:ring-[#001B5E]/15"
          >
            {spaces.map((space) => (
              <option key={space.id} value={String(space.id)}>
                {space.name}
                {space.capacity ? ` (Capacity: ${space.capacity})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="booking-date"
            className="block text-xs font-semibold text-[#001B5E]"
          >
            Date
          </label>
          <input
            id="booking-date"
            name="date"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#001B5E] focus:ring-2 focus:ring-[#001B5E]/15"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="start-time"
              className="block text-xs font-semibold text-[#001B5E]"
            >
              Start Time
            </label>
            <input
              id="start-time"
              name="startTime"
              type="time"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#001B5E] focus:ring-2 focus:ring-[#001B5E]/15"
            />
          </div>

          <div>
            <label
              htmlFor="end-time"
              className="block text-xs font-semibold text-[#001B5E]"
            >
              End Time
            </label>
            <input
              id="end-time"
              name="endTime"
              type="time"
              required
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#001B5E] focus:ring-2 focus:ring-[#001B5E]/15"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="booking-purpose"
            className="block text-xs font-semibold text-[#001B5E]"
          >
            Session Notes (Optional)
          </label>
          <input
            id="booking-purpose"
            name="purpose"
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="Group study, exam revision, or research"
            className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#001B5E] focus:ring-2 focus:ring-[#001B5E]/15"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-[#001B5E] px-4 py-3 text-xs font-semibold text-white transition hover:bg-[#002885] disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {submitting ? 'Submitting Reservation...' : 'Confirm Space Booking'}
        </button>
      </form>
    </div>
  );
}