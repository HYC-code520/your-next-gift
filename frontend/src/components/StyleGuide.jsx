import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

const brandColors = [
  { name: 'Intense Blue', hex: '#88A2FF' },
  { name: 'Neon Green', hex: '#E2FC87' },
  { name: 'Deep Blue', hex: '#253A82' },
  { name: 'Bright Pink', hex: '#FFB2F7' },
  { name: 'Light Blue', hex: '#C0E0FF' },
  { name: 'Intense Purple', hex: '#AB9DFF' },
];

function ColorSwatch({ name, hex }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine if text should be dark or light based on background
  const isLightColor = (color) => {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
  };

  const textColor = isLightColor(hex) ? '#253A82' : '#FFFFFF';

  return (
    <button
      onClick={copyToClipboard}
      className="group relative aspect-square rounded-xl transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      style={{ backgroundColor: hex }}
    >
      <div
        className="absolute inset-0 flex flex-col items-center justify-center p-4"
        style={{ color: textColor }}
      >
        <span className="text-lg font-semibold mb-1">{name}</span>
        <span className="text-sm opacity-80 font-mono">{hex}</span>
        <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
          {copied ? (
            <Check className="w-5 h-5" />
          ) : (
            <Copy className="w-5 h-5" />
          )}
        </div>
      </div>
    </button>
  );
}

function StyleGuide() {
  const { language } = useLanguage();

  return (
    <div className="flex-1">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2 text-center">
          {language === 'en' ? 'Style Guide' : '風格指南'}
        </h1>
        <p className="text-muted-foreground text-center mb-8">
          {language === 'en' ? 'Brand colors and design tokens' : '品牌顏色與設計標準'}
        </p>

        {/* Color Palette */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'Color Palette' : '色彩調色盤'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-6">
              {language === 'en'
                ? 'Click on any color to copy its hex code.'
                : '點擊任何顏色以複製其十六進位代碼。'}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {brandColors.map((color) => (
                <ColorSwatch key={color.hex} name={color.name} hex={color.hex} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default StyleGuide;
