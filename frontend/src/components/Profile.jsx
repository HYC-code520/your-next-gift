import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { User, Calendar, Save, Check, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

function Profile() {
  const { user, loading: authLoading } = useAuth();
  const { refreshUserBirthday } = useCart();
  const navigate = useNavigate();
  const [birthday, setBirthday] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [hasOrders, setHasOrders] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    } else if (user) {
      fetchProfile();
    }
  }, [user, authLoading, navigate]);

  const fetchProfile = async () => {
    try {
      // Fetch profile
      const { data, error } = await supabase
        .from('profiles')
        .select('birthday')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data?.birthday) {
        setBirthday(data.birthday);
      }

      // Check if user has any non-cancelled orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('id')
        .eq('user_id', user.id)
        .neq('status', 'cancelled')
        .limit(1);

      if (!ordersError && orders && orders.length > 0) {
        setHasOrders(true);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    setSaved(false);

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          birthday: birthday,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      // Refresh the cart context so it knows about the new birthday
      await refreshUserBirthday();

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="text-center">
          <User className="w-16 h-16 mx-auto mb-4 animate-pulse text-primary" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <User className="w-6 h-6" />
              Your Profile
            </CardTitle>
            <CardDescription>
              Manage your account settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email (read-only) */}
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-muted-foreground cursor-not-allowed"
                />
              </div>

              {/* Birthday */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {hasOrders ? <Lock className="w-4 h-4 inline mr-2" /> : <Calendar className="w-4 h-4 inline mr-2" />}
                  Your Birthday
                </label>
                <input
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  disabled={hasOrders}
                  className={`w-full px-4 py-3 border border-border rounded-lg ${
                    hasOrders
                      ? 'bg-muted text-muted-foreground cursor-not-allowed'
                      : 'bg-input focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
                  }`}
                  required
                />
                <p className="text-sm text-muted-foreground mt-2">
                  {hasOrders
                    ? 'Birthday is locked after placing an order. Contact Ariel if you need to change it.'
                    : 'Your birthday determines when you can order your free gift.'
                  }
                </p>
              </div>

              {error && (
                <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {saved && (
                <div className="bg-green-100 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  Profile saved successfully!
                </div>
              )}

              {!hasOrders && (
                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full"
                >
                  {saving ? (
                    'Saving...'
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Profile
                    </>
                  )}
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Profile;
