import { Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import '../styles/AnnouncementBar.css';

function AnnouncementBar() {
  const { t } = useLanguage();
  
  return (
    <div className="announcement-bar">
      <p className="flex items-center justify-center gap-2">
        {t('welcomeMessage')}
        <Sparkles className="w-5 h-5 inline" />
      </p>
    </div>
  );
}

export default AnnouncementBar;
