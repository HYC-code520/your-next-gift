import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useLanguage } from '../../context/LanguageContext';
import { Users, Mail, Calendar, Package, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

function CustomersManager() {
  const { t } = useLanguage();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCustomer, setExpandedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState({});

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);

      // Fetch order counts for each customer
      const orderCounts = {};
      for (const customer of data || []) {
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('id')
          .eq('user_id', customer.id);

        if (!ordersError) {
          orderCounts[customer.id] = orders?.length || 0;
        }
      }
      setCustomerOrders(orderCounts);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerOrderHistory = async (customerId) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            project_name,
            quantity
          )
        `)
        .eq('user_id', customerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      return [];
    }
  };

  const handleExpandCustomer = async (customerId) => {
    if (expandedCustomer === customerId) {
      setExpandedCustomer(null);
    } else {
      setExpandedCustomer(customerId);
      // Fetch order history if not already loaded
      if (!customerOrders[`${customerId}_history`]) {
        const history = await fetchCustomerOrderHistory(customerId);
        setCustomerOrders(prev => ({
          ...prev,
          [`${customerId}_history`]: history
        }));
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300';
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-700 dark:text-blue-300';
      case 'completed':
        return 'bg-green-500/20 text-green-700 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-500/20 text-red-700 dark:text-red-300';
      default:
        return 'bg-gray-500/20 text-gray-700 dark:text-gray-300';
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
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t('allCustomers')} ({customers.length})</h3>
      </div>

      {customers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">{t('noCustomers')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {customers.map((customer) => (
            <Card key={customer.id}>
              <CardHeader className="bg-muted/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {customer.email}
                        {customer.role === 'admin' && (
                          <span className="px-2 py-0.5 bg-primary/20 text-primary rounded-full text-xs font-medium">
                            Admin
                          </span>
                        )}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(customer.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          {customerOrders[customer.id] || 0} orders
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleExpandCustomer(customer.id)}
                  >
                    <ChevronDown className={`w-5 h-5 transition-transform ${expandedCustomer === customer.id ? 'rotate-180' : ''}`} />
                  </Button>
                </div>
              </CardHeader>

              {expandedCustomer === customer.id && (
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-4">{t('orderHistory')}</h4>
                  {customerOrders[`${customer.id}_history`]?.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">{t('noOrderHistory')}</p>
                  ) : (
                    <div className="space-y-3">
                      {customerOrders[`${customer.id}_history`]?.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <span className="font-medium">Order #{order.id.slice(0, 8)}</span>
                              <span className="text-sm text-muted-foreground ml-3">
                                {new Date(order.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                              {t(order.status)}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {order.order_items?.length || 0} items
                            {order.birthday_date && (
                              <span className="ml-3">
                                • Birthday: {new Date(order.birthday_date).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomersManager;
