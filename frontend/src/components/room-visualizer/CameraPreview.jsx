import { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Camera, Download, ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';

function CameraPreview({ productPreviewUrl, onBack }) {
  const { language } = useLanguage();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const containerRef = useRef(null);
  const productRef = useRef(null);

  const [cameraReady, setCameraReady] = useState(false);
  const [error, setError] = useState(null);
  const [captured, setCaptured] = useState(null);

  // Product position & size state
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState(120);
  const dragRef = useRef({ dragging: false, startX: 0, startY: 0, startPosX: 0, startPosY: 0 });
  const pinchRef = useRef({ pinching: false, startDist: 0, startSize: 0 });

  // Start camera
  useEffect(() => {
    let mounted = true;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
        });
        if (!mounted) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            setCameraReady(true);
            // Center the product
            const rect = videoRef.current.getBoundingClientRect();
            setPos({ x: rect.width / 2 - 60, y: rect.height / 2 - 60 });
          };
        }
      } catch (err) {
        if (!mounted) return;
        if (err.name === 'NotAllowedError') {
          setError(language === 'en' ? 'Camera permission denied. Please allow camera access and try again.' : '相機權限被拒絕。請允許相機存取後重試。');
        } else if (err.name === 'NotFoundError') {
          setError(language === 'en' ? 'No camera found on this device.' : '在此裝置上找不到相機。');
        } else {
          setError(language === 'en' ? 'Could not access camera.' : '無法存取相機。');
        }
      }
    }

    startCamera();

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

  // Touch drag handlers
  const handleTouchStart = useCallback((e) => {
    if (e.touches.length === 2) {
      // Pinch start
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      pinchRef.current = { pinching: true, startDist: dist, startSize: size };
      dragRef.current.dragging = false;
      e.preventDefault();
      return;
    }

    const touch = e.touches[0];
    dragRef.current = {
      dragging: true,
      startX: touch.clientX,
      startY: touch.clientY,
      startPosX: pos.x,
      startPosY: pos.y
    };
    e.preventDefault();
  }, [pos, size]);

  const handleTouchMove = useCallback((e) => {
    if (pinchRef.current.pinching && e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scale = dist / pinchRef.current.startDist;
      const newSize = Math.max(40, Math.min(400, pinchRef.current.startSize * scale));
      setSize(newSize);
      e.preventDefault();
      return;
    }

    if (!dragRef.current.dragging) return;
    const touch = e.touches[0];
    const dx = touch.clientX - dragRef.current.startX;
    const dy = touch.clientY - dragRef.current.startY;
    setPos({
      x: dragRef.current.startPosX + dx,
      y: dragRef.current.startPosY + dy
    });
    e.preventDefault();
  }, []);

  const handleTouchEnd = useCallback(() => {
    dragRef.current.dragging = false;
    pinchRef.current.pinching = false;
  }, []);

  // Mouse drag handlers (for desktop testing)
  const handleMouseDown = useCallback((e) => {
    dragRef.current = {
      dragging: true,
      startX: e.clientX,
      startY: e.clientY,
      startPosX: pos.x,
      startPosY: pos.y
    };
    e.preventDefault();
  }, [pos]);

  const handleMouseMove = useCallback((e) => {
    if (!dragRef.current.dragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setPos({
      x: dragRef.current.startPosX + dx,
      y: dragRef.current.startPosY + dy
    });
  }, []);

  const handleMouseUp = useCallback(() => {
    dragRef.current.dragging = false;
  }, []);

  // Scroll wheel to resize on desktop
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    setSize(prev => Math.max(40, Math.min(400, prev - e.deltaY * 0.5)));
  }, []);

  // Capture screenshot
  const handleCapture = useCallback(() => {
    const video = videoRef.current;
    const product = productRef.current;
    if (!video || !product) return;

    const canvas = document.createElement('canvas');
    const videoRect = video.getBoundingClientRect();
    const scaleX = video.videoWidth / videoRect.width;
    const scaleY = video.videoHeight / videoRect.height;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');

    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Draw product at current position/size
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(
        img,
        pos.x * scaleX,
        pos.y * scaleY,
        size * scaleX,
        size * scaleY
      );
      const dataUrl = canvas.toDataURL('image/png');
      setCaptured(dataUrl);
    };
    img.src = productPreviewUrl;
  }, [pos, size, productPreviewUrl]);

  // Download captured image
  const handleDownload = useCallback(() => {
    if (!captured) return;
    const a = document.createElement('a');
    a.href = captured;
    a.download = `room-preview-${Date.now()}.png`;
    a.click();
  }, [captured]);

  // Error state
  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="w-7 h-7 text-destructive" />
        </div>
        <h3 className="text-lg font-bold mb-2">
          {language === 'en' ? 'Camera Unavailable' : '相機不可用'}
        </h3>
        <p className="text-sm text-muted-foreground mb-6">{error}</p>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {language === 'en' ? 'Go back' : '返回'}
        </Button>
      </div>
    );
  }

  // Captured state - show screenshot
  if (captured) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold">
            {language === 'en' ? 'Preview Captured!' : '預覽已截圖！'}
          </h3>
        </div>
        <div className="rounded-xl overflow-hidden border border-border mb-6">
          <img src={captured} alt="Captured preview" className="w-full" />
        </div>
        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={() => setCaptured(null)}>
            <Camera className="w-4 h-4 mr-2" />
            {language === 'en' ? 'Retake' : '重拍'}
          </Button>
          <Button onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            {language === 'en' ? 'Download' : '下載'}
          </Button>
        </div>
      </div>
    );
  }

  // Live camera view
  return (
    <div className="flex flex-col flex-1">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          {language === 'en' ? 'Back' : '返回'}
        </Button>
        <p className="text-xs text-muted-foreground">
          {language === 'en' ? 'Drag to move \u2022 Scroll/Pinch to resize' : '拖動移動 \u2022 滾輪/捏合縮放'}
        </p>
      </div>

      {/* Camera + overlay container */}
      <div
        ref={containerRef}
        className="relative flex-1 overflow-hidden bg-black"
        style={{ touchAction: 'none' }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Video feed */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />

        {/* Loading spinner */}
        {!cameraReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-center">
              <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-white text-sm">
                {language === 'en' ? 'Starting camera...' : '正在啟動相機...'}
              </p>
            </div>
          </div>
        )}

        {/* Product overlay */}
        {cameraReady && (
          <img
            ref={productRef}
            src={productPreviewUrl}
            alt="Product"
            className="absolute cursor-grab active:cursor-grabbing select-none"
            style={{
              left: pos.x,
              top: pos.y,
              width: size,
              height: 'auto',
              filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))',
              zIndex: 10
            }}
            draggable={false}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onWheel={handleWheel}
          />
        )}
      </div>

      {/* Capture button */}
      {cameraReady && (
        <div className="flex justify-center py-4 bg-black/80 backdrop-blur-sm">
          <button
            onClick={handleCapture}
            className="w-16 h-16 rounded-full border-4 border-white bg-white/20 hover:bg-white/40 active:scale-95 transition-all flex items-center justify-center"
          >
            <div className="w-12 h-12 rounded-full bg-white" />
          </button>
        </div>
      )}
    </div>
  );
}

export default CameraPreview;
