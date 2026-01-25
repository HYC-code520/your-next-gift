import { Gift } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

function LoadingState() {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        {/* Animated gift icon */}
        <div className="relative mb-8">
          <div className="relative inline-block">
            <Gift className="w-20 h-20 text-primary animate-bounce" />
          </div>
        </div>

        {/* Loading text */}
        <h2 className="text-2xl font-bold text-foreground mb-3">
          {language === 'en' ? 'Loading Magic...' : '載入中...'}
        </h2>
        <p className="text-muted-foreground mb-6">
          {language === 'en' 
            ? 'Preparing your DIY wishlist' 
            : '正在準備您的 DIY 願望清單'
          }
        </p>

        {/* Animated dots */}
        <div className="flex justify-center gap-2">
          <div 
            className="w-3 h-3 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: '0s' }}
          ></div>
          <div 
            className="w-3 h-3 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: '0.15s' }}
          ></div>
          <div 
            className="w-3 h-3 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: '0.3s' }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default LoadingState;
