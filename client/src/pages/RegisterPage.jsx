import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const message = Array.isArray(data.message)
          ? data.message.join(', ')
          : data.message || 'Could not complete registration.';
        throw new Error(message);
      }

      const token = data.access_token || data.token || data.accessToken;
      if (token) {
        localStorage.setItem('token', token);
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        navigate('/', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Unable to register account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="rounded-2xl bg-purple-700 p-7 text-white shadow-sm">
        <span className="inline-block rounded-full bg-purple-950/50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-purple-100">
          Patron Registration
        </span>
        <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
          Create Your Library Account
        </h1>
        <p className="mt-1.5 text-sm font-normal text-purple-100">
          Register to build your reading list, request books, and book study rooms.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-purple-200 bg-white p-7 shadow-sm"
      >
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800"
          >
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="register-name"
            className="block text-sm font-semibold text-purple-950"
          >
            Full Name
          </label>
          <input
            id="register-name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Alex Morgan"
            className="mt-1.5 w-full rounded-xl border border-purple-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-purple-700 focus:ring-2 focus:ring-purple-700/20"
          />
        </div>

        <div>
          <label
            htmlFor="register-email"
            className="block text-sm font-semibold text-purple-950"
          >
            Email Address
          </label>
          <input
            id="register-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="patron@example.com"
            className="mt-1.5 w-full rounded-xl border border-purple-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-purple-700 focus:ring-2 focus:ring-purple-700/20"
          />
        </div>

        <div>
          <label
            htmlFor="register-password"
            className="block text-sm font-semibold text-purple-950"
          >
            Password
          </label>
          <input
            id="register-password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            className="mt-1.5 w-full rounded-xl border border-purple-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-purple-700 focus:ring-2 focus:ring-purple-700/20"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-purple-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:bg-purple-400"
        >
          {submitting ? 'Creating Account...' : 'Create Account'}
        </button>

        <p className="border-t border-purple-100 pt-4 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-purple-700 hover:text-purple-950"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}