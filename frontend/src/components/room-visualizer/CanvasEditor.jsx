import { useEffect, useRef, useState, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Download, FlipHorizontal2, RotateCcw } from 'lucide-react';
import { Button } from '../ui/button';

function CanvasEditor({ productBlob, roomImageUrl, onClose, onBack }) {
  const { language } = useLanguage();
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const productObjRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Initialize Fabric.js canvas
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      // Dynamic import for code splitting
      const fabric = await import('fabric');
      if (cancelled) return;

      const container = containerRef.current;
      if (!container || !canvasRef.current) return;

      const width = container.clientWidth;
      // Calculate available height: viewport minus navbar(~70), sub-header(~50), toolbar(~50)
      const height = window.innerHeight - 230;

      const canvas = new fabric.Canvas(canvasRef.current, {
        width,
        height,
        backgroundColor: 'transparent',
        selection: false,
      });
      fabricCanvasRef.current = canvas;

      // Load room image as background
      const roomImg = await fabric.FabricImage.fromURL(roomImageUrl, { crossOrigin: 'anonymous' });
      if (cancelled) return;

      // Scale room image to fit inside canvas (show full photo)
      const scaleX = width / roomImg.width;
      const scaleY = height / roomImg.height;
      const scale = Math.min(scaleX, scaleY);

      roomImg.set({
        scaleX: scale,
        scaleY: scale,
        originX: 'center',
        originY: 'center',
        left: width / 2,
        top: height / 2,
        selectable: false,
        evented: false,
      });
      canvas.add(roomImg);
      canvas.sendObjectToBack(roomImg);

      // Load product image
      const productUrl = URL.createObjectURL(productBlob);
      const productImg = await fabric.FabricImage.fromURL(productUrl, { crossOrigin: 'anonymous' });
      URL.revokeObjectURL(productUrl);
      if (cancelled) return;

      // Scale product to ~30% of canvas width
      const productScale = (width * 0.3) / Math.max(productImg.width, productImg.height);
      productImg.set({
        scaleX: productScale,
        scaleY: productScale,
        left: width / 2,
        top: height / 2,
        originX: 'center',
        originY: 'center',
        cornerColor: '#9BA8E5',
        cornerStrokeColor: '#9BA8E5',
        borderColor: '#9BA8E5',
        cornerSize: 12,
        transparentCorners: false,
        cornerStyle: 'circle',
        padding: 8,
      });

      canvas.add(productImg);
      canvas.setActiveObject(productImg);
      productObjRef.current = productImg;
      canvas.renderAll();
      setReady(true);
    };

    init();

    return () => {
      cancelled = true;
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, [productBlob, roomImageUrl]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = fabricCanvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const width = container.clientWidth;
      const height = window.innerHeight - 230;
      canvas.setDimensions({ width, height });
      canvas.renderAll();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFlip = () => {
    const obj = productObjRef.current;
    if (!obj) return;
    obj.set('flipX', !obj.flipX);
    fabricCanvasRef.current?.renderAll();
  };

  const handleReset = () => {
    const obj = productObjRef.current;
    const canvas = fabricCanvasRef.current;
    if (!obj || !canvas) return;

    const width = canvas.getWidth();
    const height = canvas.getHeight();
    const scale = (width * 0.3) / Math.max(obj.width, obj.height);

    obj.set({
      left: width / 2,
      top: height / 2,
      scaleX: scale,
      scaleY: scale,
      angle: 0,
      flipX: false,
      flipY: false,
    });
    canvas.setActiveObject(obj);
    canvas.renderAll();
  };

  const handleDownload = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    setDownloading(true);
    try {
      // Deselect to remove control handles from export
      canvas.discardActiveObject();
      canvas.renderAll();

      const dataUrl = canvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 2, // Higher res export
      });

      const link = document.createElement('a');
      link.download = 'room-preview.png';
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Re-select the product
      if (productObjRef.current) {
        canvas.setActiveObject(productObjRef.current);
        canvas.renderAll();
      }
    } finally {
      setDownloading(false);
    }
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Canvas container */}
      <div
        ref={containerRef}
        className="relative bg-background flex items-center justify-center overflow-hidden"
        style={{ touchAction: 'none', height: `calc(100vh - 230px)` }}
      >
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <canvas ref={canvasRef} className="block" />
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-center px-4 py-3 border-t border-border bg-card gap-3">
        <Button variant="outline" size="sm" onClick={handleReset} className="border-border text-foreground hover:bg-muted" title={language === 'en' ? 'Reset' : '重置'}>
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline ml-1.5">{language === 'en' ? 'Reset' : '重置'}</span>
        </Button>
        <Button variant="outline" size="sm" onClick={handleFlip} className="border-border text-foreground hover:bg-muted" title={language === 'en' ? 'Flip' : '翻轉'}>
          <FlipHorizontal2 className="w-4 h-4" />
          <span className="hidden sm:inline ml-1.5">{language === 'en' ? 'Flip' : '翻轉'}</span>
        </Button>
        <Button size="sm" onClick={handleDownload} disabled={downloading || !ready}>
          <Download className="w-4 h-4 mr-1.5" />
          {language === 'en' ? 'Download' : '下載'}
        </Button>
      </div>
    </div>
  );
}

export default CanvasEditor;
