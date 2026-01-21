import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Gift } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import PageBanner from './PageBanner';
import '../styles/AdminDashboard.css';

function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchRequests();
  }, [user, navigate]);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('request_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setError('Failed to load requests. Make sure you are authenticated.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div>
        <PageBanner title="Admin Dashboard" />
        <div className="admin-container">
          <p>Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageBanner title="Admin Dashboard" />
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h2>Gift Requests</h2>
            <p className="admin-subtitle">
              Logged in as: <strong>{user?.email}</strong>
            </p>
          </div>
          <button onClick={handleSignOut} className="signout-button">
            Sign Out
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {requests.length === 0 ? (
          <div className="no-requests">
            <Gift className="w-16 h-16 mx-auto mb-4 text-primary" />
            <p>No gift requests yet!</p>
            <p>Share your app with friends so they can request gifts.</p>
          </div>
        ) : (
          <div className="requests-grid">
            {requests.map((request) => (
              <div key={request.id} className="request-card">
                <div className="request-header">
                  <h3>{request.full_name}</h3>
                  <span className="request-date">
                    {formatDate(request.created_at)}
                  </span>
                </div>
                <div className="request-details">
                  <div className="detail-row">
                    <span className="label">Requested DIY:</span>
                    <span className="value">{request.requested_diy}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Birthday:</span>
                    <span className="value">{request.birthday}</span>
                  </div>
                  {request.color_preference && (
                    <div className="detail-row">
                      <span className="label">Color Preference:</span>
                      <span className="value">{request.color_preference}</span>
                    </div>
                  )}
                  {request.additional_details && (
                    <div className="detail-row">
                      <span className="label">Additional Details:</span>
                      <span className="value">{request.additional_details}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="requests-count">
          Total Requests: <strong>{requests.length}</strong>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
