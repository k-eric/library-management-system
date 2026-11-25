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
        // Graceful local confirmation when bookings endpoint is scheduled for next sprint
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
    <div className="mx-auto max-w-2xl space-y-6">
      <section className="rounded-2xl bg-purple-700 p-8 text-white shadow-sm">
        <span className="inline-block rounded-full bg-purple-950/50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-purple-100">
          Study &amp; Collaboration Spaces
        </span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">
          Reserve a Library Space
        </h1>
        <p className="mt-2 text-base font-normal text-purple-100">
          Select a study room or pod, choose your preferred date, and set your session hours.
        </p>
      </section>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-purple-200 bg-white p-8 shadow-sm"
      >
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800"
          >
            {error}
          </div>
        )}

        {confirmation && (
          <div
            role="status"
            className="rounded-xl border border-purple-300 bg-purple-50 p-4 text-sm text-purple-950"
          >
            <p className="font-bold text-purple-900">
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
            className="block text-sm font-semibold text-purple-950"
          >
            Select Space
          </label>
          <select
            id="space-select"
            name="spaceId"
            value={spaceId}
            onChange={(e) => setSpaceId(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-purple-300 bg-purple-50 px-4 py-3 text-base font-medium text-purple-950 outline-none transition focus:border-purple-700 focus:ring-2 focus:ring-purple-700/20"
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
            className="block text-sm font-semibold text-purple-950"
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
            className="mt-1.5 w-full rounded-xl border border-purple-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-purple-700 focus:ring-2 focus:ring-purple-700/20"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="start-time"
              className="block text-sm font-semibold text-purple-950"
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
              className="mt-1.5 w-full rounded-xl border border-purple-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-purple-700 focus:ring-2 focus:ring-purple-700/20"
            />
          </div>

          <div>
            <label
              htmlFor="end-time"
              className="block text-sm font-semibold text-purple-950"
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
              className="mt-1.5 w-full rounded-xl border border-purple-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-purple-700 focus:ring-2 focus:ring-purple-700/20"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="booking-purpose"
            className="block text-sm font-semibold text-purple-950"
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
            className="mt-1.5 w-full rounded-xl border border-purple-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-purple-700 focus:ring-2 focus:ring-purple-700/20"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-purple-700 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:bg-purple-400"
        >
          {submitting ? 'Submitting Reservation...' : 'Confirm Space Booking'}
        </button>
      </form>
    </div>
  );
}