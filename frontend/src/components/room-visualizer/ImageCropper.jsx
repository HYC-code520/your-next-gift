import { useState, useRef, useCallback } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useLanguage } from '../../context/LanguageContext';
import { SkipForward, Crop, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';

function ImageCropper({ imageUrl, onCropComplete, onSkip }) {
  const { language } = useLanguage();
  const imgRef = useRef(null);
  const [crop, setCrop] = useState({
    unit: '%',
    width: 80,
    height: 80,
    x: 10,
    y: 10,
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [loading, setLoading] = useState(false);

  const onImageLoad = useCallback((e) => {
    imgRef.current = e.currentTarget;
  }, []);

  const getCroppedBlob = async () => {
    if (!imgRef.current || !completedCrop) return null;

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/png');
    });
  };

  const handleCrop = async () => {
    setLoading(true);
    const blob = await getCroppedBlob();
    if (blob) {
      onCropComplete(blob);
    }
    // Don't setLoading(false) — parent will unmount this component
  };

  const handleSkip = () => {
    setLoading(true);
    onSkip();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-1">
          {language === 'en' ? 'Crop the product area' : '裁切產品區域'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {language === 'en'
            ? 'Drag the corners to crop around just the product for best results'
            : '拖曳邊角裁切產品周圍以獲得最佳效果'}
        </p>
      </div>

      <div className="flex justify-center mb-6">
        <div className="max-w-lg w-full rounded-xl overflow-hidden border border-border bg-muted">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
          >
            <img
              src={imageUrl}
              alt="Crop"
              onLoad={onImageLoad}
              className="max-w-full max-h-[60vh] mx-auto"
              crossOrigin="anonymous"
            />
          </ReactCrop>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">
            {language === 'en' ? 'Preparing image...' : '正在準備圖片...'}
          </p>
        </div>
      ) : (
        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={handleSkip} className="border-border text-foreground hover:bg-muted">
            <SkipForward className="w-4 h-4 mr-2" />
            {language === 'en' ? 'Skip (use full image)' : '跳過（使用完整圖片）'}
          </Button>
          <Button onClick={handleCrop} disabled={!completedCrop}>
            <Crop className="w-4 h-4 mr-2" />
            {language === 'en' ? 'Crop & Continue' : '裁切並繼續'}
          </Button>
        </div>
      )}
    </div>
  );
}

export default ImageCropper;
