import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ShoppingCart, Gift, Lock, Lightbulb, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

function Cart() {
  const { cart, removeFromCart } = useCart();
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      localStorage.setItem('redirectAfterLogin', '/checkout');
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex-1 bg-background flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-fade-in">
          <Card className="text-center">
            <CardContent className="py-12 flex flex-col items-center justify-center">
              <h2 className="text-2xl font-bold mb-3">
                {language === 'en' ? 'Your cart is empty' : '購物車是空的'}
              </h2>
              <p className="text-muted-foreground mb-8 text-base">
                {language === 'en' ? 'Browse our amazing DIY projects and find your perfect gift!' : '瀏覽我們的 DIY 專案，找到你的完美禮物！'}
              </p>
              <Link to="/list">
                <Button size="lg" className="px-12">
                  {language === 'en' ? 'Explore Projects' : '探索專案'}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background pt-8">
      <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <Card 
                key={item.cartItemId || item.id}
                className="animate-slide-up hover-glow"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {/* Image */}
                    <div className="flex-shrink-0 group">
                      <img
                        src={item.images?.[0] || '/images/placeholder.png'}
                        alt={item.projectName}
                        className="w-32 h-32 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = '/images/placeholder.png';
                        }}
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold mb-2 hover:text-primary transition-colors">
                        {item.projectName}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {item.description}
                      </p>
                      
                      {/* Customization Details */}
                      {item.customization && (item.customization.colors?.length > 0 || item.customization.size || item.customization.personalization || item.customization.specialRequests) && (
                        <div className="bg-primary/10 rounded-lg p-3 mb-3 space-y-1">
                          <p className="text-xs font-semibold text-primary mb-1">
                            ✨ {language === 'en' ? 'Customization:' : '客製化：'}
                          </p>
                          {item.customization.colors?.length > 0 && (
                            <div className="flex items-center gap-1 text-xs">
                              <span className="font-medium">{language === 'en' ? 'Colors:' : '顏色：'}</span>
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
                            <p className="text-xs">
                              <span className="font-medium">{language === 'en' ? 'Size:' : '尺寸：'}</span> {item.customization.size}
                            </p>
                          )}
                          {item.customization.personalization && (
                            <p className="text-xs">
                              <span className="font-medium">{language === 'en' ? 'Text:' : '文字：'}</span> "{item.customization.personalization}"
                            </p>
                          )}
                          {item.customization.specialRequests && (
                            <p className="text-xs">
                              <span className="font-medium">{language === 'en' ? 'Notes:' : '備註：'}</span> {item.customization.specialRequests}
                            </p>
                          )}
                        </div>
                      )}
                      
                      {/* Additional Request Reason */}
                      {item.customization?.isAdditionalRequest && item.customization?.additionalItemReason && (
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 mb-3">
                          <p className="text-xs font-semibold text-amber-600 mb-1">
                            📝 {language === 'en' ? 'Reason for additional gift:' : '額外禮物原因：'}
                          </p>
                          <p className="text-xs text-amber-700 dark:text-amber-400">
                            "{item.customization.additionalItemReason}"
                          </p>
                        </div>
                      )}
                      
                      <div className="flex gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <span className="text-primary">⏱️</span>
                          {item.estimatedTime}
                        </span>
                        {item.materials && (
                          <span className="flex items-center gap-1">
                            <span className="text-primary">🛠️</span>
                            {item.materials.slice(0, 2).join(', ')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 items-end">
                      {/* Additional Request Badge */}
                      {item.customization?.isAdditionalRequest && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-amber-500/20 border border-amber-500/50 rounded-full">
                          <AlertCircle className="w-3 h-3 text-amber-500" />
                          <span className="text-xs font-medium text-amber-500">
                            {language === 'en' ? 'Additional Request' : '額外請求'}
                          </span>
                        </div>
                      )}

                      {/* Remove Button */}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeFromCart(item.cartItemId || item.id)}
                        className="rounded-full"
                      >
                        {language === 'en' ? 'Remove' : '移除'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Cart Summary */}
          <div>
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-6 pb-4 border-b border-border">
                  {language === 'en' ? 'Order Summary' : '訂單摘要'}
                </h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      {language === 'en' ? 'Selected Gifts:' : '已選禮物：'}
                    </span>
                    <Badge variant="default" className="text-lg px-4 py-1">
                      {cart.length}
                    </Badge>
                  </div>
                  {cart.some(item => item.customization?.isAdditionalRequest) && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        {language === 'en' ? 'Pending Approval:' : '待審核：'}
                      </span>
                      <Badge variant="outline" className="text-lg px-4 py-1 border-amber-500 text-amber-500">
                        {cart.filter(item => item.customization?.isAdditionalRequest).length}
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={handleCheckout} 
                    className="w-full"
                    size="lg"
                  >
                    {user ? (
                      <><Gift className="w-5 h-5 mr-2 inline" /> {language === 'en' ? 'Confirm Your Gift' : '確認您的禮物'}</>
                    ) : (
                      <><Lock className="w-5 h-5 mr-2 inline" /> {language === 'en' ? 'Login to Checkout' : '登入結帳'}</>
                    )}
                  </Button>
                  
                  <Link to="/list" className="block">
                    <Button variant="outline" className="w-full" size="lg">
                      ← {language === 'en' ? 'Continue Shopping' : '繼續選購'}
                    </Button>
                  </Link>
                </div>

                {!user && (
                  <div className="mt-6 p-4 bg-primary/10 border border-primary/30 rounded-lg">
                    <p className="text-sm text-primary flex items-center gap-2">
                      <Lightbulb className="w-5 h-5" />
                      {language === 'en' ? 'Login to save your cart and submit your request!' : '登入以保存購物車並提交請求！'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
