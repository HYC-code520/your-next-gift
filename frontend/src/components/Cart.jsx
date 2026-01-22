import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, CreditCard, Lock, Lightbulb } from 'lucide-react';
import PageBanner from './PageBanner';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

function Cart() {
  const { cart, removeFromCart, updateQuantity, getCartCount } = useCart();
  const { user } = useAuth();
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
      <div className="min-h-screen bg-gradient-to-b from-spotify-gray to-spotify-black">
        <PageBanner title="Your Cart" />
        <div className="max-w-4xl mx-auto px-4 py-20 animate-fade-in">
          <Card className="text-center py-20 glass">
            <CardContent className="pt-6">
              <ShoppingCart className="w-32 h-32 mx-auto mb-6 animate-scale-in text-spotify-green" />
              <h2 className="text-3xl font-bold mb-3 text-white">Your cart is empty</h2>
              <p className="text-spotify-light-gray mb-8 text-lg">Browse our amazing DIY projects and start creating!</p>
              <Link to="/list">
                <Button size="lg" variant="play" className="px-12">
                  Explore Projects
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-spotify-gray to-spotify-black">
      <PageBanner title={`Your Cart (${getCartCount()} items)`} />
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
                      {item.customization && (item.customization.colors?.length > 0 || item.customization.size || item.customization.personalization) && (
                        <div className="bg-primary/10 rounded-lg p-3 mb-3 space-y-1">
                          <p className="text-xs font-semibold text-primary mb-1">✨ Customization:</p>
                          {item.customization.colors?.length > 0 && (
                            <p className="text-xs">
                              <span className="font-medium">Colors:</span> {item.customization.colors.join(', ')}
                            </p>
                          )}
                          {item.customization.size && (
                            <p className="text-xs">
                              <span className="font-medium">Size:</span> {item.customization.size}
                            </p>
                          )}
                          {item.customization.personalization && (
                            <p className="text-xs">
                              <span className="font-medium">Text:</span> "{item.customization.personalization}"
                            </p>
                          )}
                          {item.customization.specialRequests && (
                            <p className="text-xs">
                              <span className="font-medium">Notes:</span> {item.customization.specialRequests}
                            </p>
                          )}
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
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-spotify-black rounded-full p-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => updateQuantity(item.cartItemId || item.id, item.quantity - 1)}
                        >
                          <span className="text-lg">−</span>
                        </Button>
                        <Badge variant="default" className="min-w-[2.5rem] justify-center px-3">
                          {item.quantity || 1}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => updateQuantity(item.cartItemId || item.id, item.quantity + 1)}
                        >
                          <span className="text-lg">+</span>
                        </Button>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeFromCart(item.cartItemId || item.id)}
                        className="rounded-full"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Cart Summary */}
          <div>
            <Card className="sticky top-20 glass">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-6 pb-4 border-b border-white/10 text-white">
                  Cart Summary
                </h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-spotify-light-gray">Total Items:</span>
                    <Badge variant="default" className="text-lg px-4 py-1">
                      {getCartCount()}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-spotify-light-gray">Projects:</span>
                    <Badge variant="secondary" className="text-lg px-4 py-1">
                      {cart.length}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={handleCheckout} 
                    className="w-full"
                    size="lg"
                    variant="play"
                  >
                    {user ? (
                      <><CreditCard className="w-5 h-5 mr-2 inline" /> Proceed to Checkout</>
                    ) : (
                      <><Lock className="w-5 h-5 mr-2 inline" /> Login to Checkout</>
                    )}
                  </Button>
                  
                  <Link to="/list" className="block">
                    <Button variant="outline" className="w-full" size="lg">
                      ← Continue Shopping
                    </Button>
                  </Link>
                </div>

                {!user && (
                  <div className="mt-6 p-4 bg-spotify-green/10 border border-spotify-green/30 rounded-lg backdrop-blur-sm">
                    <p className="text-sm text-spotify-green flex items-center gap-2">
                      <Lightbulb className="w-5 h-5" />
                      Login to save your cart and submit your request!
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
