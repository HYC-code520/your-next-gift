import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import '../styles/Login.css';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [sessionReady, setSessionReady] = useState(false);

  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Handle the recovery token from the URL hash
    const handleRecoveryToken = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const type = hashParams.get('type');
      
      if (type !== 'recovery') {
        setError('Invalid or expired reset link. Please request a new one.');
        return;
      }

      if (accessToken && refreshToken) {
        // Set the session with the tokens from the URL
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          console.error('Error setting session:', error);
          setError('Invalid or expired reset link. Please request a new one.');
        } else {
          setSessionReady(true);
        }
      } else {
        setError('Invalid reset link. Please request a new one.');
      }
    };

    handleRecoveryToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Check if session is ready
    if (!sessionReady) {
      setError('Session not ready. Please try again or request a new reset link.');
      return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const { error } = await updatePassword(password);
      if (error) throw error;
      
      setMessage('Password updated successfully! Redirecting to login...');
      
      // Sign out to clear the recovery session
      await supabase.auth.signOut();
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="login-container">
        <div className="login-card">
          <h2>Set New Password</h2>
          <p className="login-description">
            Enter your new password below.
          </p>

          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}

          {!sessionReady && !error && (
            <div className="info-message">
              <p>Loading your reset session...</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="password">New Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
                minLength={6}
                disabled={loading || !sessionReady}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                minLength={6}
                disabled={loading || !sessionReady}
              />
            </div>

            <button type="submit" className="submit-button" disabled={loading || !sessionReady}>
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
