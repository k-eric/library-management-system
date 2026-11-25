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
    <div className="mx-auto max-w-md space-y-5">
      <div className="rounded-xl bg-[#001B5E] p-7 text-white shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="h-[2px] w-5 bg-[#D9A528]" />
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#D9A528]">
            Patron Registration
          </span>
        </div>
        <h1 className="mt-2.5 text-2xl font-bold tracking-tight">
          Create your <span className="text-[#D9A528]">account.</span>
        </h1>
        <p className="mt-1.5 text-xs font-normal leading-relaxed text-slate-200">
          Register to build your reading list, request books, and book study rooms.
        </p>
      </div>

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

        <div>
          <label
            htmlFor="register-name"
            className="block text-xs font-semibold text-[#001B5E]"
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
            className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#001B5E] focus:ring-2 focus:ring-[#001B5E]/15"
          />
        </div>

        <div>
          <label
            htmlFor="register-email"
            className="block text-xs font-semibold text-[#001B5E]"
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
            className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#001B5E] focus:ring-2 focus:ring-[#001B5E]/15"
          />
        </div>

        <div>
          <label
            htmlFor="register-password"
            className="block text-xs font-semibold text-[#001B5E]"
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
            className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#001B5E] focus:ring-2 focus:ring-[#001B5E]/15"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-[#001B5E] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#002885] disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {submitting ? 'Creating Account...' : 'Create Account'}
        </button>

        <p className="border-t border-slate-100 pt-3.5 text-center text-xs text-slate-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-[#001B5E] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}