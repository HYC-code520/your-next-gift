import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

function OrderWindowBanner() {
  const { orderWindowInfo, userBirthday } = useCart();
  const { user } = useAuth();

  if (!userBirthday) {
    return (
      <div className="mb-6 p-3 bg-primary/5 border border-primary/20 rounded-lg text-center">
        <p className="text-sm text-foreground">
          Please set your birthday to order birthday gifts.
          {!user && (
            <>
              {' '}
              <Link 
                to="/login" 
                className="text-primary font-medium hover:underline transition-colors"
              >
                Login
              </Link>
              {' '}to continue.
            </>
          )}
        </p>
      </div>
    );
  }

  if (!orderWindowInfo) return null;

  const { message, canOrder } = orderWindowInfo;

  if (canOrder) {
    return (
      <div className="bg-green-500/10 border-l-4 border-green-500 p-4 mb-6 rounded-r-lg animate-in slide-in-from-left duration-300">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-green-900 dark:text-green-100">
              Order Window Open! 🎉
            </p>
            <p className="text-sm text-green-800 dark:text-green-200 mt-1">
              {message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-500/10 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
      <div className="flex items-start gap-3">
        <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-blue-900 dark:text-blue-100">
            Order Window Status
          </p>
          <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

export default OrderWindowBanner;
