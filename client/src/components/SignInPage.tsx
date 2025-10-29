import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../assets/css/AuthForms.css';
import { useAuth } from '../contexts/AuthContext';

type LocationState = {
  from?: string;
};

function SignInPage() {
  const { login, guestLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { from } = (location.state as LocationState) || {};

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [guestSubmitting, setGuestSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    try {
      setSubmitting(true);
      await login(email, password);
      navigate(from || '/checkout', { replace: true });
    } catch (err: any) {
      const message =
        err?.response?.data?.message ??
        err?.response?.data?.reason ??
        'Unable to sign in. Please check your credentials and try again.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to continue your StorySpark journey</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
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
              autoComplete="current-password"
              required
            />
          </div>

          <div className="auth-actions">
            <button type="submit" className="auth-primary-btn" disabled={submitting || guestSubmitting}>
              {submitting ? 'Signing in…' : 'Sign In'}
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
          <span>Don&apos;t have an account?</span>
          <Link className="auth-link" to="/signup" state={{ from }}>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
