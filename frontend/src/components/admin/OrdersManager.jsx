import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useLanguage } from '../../context/LanguageContext';
import { ChevronRight } from 'lucide-react';

// Local image map for projects
const localImageMap = {
  1: '/images/Wavy-photo-frame-coverphoto.PNG',
  2: '/images/dog-pizza.JPG',
  3: '/images/customize-twistt-sticks-pet-bouquet.png',
  4: '/images/Flower-balloon.PNG',
  5: '/images/7-11-coverphoto-1.PNG',
  6: '/images/weaved-black-crossbody-bag.PNG',
  9: '/images/Cookie-cusion.JPG',
  10: '/images/Ham-hideout.PNG',
  11: '/images/cat-hideout1.png',
  12: '/images/AH-DAI-pen-holder.PNG',
  14: '/images/flower-box-with-jellycat.JPG',
  15: '/images/Fuji-Mountain-weaved-bag.png',
  16: '/images/icecream-cake.JPG',
  17: '/images/Kawaii-twisty-sticks-keychain.PNG',
  18: '/images/Miffy-clock2.png',
  19: '/images/twistysticks-flower.PNG',
  20: '/images/Chiikawa-frame2.png',
  21: '/images/Crossbodybag-1.JPG',
  22: '/images/Cat-bow-frame.png',
  23: '/images/double-frame-clay-frame.PNG',
  24: '/images/Fancy-fruit-basket1.png',
  25: '/images/2nd-shape-wavy-mirror-frame.JPG',
  26: '/images/white-weaving-handbag.png',
  27: '/images/cat-pizza01.png',
  28: '/images/custom-pet-inscense-stick-holder-01.PNG',
};

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
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending': return 'text-amber-600 dark:text-amber-400';
      case 'in_progress': return 'text-blue-600 dark:text-blue-400';
      case 'completed': return 'text-green-600 dark:text-green-400';
      case 'cancelled': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter(order => order.status === filterStatus);

  // Create a map of order IDs to sequential numbers (oldest = 001)
  const orderNumberMap = {};
  [...orders].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .forEach((order, index) => {
      orderNumberMap[order.id] = String(index + 1).padStart(3, '0');
    });

  if (loading) {
    return (
      <div className="py-12 text-center text-muted-foreground text-sm">
        Loading...
      </div>
    );
  }

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <div className="space-y-6">
      {/* Filters - pill style like Linear */}
      <div className="flex gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setFilterStatus(filter.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filterStatus === filter.id
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <p className="text-muted-foreground text-sm py-8">{t('noOrders')}</p>
      ) : (
        <div className="border border-border/50 rounded-lg overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-muted/30 text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <div className="col-span-4">Order</div>
            <div className="col-span-3">Customer</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1"></div>
          </div>

          {/* Rows */}
          {filteredOrders.map((order) => (
            <div key={order.id} className="border-t border-border/50">
              {/* Row */}
              <div
                className="grid grid-cols-12 gap-4 px-4 py-3 items-center cursor-pointer hover:bg-muted/20 transition-colors"
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              >
                <div className="col-span-4">
                  <p className="text-sm font-medium">#{orderNumberMap[order.id]}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.order_items?.length || 0} item{order.order_items?.length !== 1 ? 's' : ''}
                    {order.birthday_year && ` · ${order.birthday_year} birthday`}
                  </p>
                </div>
                <div className="col-span-3">
                  <p className="text-sm truncate">{order.user_email}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="col-span-2">
                  <span className={`text-sm font-medium ${getStatusStyle(order.status)}`}>
                    {t(order.status)}
                  </span>
                </div>
                <div className="col-span-1 flex justify-end">
                  <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${expandedOrder === order.id ? 'rotate-90' : ''}`} />
                </div>
              </div>

              {/* Expanded Details */}
              {expandedOrder === order.id && (
                <div className="px-4 pb-4 bg-muted/10">
                  <div className="pl-4 border-l-2 border-border/50 space-y-4 py-4">
                    {/* Items */}
                    {order.order_items?.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        {(localImageMap[item.project_id] || item.project_image) && (
                          <img
                            src={localImageMap[item.project_id] || item.project_image}
                            alt={item.project_name}
                            className="w-14 h-14 object-cover rounded"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">
                            {item.project_name}
                            {item.quantity > 1 && (
                              <span className="text-muted-foreground font-normal"> × {item.quantity}</span>
                            )}
                          </p>

                          {/* Customization */}
                          {item.customization && Object.keys(item.customization).length > 0 && (
                            <div className="mt-2 space-y-1.5 text-xs text-muted-foreground">
                              {item.customization.petPhotoUrl && (
                                <div>
                                  <span className="text-foreground">Pet photo:</span>
                                  <img
                                    src={item.customization.petPhotoUrl}
                                    alt="Pet"
                                    className="mt-1 w-20 h-20 object-cover rounded"
                                  />
                                </div>
                              )}
                              {item.customization.colors?.length > 0 && (
                                <div className="flex items-center gap-2">
                                  <span>Colors:</span>
                                  <div className="flex gap-1">
                                    {item.customization.colors.map((color, i) => (
                                      <div
                                        key={i}
                                        className="w-4 h-4 rounded-full border border-border"
                                        style={{ backgroundColor: color }}
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}
                              {item.customization.size && (
                                <p><span className="text-foreground">Size:</span> {item.customization.size}</p>
                              )}
                              {item.customization.personalization && (
                                <p><span className="text-foreground">Text:</span> "{item.customization.personalization}"</p>
                              )}
                              {item.customization.specialRequests && (
                                <p><span className="text-foreground">Note:</span> {item.customization.specialRequests}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Status Update */}
                    <div className="flex items-center gap-3 pt-3 border-t border-border/30">
                      <span className="text-xs text-muted-foreground">Update status:</span>
                      <select
                        value={order.status}
                        onChange={(e) => {
                          e.stopPropagation();
                          updateOrderStatus(order.id, e.target.value);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs px-2 py-1.5 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-foreground/20"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersManager;
