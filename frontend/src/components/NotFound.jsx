import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Home, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import '../styles/NotFound.css';

function NotFound() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full animate-fade-in">
        <CardContent className="pt-12 pb-12 flex flex-col items-center text-center">
          {/* 404 Animation */}
          <div className="mb-8">
            <div className="text-[150px] font-bold text-primary/20 leading-none">
              404
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-4xl font-bold mb-4">
            {t('pageNotFoundTitle')}
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            {t('pageNotFoundDescription')}
          </p>

          {/* Action Buttons */}
          <Button
            onClick={() => navigate('/')}
            size="lg"
            variant="default"
          >
            <Home className="w-5 h-5 mr-2" />
            {t('goHome')}
          </Button>

          {/* Helpful Links */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">
              {t('popularPages')}
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => navigate('/list')}
                className="text-sm text-primary hover:underline"
              >
                {t('list')}
              </button>
              <span className="text-muted-foreground">•</span>
              <button
                onClick={() => navigate('/birthdays')}
                className="text-sm text-primary hover:underline"
              >
                {t('birthdays')}
              </button>
              <span className="text-muted-foreground">•</span>
              <button
                onClick={() => navigate('/about')}
                className="text-sm text-primary hover:underline"
              >
                {t('about')}
              </button>
              <span className="text-muted-foreground">•</span>
              <button
                onClick={() => navigate('/faq')}
                className="text-sm text-primary hover:underline"
              >
                {t('faq')}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default NotFound;
