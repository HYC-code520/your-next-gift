import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { X, Check, Image, Crop, Eraser, Home, Move } from 'lucide-react';
import ImagePicker from './ImagePicker';
import ImageCropper from './ImageCropper';
import BgRemoval from './BgRemoval';
import RoomUpload from './RoomUpload';
import CanvasEditor from './CanvasEditor';
import '../../styles/RoomVisualizer.css';

const STEPS = ['pick-image', 'crop', 'bg-removal', 'room-upload', 'canvas'];

const STEP_ICONS = [Image, Crop, Eraser, Home, Move];


function RoomVisualizer({ isOpen, onClose, projectId, projectName, images }) {
  const { language } = useLanguage();

  const [step, setStep] = useState('pick-image');
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [croppedBlob, setCroppedBlob] = useState(null);
  const [transparentBlob, setTransparentBlob] = useState(null);
  const [transparentPreviewUrl, setTransparentPreviewUrl] = useState(null);
  const [roomImageUrl, setRoomImageUrl] = useState(null);

  // Cleanup object URLs on unmount or close
  const cleanup = useCallback(() => {
    if (transparentPreviewUrl) URL.revokeObjectURL(transparentPreviewUrl);
    if (roomImageUrl) URL.revokeObjectURL(roomImageUrl);
  }, [transparentPreviewUrl, roomImageUrl]);

  useEffect(() => {
    if (!isOpen) {
      cleanup();
      setStep('pick-image');
      setSelectedImageUrl(null);
      setCroppedBlob(null);
      setTransparentBlob(null);
      setTransparentPreviewUrl(null);
      setRoomImageUrl(null);
    }
  }, [isOpen]);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Scroll to top when visualizer opens or step changes
  useEffect(() => {
    if (isOpen) {
      window.scrollTo({ top: 0 });
    }
  }, [isOpen, step]);

  const currentStepIndex = STEPS.indexOf(step);

  // Step handlers
  const handleImageSelect = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setStep('crop');
  };

  const handleCropComplete = (blob) => {
    setCroppedBlob(blob);
    setStep('bg-removal');
  };

  const handleCropSkip = async () => {
    try {
      const response = await fetch(selectedImageUrl);
      const blob = await response.blob();
      setCroppedBlob(blob);
      setStep('bg-removal');
    } catch {
      setCroppedBlob(null);
      setStep('bg-removal');
    }
  };

  const handleBgRemovalComplete = (blob) => {
    setTransparentBlob(blob);
    if (transparentPreviewUrl) URL.revokeObjectURL(transparentPreviewUrl);
    setTransparentPreviewUrl(URL.createObjectURL(blob));
    setStep('room-upload');
  };

  const handleRoomUpload = (objectUrl) => {
    if (roomImageUrl) URL.revokeObjectURL(roomImageUrl);
    setRoomImageUrl(objectUrl);
    setStep('canvas');
  };

  const handleRedo = () => {
    setStep('pick-image');
    setSelectedImageUrl(null);
    setCroppedBlob(null);
    setTransparentBlob(null);
    if (transparentPreviewUrl) URL.revokeObjectURL(transparentPreviewUrl);
    setTransparentPreviewUrl(null);
  };

  if (!isOpen) return null;

  return (
    <div className="flex flex-col min-h-[calc(100vh-70px)] bg-background">
      {/* Sub-header with steps */}
      <div className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto w-full px-6 flex items-center justify-center py-3 relative">
          {/* Step indicator */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {STEPS.map((s, i) => {
              const Icon = STEP_ICONS[i];
              const isCompleted = i < currentStepIndex;
              const isCurrent = i === currentStepIndex;
              return (
                <div key={s} className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={() => isCompleted && setStep(STEPS[i])}
                    disabled={!isCompleted}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-primary text-primary-foreground cursor-pointer hover:ring-2 hover:ring-primary/40 hover:scale-110'
                        : isCurrent
                        ? 'bg-primary text-primary-foreground ring-2 ring-primary/30'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                  </button>
                  {i < STEPS.length - 1 && (
                    <div className={`w-3 sm:w-6 h-0.5 ${isCompleted ? 'bg-primary' : 'bg-border'}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-0 p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-6">
        {step === 'pick-image' && (
          <ImagePicker
            images={images}
            onSelect={handleImageSelect}
          />
        )}

        {step === 'crop' && selectedImageUrl && (
          <ImageCropper
            imageUrl={selectedImageUrl}
            onCropComplete={handleCropComplete}
            onSkip={handleCropSkip}
          />
        )}

        {step === 'bg-removal' && (croppedBlob || selectedImageUrl) && (
          <BgRemoval
            imageBlob={croppedBlob}
            imageUrl={selectedImageUrl}
            onComplete={handleBgRemovalComplete}
            onRedo={handleRedo}
          />
        )}

        {step === 'room-upload' && transparentPreviewUrl && (
          <RoomUpload
            productPreviewUrl={transparentPreviewUrl}
            onUpload={handleRoomUpload}
          />
        )}

        {step === 'canvas' && transparentBlob && roomImageUrl && (
          <CanvasEditor
            productBlob={transparentBlob}
            roomImageUrl={roomImageUrl}
            onClose={onClose}
            onBack={() => setStep('room-upload')}
          />
        )}
      </div>
    </div>
  );
}

export default RoomVisualizer;
