import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabaseClient';
import { User, Calendar, Save, Check, Lock, ChevronDown, ChevronUp, Palette, Ruler, Type, MessageSquare, Minus, Plus, Trash2, Camera } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

function Profile() {
  const { user, loading: authLoading } = useAuth();
  const { refreshUserBirthday } = useCart();
  const navigate = useNavigate();
  const { language } = useLanguage();

  // Profile state
  const [birthday, setBirthday] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [hasOrders, setHasOrders] = useState(false);

  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editedItems, setEditedItems] = useState([]);
  const [editedNotes, setEditedNotes] = useState('');
  const [orderSaving, setOrderSaving] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    } else if (user) {
      fetchProfile();
      fetchOrders();
    }
  }, [user, authLoading, navigate]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('birthday')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data?.birthday) setBirthday(data.birthday);

      const { data: orderCheck, error: ordersError } = await supabase
        .from('orders')
        .select('id')
        .eq('user_id', user.id)
        .neq('status', 'cancelled')
        .limit(1);

      if (!ordersError && orderCheck && orderCheck.length > 0) setHasOrders(true);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`*, order_items (*)`)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;
      setOrders(ordersData || []);

      const pendingOrder = ordersData?.find(o => o.status === 'pending');
      if (pendingOrder && !expandedOrder) setExpandedOrder(pendingOrder.id);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setOrdersLoading(false);
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

  // Order editing functions
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
    if (newQuantity <= 0) { removeItem(itemId); return; }
    setEditedItems(prev => prev.map(item => item.id === itemId ? { ...item, quantity: newQuantity } : item));
  };

  const removeItem = (itemId) => {
    if (editedItems.length <= 1) {
      alert(language === 'en' ? 'Cannot remove the last item. Cancel the order instead.' : '無法移除最後一項。請改為取消訂單。');
      return;
    }
    setEditedItems(prev => prev.filter(item => item.id !== itemId));
  };

  const saveOrderChanges = async (orderId) => {
    setOrderSaving(true);
    try {
      const originalOrder = orders.find(o => o.id === orderId);

      const { error: orderError } = await supabase
        .from('orders')
        .update({ notes: editedNotes || null, total_items: editedItems.length, updated_at: new Date().toISOString() })
        .eq('id', orderId);
      if (orderError) throw orderError;

      const currentItemIds = editedItems.map(i => i.id);
      const removedItemIds = originalOrder.order_items.filter(i => !currentItemIds.includes(i.id)).map(i => i.id);

      if (removedItemIds.length > 0) {
        const { error: deleteError } = await supabase.from('order_items').delete().in('id', removedItemIds);
        if (deleteError) throw deleteError;
      }

      for (const item of editedItems) {
        const originalItem = originalOrder.order_items.find(i => i.id === item.id);
        if (originalItem && originalItem.quantity !== item.quantity) {
          const { error: updateError } = await supabase.from('order_items').update({ quantity: item.quantity }).eq('id', item.id);
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
      setOrderSaving(false);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
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
      case 'pending': return 'bg-amber-500';
      case 'in_progress': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-gray-400';
      default: return 'bg-gray-400';
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
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  const activeOrders = orders.filter(o => o.status === 'pending' || o.status === 'in_progress');
  const orderHistory = orders.filter(o => o.status === 'completed' || o.status === 'cancelled');

  const renderOrderCard = (order) => {
    const isExpanded = expandedOrder === order.id;
    const isEditing = editingOrder === order.id;
    const itemsToDisplay = isEditing ? editedItems : order.order_items;
    const isPending = order.status === 'pending';

    return (
      <div key={order.id} className={`border-b border-border last:border-b-0 ${isEditing ? 'bg-primary/5' : ''}`}>
        <div className="py-4 cursor-pointer" onClick={() => !isEditing && setExpandedOrder(isExpanded ? null : order.id)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full ${getStatusStyle(order.status)}`} />
              <div>
                <span className="font-medium">
                  {order.birthday_year
                    ? (language === 'en' ? `${order.birthday_year} Birthday Gift` : `${order.birthday_year} 生日禮物`)
                    : (language === 'en' ? 'Gift Order' : '禮物訂單')}
                </span>
                <span className="text-muted-foreground text-sm ml-3">{formatDate(order.created_at)}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{getStatusText(order.status)}</span>
              {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="pb-4">
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
                    {item.customization && (
                      <div className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                        {item.customization.petPhotoUrl && (
                          <div className="flex items-center gap-1.5">
                            <Camera className="w-3 h-3" />
                            <span>{language === 'en' ? 'Pet photo' : '寵物照片'}</span>
                            <img src={item.customization.petPhotoUrl} alt="Pet" className="w-6 h-6 rounded object-cover" />
                          </div>
                        )}
                        {item.customization.colors?.length > 0 && (
                          <div className="flex items-center gap-1.5">
                            <Palette className="w-3 h-3" />
                            <div className="flex gap-0.5">
                              {item.customization.colors.map((color, i) => (
                                <span key={i} className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: color }} />
                              ))}
                            </div>
                          </div>
                        )}
                        {item.customization.size && (
                          <div className="flex items-center gap-1.5"><Ruler className="w-3 h-3" /><span>{item.customization.size}</span></div>
                        )}
                        {item.customization.personalization && (
                          <div className="flex items-center gap-1.5"><Type className="w-3 h-3" /><span className="truncate">"{item.customization.personalization}"</span></div>
                        )}
                        {item.customization.specialRequests && (
                          <div className="flex items-center gap-1.5"><MessageSquare className="w-3 h-3" /><span className="truncate">{item.customization.specialRequests}</span></div>
                        )}
                      </div>
                    )}
                    <div className="mt-2 flex items-center gap-2 text-sm">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <button className="w-6 h-6 flex items-center justify-center rounded border border-border hover:bg-muted" onClick={() => updateItemQuantity(item.id, item.quantity - 1)}>
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center">{item.quantity}</span>
                          <button className="w-6 h-6 flex items-center justify-center rounded border border-border hover:bg-muted" onClick={() => updateItemQuantity(item.id, item.quantity + 1)}>
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
                  {isEditing && (
                    <button className="self-start p-1.5 text-muted-foreground hover:text-red-500" onClick={() => removeItem(item.id)}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

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

            {isPending && (
              <div className="flex gap-2 pt-2">
                {isEditing ? (
                  <>
                    <button onClick={() => saveOrderChanges(order.id)} disabled={orderSaving} className="text-sm font-medium text-primary hover:underline disabled:opacity-50">
                      {orderSaving ? (language === 'en' ? 'Saving...' : '保存中...') : (language === 'en' ? 'Save' : '保存')}
                    </button>
                    <span className="text-muted-foreground">·</span>
                    <button onClick={cancelEditing} disabled={orderSaving} className="text-sm text-muted-foreground hover:underline disabled:opacity-50">
                      {language === 'en' ? 'Cancel' : '取消'}
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEditing(order)} className="text-sm text-muted-foreground hover:text-foreground hover:underline">
                      {language === 'en' ? 'Edit' : '編輯'}
                    </button>
                    <span className="text-muted-foreground">·</span>
                    <button onClick={() => setShowCancelConfirm(order.id)} className="text-sm text-muted-foreground hover:text-red-500 hover:underline">
                      {language === 'en' ? 'Cancel order' : '取消訂單'}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {showCancelConfirm === order.id && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-card p-6 rounded-lg shadow-lg max-w-sm mx-4">
              <h3 className="font-medium mb-2">{language === 'en' ? 'Cancel this order?' : '取消此訂單？'}</h3>
              <p className="text-sm text-muted-foreground mb-4">{language === 'en' ? 'This cannot be undone.' : '此操作無法撤銷。'}</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowCancelConfirm(null)} className="text-sm text-muted-foreground hover:underline">
                  {language === 'en' ? 'Keep' : '保留'}
                </button>
                <button onClick={() => cancelOrder(order.id)} className="text-sm text-red-500 hover:underline">
                  {language === 'en' ? 'Cancel order' : '取消訂單'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (authLoading || loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="text-center">
          <User className="w-16 h-16 mx-auto mb-4 animate-pulse text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 px-4 sm:px-6">
      <div className="w-full max-w-2xl mx-auto pt-[15vh] pb-12 space-y-8">
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <User className="w-6 h-6" />
              {language === 'en' ? 'Your Profile' : '個人檔案'}
            </CardTitle>
            <CardDescription>
              {language === 'en' ? 'Manage your account settings' : '管理你的帳戶設定'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-muted-foreground cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {hasOrders ? <Lock className="w-4 h-4 inline mr-2" /> : <Calendar className="w-4 h-4 inline mr-2" />}
                  {language === 'en' ? 'Your Birthday' : '你的生日'}
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
                    ? (language === 'en' ? 'Birthday is locked after placing an order. Contact Ariel if you need to change it.' : '下單後生日已鎖定。如需更改請聯繫 Ariel。')
                    : (language === 'en' ? 'Your birthday determines when you can order your free gift.' : '你的生日決定何時可以訂購免費禮物。')}
                </p>
              </div>

              {error && (
                <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg">{error}</div>
              )}

              {saved && (
                <div className="bg-green-100 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  {language === 'en' ? 'Profile saved successfully!' : '個人檔案已儲存！'}
                </div>
              )}

              {!hasOrders && (
                <Button type="submit" disabled={saving} className="w-full">
                  {saving ? (language === 'en' ? 'Saving...' : '儲存中...') : (
                    <><Save className="w-4 h-4 mr-2" />{language === 'en' ? 'Save Profile' : '儲存'}</>
                  )}
                </Button>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Orders Section */}
        <div>
          <h2 className="text-lg font-medium mb-4">
            {language === 'en' ? 'My Orders' : '我的訂單'}
          </h2>

          {ordersLoading ? (
            <p className="text-sm text-muted-foreground">{language === 'en' ? 'Loading orders...' : '載入訂單中...'}</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                {language === 'en' ? 'No orders yet' : '還沒有訂單'}
              </p>
              <Link to="/list">
                <Button variant="outline">{language === 'en' ? 'Browse Gifts' : '瀏覽禮物'}</Button>
              </Link>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg divide-y divide-border">
              {activeOrders.length > 0 && (
                <div className="px-4">{activeOrders.map(renderOrderCard)}</div>
              )}
              {orderHistory.length > 0 && activeOrders.length > 0 && (
                <div className="px-4 py-2">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    {language === 'en' ? 'Past orders' : '歷史訂單'}
                  </span>
                </div>
              )}
              {orderHistory.length > 0 && (
                <div className="px-4">{orderHistory.map(renderOrderCard)}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
