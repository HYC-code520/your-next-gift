import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabaseClient';
import { ChevronDown, ChevronUp, Palette, Ruler, Type, MessageSquare, Minus, Plus, Trash2, Camera } from 'lucide-react';
import { Button } from './ui/button';

function MyOrders() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editedItems, setEditedItems] = useState([]);
  const [editedNotes, setEditedNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    } else if (user) {
      fetchOrders();
    }
  }, [user, authLoading, navigate]);

  const fetchOrders = async () => {
    try {
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

      // Auto-expand the first pending order
      const pendingOrder = ordersData?.find(o => o.status === 'pending');
      if (pendingOrder && !expandedOrder) {
        setExpandedOrder(pendingOrder.id);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (order) => {
    if (order.status !== 'pending') {
      alert(language === 'en' ? 'Only pending orders can be edited' : '只能編輯待處理的訂單');
      return;
    }
    setEditingOrder(order.id);
    setExpandedOrder(order.id);
    setEditedItems([...order.order_items]);
    setEditedNotes(order.notes || '');
  };

  const cancelEditing = () => {
    setEditingOrder(null);
    setEditedItems([]);
    setEditedNotes('');
  };

  const updateItemQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }
    setEditedItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (itemId) => {
    if (editedItems.length <= 1) {
      alert(language === 'en' ? 'Cannot remove the last item. Cancel the order instead.' : '無法移除最後一項。請改為取消訂單。');
      return;
    }
    setEditedItems(prev => prev.filter(item => item.id !== itemId));
  };

  const saveOrderChanges = async (orderId) => {
    setSaving(true);
    try {
      const originalOrder = orders.find(o => o.id === orderId);

      const { error: orderError } = await supabase
        .from('orders')
        .update({
          notes: editedNotes || null,
          total_items: editedItems.length,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (orderError) throw orderError;

      const currentItemIds = editedItems.map(i => i.id);
      const removedItemIds = originalOrder.order_items
        .filter(i => !currentItemIds.includes(i.id))
        .map(i => i.id);

      if (removedItemIds.length > 0) {
        const { error: deleteError } = await supabase
          .from('order_items')
          .delete()
          .in('id', removedItemIds);

        if (deleteError) throw deleteError;
      }

      for (const item of editedItems) {
        const originalItem = originalOrder.order_items.find(i => i.id === item.id);
        if (originalItem && originalItem.quantity !== item.quantity) {
          const { error: updateError } = await supabase
            .from('order_items')
            .update({ quantity: item.quantity })
            .eq('id', item.id);

          if (updateError) throw updateError;
        }
      }

      await fetchOrders();
      cancelEditing();
      alert(language === 'en' ? 'Order updated successfully!' : '訂單更新成功！');
    } catch (error) {
      console.error('Error saving order:', error);
      alert(language === 'en' ? 'Failed to save changes' : '保存失敗');
    } finally {
      setSaving(false);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;

      await fetchOrders();
      setShowCancelConfirm(null);
      cancelEditing();
      alert(language === 'en' ? 'Order cancelled' : '訂單已取消');
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert(language === 'en' ? 'Failed to cancel order' : '取消失敗');
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = (status) => {
    const labels = {
      pending: language === 'en' ? 'Pending' : '待處理',
      in_progress: language === 'en' ? 'In Progress' : '製作中',
      completed: language === 'en' ? 'Completed' : '已完成',
      cancelled: language === 'en' ? 'Cancelled' : '已取消',
    };
    return labels[status] || status;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(language === 'en' ? 'en-US' : 'zh-TW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const activeOrders = orders.filter(o => o.status === 'pending' || o.status === 'in_progress');
  const orderHistory = orders.filter(o => o.status === 'completed' || o.status === 'cancelled');

  if (authLoading || loading) {
    return (
      <div className="flex-1 bg-background flex items-center justify-center py-12">
        <p className="text-muted-foreground">
          {language === 'en' ? 'Loading...' : '載入中...'}
        </p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex-1 bg-background flex items-center justify-center px-4 py-12">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-2">
            {language === 'en' ? 'No orders yet' : '還沒有訂單'}
          </h2>
          <p className="text-muted-foreground mb-6">
            {language === 'en' ? 'Browse our gallery and place your first order' : '瀏覽畫廊並下第一個訂單'}
          </p>
          <Link to="/list">
            <Button>{language === 'en' ? 'Browse Gifts' : '瀏覽禮物'}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const renderOrderCard = (order) => {
    const isExpanded = expandedOrder === order.id;
    const isEditing = editingOrder === order.id;
    const itemsToDisplay = isEditing ? editedItems : order.order_items;
    const isPending = order.status === 'pending';

    return (
      <div
        key={order.id}
        className={`border-b border-border last:border-b-0 ${isEditing ? 'bg-primary/5' : ''}`}
      >
        {/* Order Header */}
        <div
          className="py-4 cursor-pointer"
          onClick={() => !isEditing && setExpandedOrder(isExpanded ? null : order.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Status dot */}
              <span className={`w-2 h-2 rounded-full ${getStatusStyle(order.status)}`} />
              <div>
                <span className="font-medium">
                  {order.birthday_year
                    ? (language === 'en' ? `${order.birthday_year} Birthday Gift` : `${order.birthday_year} 生日禮物`)
                    : (language === 'en' ? 'Gift Order' : '禮物訂單')
                  }
                </span>
                <span className="text-muted-foreground text-sm ml-3">
                  {formatDate(order.created_at)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {getStatusText(order.status)}
              </span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="pb-4">
            {/* Items */}
            <div className="space-y-3 mb-4">
              {(!itemsToDisplay || itemsToDisplay.length === 0) ? (
                <p className="text-sm text-muted-foreground py-2">
                  {language === 'en' ? 'No items found.' : '找不到項目。'}
                </p>
              ) : itemsToDisplay.map((item) => (
                <div key={item.id} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                  <img
                    src={item.project_image || '/images/placeholder.png'}
                    alt={item.project_name}
                    className="w-16 h-16 object-cover rounded"
                    onError={(e) => { e.target.src = '/images/placeholder.png'; }}
                  />
                  <div className="flex-grow min-w-0">
                    <h4 className="font-medium text-sm">{item.project_name}</h4>

                    {/* Customization */}
                    {item.customization && (
                      <div className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                        {item.customization.petPhotoUrl && (
                          <div className="flex items-center gap-1.5">
                            <Camera className="w-3 h-3" />
                            <span>{language === 'en' ? 'Pet photo' : '寵物照片'}</span>
                            <img
                              src={item.customization.petPhotoUrl}
                              alt="Pet"
                              className="w-6 h-6 rounded object-cover"
                            />
                          </div>
                        )}
                        {item.customization.colors?.length > 0 && (
                          <div className="flex items-center gap-1.5">
                            <Palette className="w-3 h-3" />
                            <div className="flex gap-0.5">
                              {item.customization.colors.map((color, i) => (
                                <span
                                  key={i}
                                  className="w-3 h-3 rounded-full border border-border"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                        {item.customization.size && (
                          <div className="flex items-center gap-1.5">
                            <Ruler className="w-3 h-3" />
                            <span>{item.customization.size}</span>
                          </div>
                        )}
                        {item.customization.personalization && (
                          <div className="flex items-center gap-1.5">
                            <Type className="w-3 h-3" />
                            <span className="truncate">"{item.customization.personalization}"</span>
                          </div>
                        )}
                        {item.customization.specialRequests && (
                          <div className="flex items-center gap-1.5">
                            <MessageSquare className="w-3 h-3" />
                            <span className="truncate">{item.customization.specialRequests}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Quantity */}
                    <div className="mt-2 flex items-center gap-2 text-sm">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <button
                            className="w-6 h-6 flex items-center justify-center rounded border border-border hover:bg-muted"
                            onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center">{item.quantity}</span>
                          <button
                            className="w-6 h-6 flex items-center justify-center rounded border border-border hover:bg-muted"
                            onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">
                          {language === 'en' ? `Qty: ${item.quantity}` : `數量: ${item.quantity}`}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Remove button */}
                  {isEditing && (
                    <button
                      className="self-start p-1.5 text-muted-foreground hover:text-red-500"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Notes */}
            {isEditing && (
              <div className="mb-4">
                <textarea
                  value={editedNotes}
                  onChange={(e) => setEditedNotes(e.target.value)}
                  placeholder={language === 'en' ? 'Add notes for Ariel...' : '給 Ariel 的備註...'}
                  className="w-full p-3 text-sm border border-border rounded-lg bg-background resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                  rows={2}
                />
              </div>
            )}

            {!isEditing && order.notes && (
              <p className="text-sm text-muted-foreground mb-4">
                {language === 'en' ? 'Notes: ' : '備註: '}{order.notes}
              </p>
            )}

            {/* Actions */}
            {isPending && (
              <div className="flex gap-2 pt-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => saveOrderChanges(order.id)}
                      disabled={saving}
                      className="text-sm font-medium text-primary hover:underline disabled:opacity-50"
                    >
                      {saving ? (language === 'en' ? 'Saving...' : '保存中...') : (language === 'en' ? 'Save' : '保存')}
                    </button>
                    <span className="text-muted-foreground">·</span>
                    <button
                      onClick={cancelEditing}
                      disabled={saving}
                      className="text-sm text-muted-foreground hover:underline disabled:opacity-50"
                    >
                      {language === 'en' ? 'Cancel' : '取消'}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEditing(order)}
                      className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                    >
                      {language === 'en' ? 'Edit' : '編輯'}
                    </button>
                    <span className="text-muted-foreground">·</span>
                    <button
                      onClick={() => setShowCancelConfirm(order.id)}
                      className="text-sm text-muted-foreground hover:text-red-500 hover:underline"
                    >
                      {language === 'en' ? 'Cancel order' : '取消訂單'}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        {showCancelConfirm === order.id && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-card p-6 rounded-lg shadow-lg max-w-sm mx-4">
              <h3 className="font-medium mb-2">
                {language === 'en' ? 'Cancel this order?' : '取消此訂單？'}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {language === 'en' ? 'This cannot be undone.' : '此操作無法撤銷。'}
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowCancelConfirm(null)}
                  className="text-sm text-muted-foreground hover:underline"
                >
                  {language === 'en' ? 'Keep' : '保留'}
                </button>
                <button
                  onClick={() => cancelOrder(order.id)}
                  className="text-sm text-red-500 hover:underline"
                >
                  {language === 'en' ? 'Cancel order' : '取消訂單'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 bg-background px-4">
      <div className="w-full max-w-2xl mx-auto pt-[15vh] pb-12">
        <h1 className="text-2xl font-medium mb-6">
          {language === 'en' ? 'My Orders' : '我的訂單'}
        </h1>

        {/* All orders in one clean list */}
        <div className="bg-card border border-border rounded-lg divide-y divide-border">
          {activeOrders.length > 0 && (
            <div className="px-4">
              {activeOrders.map((order) => renderOrderCard(order))}
            </div>
          )}

          {orderHistory.length > 0 && activeOrders.length > 0 && (
            <div className="px-4 py-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                {language === 'en' ? 'Past orders' : '歷史訂單'}
              </span>
            </div>
          )}

          {orderHistory.length > 0 && (
            <div className="px-4">
              {orderHistory.map((order) => renderOrderCard(order))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyOrders;
