import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Check } from 'lucide-react';
import { Button } from '../ui/button';

function ImagePicker({ images, onSelect }) {
  const { language } = useLanguage();
  const [selected, setSelected] = useState(null);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-1">
          {language === 'en' ? 'Pick a product image' : '選擇產品圖片'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {language === 'en'
            ? 'Choose the image with the clearest view of the product'
            : '選擇產品最清晰的圖片'}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelected(image)}
            className={`relative aspect-square rounded-xl overflow-hidden border-3 transition-all hover:scale-[1.02] ${
              selected === image
                ? 'border-primary ring-4 ring-primary/20 scale-[1.02]'
                : 'border-transparent hover:border-primary/30'
            }`}
          >
            <img
              src={image}
              alt={`Option ${index + 1}`}
              className={`w-full h-full object-cover transition-all ${
                selected && selected !== image ? 'opacity-40' : ''
              }`}
              onError={(e) => {
                e.target.src = '/images/placeholder.png';
              }}
            />
            {selected === image && (
              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                <Check className="w-3.5 h-3.5" />
              </div>
            )}
          </button>
        ))}
      </div>

      {selected && (
        <div className="mt-6 flex justify-center">
          <Button onClick={() => onSelect(selected)} size="lg">
            {language === 'en' ? 'Use this image' : '使用此圖片'}
          </Button>
        </div>
      )}
    </div>
  );
}

export default ImagePicker;
