import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthCard from '../components/AuthCard';
import FormField from '../components/FormField';

export default function Register() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
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
    if (!form.name.trim()) errors.name = 'Name is required';
    if (!form.email.trim()) errors.email = 'Email is required';
    // Mirrors the backend's own rule (src/models/User.js: minlength 6) so the
    // person gets the feedback before the request round-trip, not after.
    if (form.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (form.confirmPassword !== form.password) errors.confirmPassword = 'Passwords do not match';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      navigate('/', { replace: true });
    } catch (err) {
      setFormError(err.message || 'Unable to create your account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <AuthCard title="Create your account" subtitle="Save favorite cities and get AI-powered weather insights.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-space-md" noValidate>
        <FormField
          id="name"
          label="Name"
          icon="person"
          value={form.name}
          onChange={handleChange}
          error={fieldErrors.name}
          autoComplete="name"
          placeholder="Alex Kumar"
        />
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
          autoComplete="new-password"
          placeholder="At least 6 characters"
        />
        <FormField
          id="confirmPassword"
          label="Confirm password"
          type="password"
          icon="lock"
          value={form.confirmPassword}
          onChange={handleChange}
          error={fieldErrors.confirmPassword}
          autoComplete="new-password"
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
          {submitting ? 'Creating account…' : 'Sign up'}
        </button>

        <p className="font-body-sm text-body-sm text-on-surface-variant text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
