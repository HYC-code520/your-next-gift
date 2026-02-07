import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabaseClient';
import { Gift, CreditCard, Check, ArrowLeft, Palette, Ruler, Type, MessageSquare, Sparkles, Lock, Camera } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

function Checkout() {
  const { cart, clearCart, userBirthday, orderWindowInfo } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Redirect if not logged in
  if (!user) {
    return (
      <div className="flex-1 bg-background flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md text-center">
          <CardContent className="py-12">
            <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-3">
              {language === 'en' ? 'Login Required' : '需要登入'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {language === 'en' ? 'Please login to complete your order.' : '請登入以完成訂單。'}
            </p>
            <Link to="/login">
              <Button size="lg">
                {language === 'en' ? 'Login' : '登入'}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Redirect if cart is empty
  if (cart.length === 0 && !submitted) {
    return (
      <div className="flex-1 bg-background flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md text-center">
          <CardContent className="py-12">
            <h2 className="text-2xl font-bold mb-3">
              {language === 'en' ? 'Your cart is empty' : '購物車是空的'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {language === 'en' ? 'Add some gifts before checking out!' : '結帳前請先選擇禮物！'}
            </p>
            <Link to="/list">
              <Button size="lg">
                {language === 'en' ? 'Browse Gifts' : '瀏覽禮物'}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmitOrder = async () => {
    setSubmitting(true);
    setError('');

    try {
      // Create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          user_id: user.id,
          user_email: user.email,
          status: 'pending',
          total_items: cart.length,
          birthday_year: orderWindowInfo?.birthdayYear || null,
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cart.map(item => ({
        order_id: order.id,
        project_id: parseInt(item.id),
        project_name: item.projectName,
        project_description: item.description,
        project_image: item.images?.[0] || null,
        quantity: item.quantity || 1,
        customization: item.customization || {},
      }));

      console.log('Inserting order items:', orderItems);

      const { data: insertedItems, error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)
        .select();

      if (itemsError) {
        console.error('Order items insert error:', itemsError);
        throw itemsError;
      }

      console.log('Inserted items:', insertedItems);

      // Clear the cart
      await clearCart();
      setSubmitted(true);

    } catch (err) {
      console.error('Error submitting order:', err);
      setError(language === 'en' ? 'Failed to submit order. Please try again.' : '提交訂單失敗，請重試。');
    } finally {
      setSubmitting(false);
    }
  };

  // Success state
  if (submitted) {
    return (
      <div className="flex-1 bg-background flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md text-center">
          <CardContent className="py-12 flex flex-col items-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-3">
              {language === 'en' ? 'Order Submitted!' : '訂單已提交！'}
            </h2>
            <p className="text-muted-foreground mb-8">
              {language === 'en'
                ? "Your gift request has been sent. We'll start working on it soon!"
                : '您的禮物請求已送出，我們會盡快開始製作！'}
            </p>
            <div className="flex flex-col gap-3 w-full">
              <Link to="/my-orders" className="mx-auto">
                <Button size="lg">
                  {language === 'en' ? 'View My Orders' : '查看我的訂單'}
                </Button>
              </Link>
              <Link to="/list" className="mx-auto">
                <Button size="lg" variant="outline">
                  {language === 'en' ? 'Back to Gallery' : '返回畫廊'}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{language === 'en' ? 'Back to Cart' : '返回購物車'}</span>
        </button>

        <h1 className="text-3xl font-bold mb-8 text-center">
          {language === 'en' ? 'Checkout' : '結帳'}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-primary" />
                  {language === 'en' ? 'Order Summary' : '訂單摘要'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map((item) => (
                  <div key={item.cartItemId || item.id} className="flex gap-4 p-3 bg-muted/50 rounded-lg">
                    <img
                      src={item.images?.[0] || '/images/placeholder.png'}
                      alt={item.projectName}
                      className="w-20 h-20 object-cover rounded-lg"
                      onError={(e) => { e.target.src = '/images/placeholder.png'; }}
                    />
                    <div className="flex-grow">
                      <h4 className="font-semibold">{item.projectName}</h4>

                      {/* Customization Details */}
                      {item.customization && (
                        <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                          {item.customization.petPhotoUrl && (
                            <div className="flex items-center gap-2">
                              <Camera className="w-3 h-3" />
                              <span>{language === 'en' ? 'Pet photo attached' : '已附寵物照片'}</span>
                              <img
                                src={item.customization.petPhotoUrl}
                                alt="Pet"
                                className="w-8 h-8 rounded object-cover"
                              />
                            </div>
                          )}
                          {item.customization.colors?.length > 0 && (
                            <div className="flex items-center gap-2">
                              <Palette className="w-3 h-3" />
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
                            <div className="flex items-center gap-2">
                              <Ruler className="w-3 h-3" />
                              <span>{item.customization.size}</span>
                            </div>
                          )}
                          {item.customization.personalization && (
                            <div className="flex items-center gap-2">
                              <Type className="w-3 h-3" />
                              <span>"{item.customization.personalization}"</span>
                            </div>
                          )}
                          {item.customization.specialRequests && (
                            <div className="flex items-center gap-2">
                              <MessageSquare className="w-3 h-3" />
                              <span className="line-clamp-1">{item.customization.specialRequests}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Payment Section */}
          <div className="space-y-6">
            {/* Free Birthday Gift */}
            <Card className="border-[#CCE5FF] bg-[#CCE5FF]/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#1a3a4a]">
                  <Sparkles className="w-5 h-5" />
                  {language === 'en' ? 'Birthday Gift' : '生日禮物'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <p className="text-3xl font-bold text-[#1a3a4a] mb-2">
                    {language === 'en' ? 'FREE' : '免費'}
                  </p>
                  <p className="text-sm text-[#3a6a7a] mb-6">
                    {language === 'en'
                      ? "It's your birthday gift! No payment required."
                      : '這是您的生日禮物！無需付款。'}
                  </p>

                  {error && (
                    <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg mb-4 text-sm">
                      {error}
                    </div>
                  )}

                  <Button
                    onClick={handleSubmitOrder}
                    disabled={submitting}
                    size="lg"
                    className="w-full"
                  >
                    {submitting
                      ? (language === 'en' ? 'Submitting...' : '提交中...')
                      : (language === 'en' ? 'Confirm Order' : '確認訂單')
                    }
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Buy for Someone Else - Coming Soon */}
            <Card className="border-dashed border-2 opacity-60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-muted-foreground">
                  <CreditCard className="w-5 h-5" />
                  {language === 'en' ? 'Buy for Someone Else' : '為他人購買'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <div className="inline-block px-4 py-2 bg-muted rounded-full mb-4">
                    <span className="text-sm font-medium text-muted-foreground">
                      {language === 'en' ? 'Coming Soon' : '即將推出'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'en'
                      ? 'Want to gift someone special? Paid gifting feature coming soon!'
                      : '想送禮給特別的人？付費贈禮功能即將推出！'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
