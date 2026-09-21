import { useState } from 'react';
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthCard from '../components/AuthCard';
import FormField from '../components/FormField';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const errors = {};
    if (!form.email.trim()) errors.email = 'Email is required';
    if (!form.password) errors.password = 'Password is required';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      await login(form);
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setFormError(err.message || 'Unable to log in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <AuthCard title="Welcome back" subtitle="Log in to view your saved cities and AI insights.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-space-md" noValidate>
        <FormField
          id="email"
          label="Email"
          type="email"
          icon="mail"
          value={form.email}
          onChange={handleChange}
          error={fieldErrors.email}
          autoComplete="email"
          placeholder="you@example.com"
        />
        <FormField
          id="password"
          label="Password"
          type="password"
          icon="lock"
          value={form.password}
          onChange={handleChange}
          error={fieldErrors.password}
          autoComplete="current-password"
          placeholder="••••••••"
        />

        {formError && (
          <div className="px-space-md py-space-sm rounded-xl bg-error-container/80 text-on-error-container font-label-md text-label-md">
            {formError}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="flex items-center justify-center gap-space-xs py-space-sm px-space-lg rounded-full bg-primary-container text-on-primary-container font-label-lg text-label-lg font-bold shadow-[0_4px_20px_rgba(56,189,248,0.35)] hover:bg-primary transition-all active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
        >
          {submitting && (
            <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
          )}
          {submitting ? 'Logging in…' : 'Log in'}
        </button>

        <p className="font-body-sm text-body-sm text-on-surface-variant text-center">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
