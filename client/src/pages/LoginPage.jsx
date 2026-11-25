import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const message = Array.isArray(data.message)
          ? data.message.join(', ')
          : data.message || 'Invalid email or password.';
        throw new Error(message);
      }

      const token = data.access_token || data.token || data.accessToken;
      if (!token) {
        throw new Error('Authentication succeeded, but no token was returned.');
      }

      localStorage.setItem('token', token);
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to sign in.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="rounded-2xl bg-purple-700 p-7 text-white shadow-sm">
        <span className="inline-block rounded-full bg-purple-950/50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-purple-100">
          Member Access
        </span>
        <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
          Sign In to Your Account
        </h1>
        <p className="mt-1.5 text-sm font-normal text-purple-100">
          Access your reading list, submit borrow requests, and reserve library spaces.
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
            htmlFor="login-email"
            className="block text-sm font-semibold text-purple-950"
          >
            Email Address
          </label>
          <input
            id="login-email"
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
            htmlFor="login-password"
            className="block text-sm font-semibold text-purple-950"
          >
            Password
          </label>
          <input
            id="login-password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="mt-1.5 w-full rounded-xl border border-purple-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-purple-700 focus:ring-2 focus:ring-purple-700/20"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-purple-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:bg-purple-400"
        >
          {submitting ? 'Signing In...' : 'Sign In'}
        </button>

        <p className="border-t border-purple-100 pt-4 text-center text-sm text-slate-600">
          New to the library?{' '}
          <Link
            to="/register"
            className="font-semibold text-purple-700 hover:text-purple-950"
          >
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}