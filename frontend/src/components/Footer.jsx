import { Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

function Footer({ isHomePage }) {
  const { language } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`relative ${isHomePage ? 'z-[3] dark:text-white' : 'z-[1]'} bg-white/20 dark:bg-white/[0.08] backdrop-blur-md`}>
      <div className="max-w-[1400px] mx-auto px-6 py-4">
        <p className={`text-sm flex items-center justify-center gap-1 ${isHomePage ? 'text-muted-foreground dark:text-white' : 'text-muted-foreground'}`}>
          © {currentYear} Made with
          <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
          {language === 'en' ? 'by Ariel' : '由 Ariel'}
        </p>
      </div>
    </footer>
  );
}

export default Footer;
