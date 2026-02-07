import { useState, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Upload, X, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';

// Auto-compress and resize any image to keep canvas performant
// Accepts any size input — no hard limit needed
const compressImage = (file, maxDim = 2000) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      // Compress to JPEG at 0.85 quality — typically brings even 20MB+ photos under 1MB
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(img.src);
          resolve(blob);
        },
        'image/jpeg',
        0.85
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      resolve(file);
    };
    img.src = URL.createObjectURL(file);
  });
};

function RoomUpload({ productPreviewUrl, onUpload }) {
  const { language } = useLanguage();
  const [preview, setPreview] = useState(null);
  const [processing, setProcessing] = useState(false);
  const inputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert(language === 'en' ? 'Please select an image file' : '請選擇圖片檔案');
      return;
    }

    setProcessing(true);
    try {
      const compressed = await compressImage(file);
      const objectUrl = URL.createObjectURL(compressed);
      setPreview(objectUrl);
    } finally {
      setProcessing(false);
    }
  };

  const handleRemove = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleContinue = () => {
    if (preview) {
      onUpload(preview);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-1">
          {language === 'en' ? 'Upload a room photo' : '上傳房間照片'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {language === 'en'
            ? 'Take a photo of your room, desk, or wherever you want to place the product'
            : '拍攝你想放置產品的房間、桌面或其他地方的照片'}
        </p>
      </div>

      {/* Product preview reminder */}
      <div className="flex justify-center mb-6">
        <div className="checkerboard-bg rounded-lg p-3 border border-border inline-block">
          <img
            src={productPreviewUrl}
            alt="Product"
            className="h-24 object-contain"
          />
        </div>
      </div>

      {/* Upload area */}
      {!preview ? (
        <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-all">
          {processing ? (
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <span className="text-sm text-muted-foreground">
                {language === 'en' ? 'Optimizing image...' : '正在優化圖片...'}
              </span>
            </div>
          ) : (
            <>
              <Upload className="w-10 h-10 text-muted-foreground mb-3" />
              <span className="text-sm font-medium text-foreground">
                {language === 'en' ? 'Click to upload room photo' : '點擊上傳房間照片'}
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                {language === 'en' ? 'Any size — auto-compressed for you' : '任何大小 — 自動壓縮'}
              </span>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
      ) : (
        <div className="relative rounded-xl overflow-hidden border border-border">
          <img
            src={preview}
            alt="Room preview"
            className="w-full max-h-[50vh] object-contain bg-muted"
          />
          <button
            onClick={handleRemove}
            className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {preview && (
        <div className="mt-6 flex justify-center">
          <Button onClick={handleContinue} size="lg">
            {language === 'en' ? 'Place product in room' : '將產品放入房間'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}

export default RoomUpload;
