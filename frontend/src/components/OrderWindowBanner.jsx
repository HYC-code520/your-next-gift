import { useCart } from '../context/CartContext';
import { Calendar, AlertCircle, CheckCircle } from 'lucide-react';

function OrderWindowBanner() {
  const { orderWindowInfo, userBirthday } = useCart();

  if (!userBirthday) {
    return (
      <div className="bg-[#F4C7D6]/20 border-l-4 border-[#F4C7D6] p-4 mb-6 rounded-r-lg">
        <div className="flex flex-col items-center gap-3 text-center">
          <AlertCircle className="w-5 h-5 text-[#E89BB5]" />
          <div>
            <p className="font-semibold text-[#D67A9A] dark:text-[#F4C7D6]">
              Birthday Required
            </p>
            <p className="text-sm text-[#E89BB5] dark:text-[#F4C7D6]/90 mt-1">
              Please set your birthday in your profile to order birthday gifts.
            </p>
          </div>
        </div>
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
