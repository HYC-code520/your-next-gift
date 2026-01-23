import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useLanguage } from '../../context/LanguageContext';
import { Package, Calendar, User, Mail, Palette, Ruler, Type, MessageSquare, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

function OrdersManager() {
  const { t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            diy_projects (
              project_name,
              description,
              images
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      
      // Refresh orders
      fetchOrders();
      alert(t('orderUpdated'));
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Error updating order status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30';
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30';
      case 'completed':
        return 'bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/30';
    }
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filterStatus === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterStatus('all')}
        >
          {t('allStatuses')}
        </Button>
        <Button
          variant={filterStatus === 'pending' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterStatus('pending')}
        >
          {t('pending')}
        </Button>
        <Button
          variant={filterStatus === 'in_progress' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterStatus('in_progress')}
        >
          {t('inProgress')}
        </Button>
        <Button
          variant={filterStatus === 'completed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterStatus('completed')}
        >
          {t('completed')}
        </Button>
        <Button
          variant={filterStatus === 'cancelled' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterStatus('cancelled')}
        >
          {t('cancelled')}
        </Button>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">{t('noOrders')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-3">
                      {t('orderDetails')} #{order.id.slice(0, 8)}
                      {order.birthday_year && (
                        <span className="text-sm font-normal bg-purple-500/20 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full">
                          🎂 {order.birthday_year} Birthday
                        </span>
                      )}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {order.user_name || order.user_email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {order.user_email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                      {t(order.status)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    >
                      <ChevronDown className={`w-5 h-5 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {expandedOrder === order.id && (
                <CardContent className="pt-6">
                  {/* Order Items */}
                  <div className="space-y-4 mb-6">
                    <h4 className="font-semibold">{t('totalItems')}: {order.order_items?.length || 0}</h4>
                    {order.order_items?.map((item, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-3">
                        <div className="flex gap-4">
                          {item.project_image && (
                            <img 
                              src={item.project_image} 
                              alt={item.project_name}
                              className="w-20 h-20 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <h5 className="font-medium">{item.project_name}</h5>
                            <p className="text-sm text-muted-foreground">{item.project_description}</p>
                          </div>
                        </div>

                        {/* Customization Details */}
                        {item.customization && (
                          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                            <h6 className="font-medium text-sm flex items-center gap-2">
                              <Palette className="w-4 h-4" />
                              {t('customization')}
                            </h6>
                            
                            {item.customization.colors && item.customization.colors.length > 0 && (
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-muted-foreground">{t('colors')}:</span>
                                <div className="flex gap-1">
                                  {item.customization.colors.map((color, i) => (
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
                            
                            {item.customization.size && (
                              <div className="flex items-center gap-2 text-sm">
                                <Ruler className="w-4 h-4 text-muted-foreground" />
                                <span className="text-muted-foreground">{t('size')}:</span>
                                <span>{item.customization.size}</span>
                              </div>
                            )}
                            
                            {item.customization.personalization && (
                              <div className="flex items-center gap-2 text-sm">
                                <Type className="w-4 h-4 text-muted-foreground" />
                                <span className="text-muted-foreground">{t('personalization')}:</span>
                                <span>{item.customization.personalization}</span>
                              </div>
                            )}
                            
                            {item.customization.specialRequests && (
                              <div className="flex items-start gap-2 text-sm">
                                <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5" />
                                <div>
                                  <span className="text-muted-foreground">{t('specialRequests')}:</span>
                                  <p className="mt-1">{item.customization.specialRequests}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Birthday Date */}
                  {order.birthday_date && (
                    <div className="mb-6 p-3 bg-primary/10 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        <span className="font-medium">{t('birthdayDate')}:</span>
                        <span>{new Date(order.birthday_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  )}

                  {/* Status Update */}
                  <div className="flex items-center gap-3">
                    <label className="font-medium">{t('orderStatus')}:</label>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="px-3 py-2 bg-input border border-border rounded-md"
                    >
                      <option value="pending">{t('pending')}</option>
                      <option value="in_progress">{t('inProgress')}</option>
                      <option value="completed">{t('completed')}</option>
                      <option value="cancelled">{t('cancelled')}</option>
                    </select>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersManager;
