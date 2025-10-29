import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../assets/css/AuthForms.css';
import { useAuth } from '../contexts/AuthContext';

type LocationState = {
  from?: string;
};

function SignUpPage() {
  const { register, guestLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { from } = (location.state as LocationState) || {};

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [guestSubmitting, setGuestSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setSubmitting(true);
      await register(fullName, email, password);
      navigate(from || '/checkout', { replace: true });
    } catch (err: any) {
      const message =
        err?.response?.data?.message ??
        err?.response?.data?.reason ??
        'Unable to create your account. Please try again.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Join StorySpark to track orders and save your favorites</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label htmlFor="fullName">Full name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              className="auth-input"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              autoComplete="name"
              required
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              className="auth-input"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="auth-input"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="auth-input"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="auth-actions">
            <button type="submit" className="auth-primary-btn" disabled={submitting || guestSubmitting}>
              {submitting ? 'Creating account…' : 'Create Account'}
            </button>
            <button
              type="button"
              className="auth-secondary-btn"
              disabled={submitting || guestSubmitting}
              onClick={async () => {
                try {
                  setError('');
                  setGuestSubmitting(true);
                  await guestLogin();
                  navigate(from || '/checkout', { replace: true });
                } catch (err: any) {
                  const message =
                    err?.response?.data?.message ??
                    err?.response?.data?.reason ??
                    'Unable to start a guest session right now.';
                  setError(message);
                } finally {
                  setGuestSubmitting(false);
                }
              }}
            >
              {guestSubmitting ? 'Preparing guest session…' : 'Continue as Guest'}
            </button>
          </div>
        </form>

        <div className="auth-footer">
          <span>Already have an account?</span>
          <Link className="auth-link" to="/signin" state={{ from }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
