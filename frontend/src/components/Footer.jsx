import { Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

function Footer({ isHomePage }) {
  const { language } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`${isHomePage ? 'footer-home z-[3]' : 'relative z-[1]'} py-3`}>
      <p className="text-xs flex items-center justify-center gap-1 text-black/40 dark:text-white/40">
        © {currentYear} Made with
        <Heart className="w-3 h-3 text-pink-400/60 fill-pink-400/60" />
        {language === 'en' ? 'by Ariel' : '由 Ariel'}
      </p>
    </footer>
  );
}

export default Footer;
