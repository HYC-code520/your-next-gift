import { Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

function Footer() {
  const { language } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Made with love */}
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            {language === 'en' ? 'Made with' : '用'}
            <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
            {language === 'en' ? 'by Ariel' : '由 Ariel 製作'}
          </p>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © {currentYear} DIY Gifts
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
