import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Login.css';

// Map Supabase error messages to user-friendly messages
const getFriendlyErrorMessage = (errorMessage) => {
  const errorMap = {
    'User already registered': 'This email is already registered. Please sign in instead.',
    'Invalid login credentials': 'Incorrect email or password. Please try again.',
    'Email not confirmed': 'Please check your email and confirm your account first.',
    'Password should be at least 6 characters': 'Password must be at least 6 characters long.',
    'Unable to validate email address: invalid format': 'Please enter a valid email address.',
    'Email rate limit exceeded': 'Too many attempts. Please wait a few minutes and try again.',
  };

  // Check if the error message contains any of the known error keys
  for (const [key, friendlyMessage] of Object.entries(errorMap)) {
    if (errorMessage.toLowerCase().includes(key.toLowerCase())) {
      return friendlyMessage;
    }
  }

  return errorMessage;
};

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [errorType, setErrorType] = useState(''); // Track error type for special actions
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setErrorType('');
    setMessage('');
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await signUp(email, password);
        if (error) throw error;

        // Check if user already exists - Supabase returns empty identities array
        // when email confirmation is enabled and user already exists
        if (data?.user?.identities?.length === 0) {
          setError('This email is already registered. Please sign in instead.');
          setErrorType('already_registered');
          return;
        }

        setMessage('Check your email for the confirmation link!');
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
        navigate('/admin');
      }
    } catch (error) {
      const friendlyMessage = getFriendlyErrorMessage(error.message);
      setError(friendlyMessage);

      // Track if it's a "user already exists" error
      if (error.message.toLowerCase().includes('already registered')) {
        setErrorType('already_registered');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex bg-background py-8">
      <div className="login-container">
        <div className="login-card">
          <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
          <p className="login-description">
            {isSignUp 
              ? 'Create your admin account to manage gift requests' 
              : 'Login to view and manage gift requests'}
          </p>

          {error && (
            errorType === 'already_registered' ? (
              <div className="notice-card">
                <div className="notice-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 16v-4"></path>
                    <path d="M12 8h.01"></path>
                  </svg>
                </div>
                <div className="notice-content">
                  <p className="notice-title">Account already exists</p>
                  <p className="notice-text">This email is already registered. Sign in to continue.</p>
                </div>
                <button
                  type="button"
                  className="notice-action-button"
                  onClick={() => {
                    setIsSignUp(false);
                    setError('');
                    setErrorType('');
                  }}
                >
                  Sign In
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            ) : (
              <div className="error-message">{error}</div>
            )
          )}
          {message && <div className="success-message">{message}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
                minLength={6}
                disabled={loading}
              />
            </div>

            {!isSignUp && (
              <div className="forgot-password-link">
                <Link to="/forgot-password">Forgot password?</Link>
              </div>
            )}

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>

          <div className="toggle-mode">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setMessage('');
              }}
              className="toggle-button"
            >
              {isSignUp
                ? 'Already have an account? Sign In'
                : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
