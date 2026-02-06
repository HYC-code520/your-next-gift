import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

function OrderWindowBanner() {
  const { orderWindowInfo, userBirthday } = useCart();
  const { user } = useAuth();

  if (!userBirthday) {
    return (
      <div className="mb-6 p-5 bg-amber-500/10 border border-amber-500/30 rounded-xl">
        <div className="flex flex-col items-center text-center gap-2">
          <AlertCircle className="w-8 h-8 text-amber-600" />
          <p className="font-semibold text-amber-900 dark:text-amber-100 text-lg">
            Set your birthday to get started
          </p>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            {user ? (
              <>
                Go to your{' '}
                <Link
                  to="/profile"
                  className="text-amber-800 dark:text-amber-200 font-semibold underline hover:no-underline transition-colors"
                >
                  Profile
                </Link>
                {' '}to add your birthday.
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-amber-800 dark:text-amber-200 font-semibold underline hover:no-underline transition-colors"
                >
                  Login
                </Link>
                {' '}to continue.
              </>
            )}
          </p>
        </div>
      </div>
    );
  }

  if (!orderWindowInfo) return null;

  const { message, canOrder } = orderWindowInfo;

  if (canOrder) {
    return (
      <div className="bg-[#CCE5FF]/30 border border-[#CCE5FF] p-5 mb-6 rounded-xl animate-in fade-in duration-300">
        <div className="flex flex-col items-center text-center gap-2">
          <CheckCircle className="w-8 h-8 text-[#4A90A4]" />
          <p className="font-semibold text-[#1a3a4a] dark:text-[#CCE5FF] text-lg">
            You're ready to order your birthday gift!
          </p>
          <p className="text-sm text-[#3a6a7a] dark:text-[#a8d4e6]">
            {message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-500/10 border border-blue-500/30 p-5 mb-6 rounded-xl">
      <div className="flex flex-col items-center text-center gap-2">
        <Calendar className="w-8 h-8 text-blue-600" />
        <p className="font-semibold text-blue-900 dark:text-blue-100 text-lg">
          Order Window Status
        </p>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          {message}
        </p>
      </div>
    </div>
  );
}

export default OrderWindowBanner;
