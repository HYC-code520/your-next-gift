import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabaseClient';
import { Package, Clock, CheckCircle, XCircle, ChevronDown, ChevronUp, Calendar, Palette, Ruler, Type, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

function MyOrders() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    } else if (user) {
      fetchOrders();
    }
  }, [user, authLoading, navigate]);

  const fetchOrders = async () => {
    try {
      // Fetch orders with their items
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;
      setOrders(ordersData || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'in_progress':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
      in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    const labels = {
      pending: language === 'en' ? 'Pending' : '待處理',
      in_progress: language === 'en' ? 'In Progress' : '製作中',
      completed: language === 'en' ? 'Completed' : '已完成',
      cancelled: language === 'en' ? 'Cancelled' : '已取消',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status] || styles.pending}`}>
        {labels[status] || status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(language === 'en' ? 'en-US' : 'zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Separate active orders (pending/in_progress) from history (completed/cancelled)
  const activeOrders = orders.filter(o => o.status === 'pending' || o.status === 'in_progress');
  const orderHistory = orders.filter(o => o.status === 'completed' || o.status === 'cancelled');

  if (authLoading || loading) {
    return (
      <div className="flex-1 bg-background flex items-center justify-center py-12">
        <div className="text-center">
          <Package className="w-16 h-16 mx-auto mb-4 animate-pulse text-primary" />
          <p className="text-muted-foreground">
            {language === 'en' ? 'Loading orders...' : '載入訂單中...'}
          </p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex-1 bg-background flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="text-center">
            <CardContent className="py-12 flex flex-col items-center justify-center">
              <h2 className="text-2xl font-bold mb-3">
                {language === 'en' ? 'No orders yet' : '還沒有訂單'}
              </h2>
              <p className="text-muted-foreground mb-8 text-base">
                {language === 'en'
                  ? 'Browse our gift gallery and place your first order!'
                  : '瀏覽禮物畫廊並下第一個訂單！'}
              </p>
              <Link to="/list">
                <Button size="lg" className="px-12">
                  {language === 'en' ? 'Browse Gifts' : '瀏覽禮物'}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const renderOrderCard = (order, isActive = false) => {
    const isExpanded = expandedOrder === order.id;

    return (
      <Card
        key={order.id}
        className={`overflow-hidden ${isActive ? 'border-primary/50 bg-primary/5' : ''}`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon(order.status)}
              <div>
                <CardTitle className="text-lg">
                  {order.birthday_year
                    ? (language === 'en' ? `${order.birthday_year} Birthday Gift` : `${order.birthday_year} 生日禮物`)
                    : (language === 'en' ? 'Gift Order' : '禮物訂單')
                  }
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {formatDate(order.created_at)}
                </p>
              </div>
            </div>
            {getStatusBadge(order.status)}
          </div>
        </CardHeader>
        <CardContent>
          {/* Order Summary */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">
              {order.total_items} {language === 'en' ? (order.total_items === 1 ? 'item' : 'items') : '項'}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
              className="flex items-center gap-1"
            >
              {isExpanded
                ? (language === 'en' ? 'Hide Details' : '隱藏詳情')
                : (language === 'en' ? 'View Details' : '查看詳情')
              }
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>

          {/* Expanded Order Items */}
          {isExpanded && order.order_items && (
            <div className="space-y-4 pt-4 border-t border-border">
              {order.order_items.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 bg-muted/50 rounded-lg">
                  {/* Item Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.project_image || '/images/placeholder.png'}
                      alt={item.project_name}
                      className="w-20 h-20 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = '/images/placeholder.png';
                      }}
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-grow">
                    <h4 className="font-semibold mb-1">{item.project_name}</h4>
                    {item.project_description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {item.project_description}
                      </p>
                    )}

                    {/* Customization Details */}
                    {item.customization && (
                      <div className="space-y-1 text-xs">
                        {item.customization.colors?.length > 0 && (
                          <div className="flex items-center gap-2">
                            <Palette className="w-3 h-3 text-muted-foreground" />
                            <div className="flex gap-1">
                              {item.customization.colors.map((color, i) => (
                                <div
                                  key={i}
                                  className="w-4 h-4 rounded-full border border-border"
                                  style={{ backgroundColor: color }}
                                  title={color}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                        {item.customization.size && (
                          <div className="flex items-center gap-2">
                            <Ruler className="w-3 h-3 text-muted-foreground" />
                            <span>{item.customization.size}</span>
                          </div>
                        )}
                        {item.customization.personalization && (
                          <div className="flex items-center gap-2">
                            <Type className="w-3 h-3 text-muted-foreground" />
                            <span>"{item.customization.personalization}"</span>
                          </div>
                        )}
                        {item.customization.specialRequests && (
                          <div className="flex items-center gap-2">
                            <MessageSquare className="w-3 h-3 text-muted-foreground" />
                            <span className="line-clamp-1">{item.customization.specialRequests}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex-1 bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          {language === 'en' ? 'My Orders' : '我的訂單'}
        </h1>

        {/* Active Orders Section */}
        {activeOrders.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              {language === 'en' ? 'Current Order' : '目前訂單'}
            </h2>
            <div className="space-y-4">
              {activeOrders.map((order) => renderOrderCard(order, true))}
            </div>
          </div>
        )}

        {/* Order History Section */}
        {orderHistory.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              {language === 'en' ? 'Order History' : '訂單歷史'}
            </h2>
            <div className="space-y-4">
              {orderHistory.map((order) => renderOrderCard(order, false))}
            </div>
          </div>
        )}

        {/* If only active orders exist */}
        {activeOrders.length > 0 && orderHistory.length === 0 && (
          <p className="text-center text-muted-foreground mt-8">
            {language === 'en'
              ? 'Your completed orders will appear here.'
              : '您完成的訂單將顯示在這裡。'
            }
          </p>
        )}
      </div>
    </div>
  );
}

export default MyOrders;
