import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useLanguage } from '../../context/LanguageContext';
import { AlertCircle, CheckCircle, XCircle, User, Mail, MessageSquare } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

function AdditionalRequestsManager() {
  const { t } = useLanguage();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdditionalRequests();
  }, []);

  const fetchAdditionalRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          carts!inner (
            user_id
          ),
          diy_projects:project_id (
            project_name,
            description,
            images
          )
        `)
        .eq('customization->>isAdditionalRequest', 'true')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Fetch user profiles for each request
      const requestsWithProfiles = await Promise.all(
        (data || []).map(async (request) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', request.carts.user_id)
            .single();
          
          return {
            ...request,
            userEmail: profile?.email || 'Unknown user'
          };
        })
      );
      
      setRequests(requestsWithProfiles);
    } catch (error) {
      console.error('Error fetching additional requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveRequest = async (requestId) => {
    try {
      // Get the current item to update its customization
      const { data: item, error: fetchError } = await supabase
        .from('cart_items')
        .select('customization')
        .eq('id', requestId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Update customization to remove the additional request flag
      const updatedCustomization = { ...item.customization };
      delete updatedCustomization.isAdditionalRequest;
      delete updatedCustomization.additionalItemReason;
      
      const { error } = await supabase
        .from('cart_items')
        .update({ customization: updatedCustomization })
        .eq('id', requestId);

      if (error) throw error;
      
      alert(t('requestApproved'));
      fetchAdditionalRequests();
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Error approving request');
    }
  };

  const rejectRequest = async (requestId) => {
    try {
      // Remove the item from cart
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', requestId);

      if (error) throw error;
      
      alert(t('requestRejected'));
      fetchAdditionalRequests();
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Error rejecting request');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {requests.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">{t('noRequests')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id} className="overflow-hidden">
              <CardHeader className="bg-amber-500/10">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                      {t('additionalRequests')}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {request.userEmail}
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {new Date(request.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                {/* Project Info */}
                <div className="flex gap-4 mb-4">
                  {request.diy_projects?.images?.[0] && (
                    <img 
                      src={request.diy_projects.images[0]} 
                      alt={request.diy_projects.project_name}
                      className="w-24 h-24 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h5 className="font-medium text-lg">{request.diy_projects?.project_name}</h5>
                    <p className="text-sm text-muted-foreground">{request.diy_projects?.description}</p>
                  </div>
                </div>

                {/* Request Reason */}
                <div className="bg-muted/50 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-5 h-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <h6 className="font-medium mb-2">{t('requestReason')}:</h6>
                      <p className="text-sm">{request.additional_item_reason || 'No reason provided'}</p>
                    </div>
                  </div>
                </div>

                {/* Customization Details */}
                {request.customization && (
                  <div className="bg-muted/30 rounded-lg p-4 mb-6">
                    <h6 className="font-medium mb-3">{t('customization')}:</h6>
                    <div className="space-y-2 text-sm">
                      {request.customization.colors && request.customization.colors.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">{t('colors')}:</span>
                          <div className="flex gap-1">
                            {request.customization.colors.map((color, i) => (
                              <div
                                key={i}
                                className="w-6 h-6 rounded border border-border"
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      {request.customization.size && (
                        <div>
                          <span className="text-muted-foreground">{t('size')}:</span> {request.customization.size}
                        </div>
                      )}
                      {request.customization.personalization && (
                        <div>
                          <span className="text-muted-foreground">{t('personalization')}:</span> {request.customization.personalization}
                        </div>
                      )}
                      {request.customization.specialRequests && (
                        <div>
                          <span className="text-muted-foreground">{t('specialRequests')}:</span> {request.customization.specialRequests}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => approveRequest(request.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {t('approveRequest')}
                  </Button>
                  <Button
                    onClick={() => rejectRequest(request.id)}
                    variant="destructive"
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    {t('rejectRequest')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdditionalRequestsManager;
