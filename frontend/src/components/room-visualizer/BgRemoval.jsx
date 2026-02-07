import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Check, RotateCcw, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';

function BgRemoval({ imageBlob, imageUrl, onComplete, onRedo }) {
  const { language } = useLanguage();
  const [status, setStatus] = useState('idle'); // idle | processing | done | error
  const [phase, setPhase] = useState('');
  const [progress, setProgress] = useState(0);
  const [resultBlob, setResultBlob] = useState(null);
  const [resultPreviewUrl, setResultPreviewUrl] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const processedRef = useRef(false);

  const getPhaseMessage = (key) => {
    const messages = {
      en: {
        'fetch:onnx': 'Downloading AI model (first time only)...',
        'compute:inference': 'Analyzing your image...',
        'fetch': 'Loading resources...',
        default: 'Removing background...',
      },
      zh: {
        'fetch:onnx': '正在下載 AI 模型（僅首次需要）...',
        'compute:inference': '正在分析圖片...',
        'fetch': '正在載入資源...',
        default: '正在移除背景...',
      },
    };
    const lang = messages[language] || messages.en;
    // Match partial keys
    for (const [k, v] of Object.entries(lang)) {
      if (k !== 'default' && key && key.includes(k)) return v;
    }
    return lang.default;
  };

  useEffect(() => {
    if (processedRef.current) return;
    if (!imageBlob && !imageUrl) return;

    processedRef.current = true;
    runBgRemoval();
  }, [imageBlob, imageUrl]);

  const runBgRemoval = async () => {
    setStatus('processing');
    setProgress(0);
    setPhase('');

    try {
      // Dynamic import to keep bundle small
      const { removeBackground } = await import('@imgly/background-removal');

      let input = imageBlob;
      if (!input && imageUrl) {
        const res = await fetch(imageUrl);
        input = await res.blob();
      }

      const result = await removeBackground(input, {
        progress: (key, current, total) => {
          setPhase(key || '');
          if (total > 0) {
            setProgress(Math.round((current / total) * 100));
          }
        },
      });

      const blob = result instanceof Blob ? result : new Blob([result], { type: 'image/png' });
      setResultBlob(blob);
      setResultPreviewUrl(URL.createObjectURL(blob));
      setStatus('done');
    } catch (err) {
      console.error('Background removal failed:', err);
      setErrorMsg(err.message || 'Unknown error');
      setStatus('error');
    }
  };

  const handleRetry = () => {
    processedRef.current = false;
    setStatus('idle');
    setResultBlob(null);
    if (resultPreviewUrl) URL.revokeObjectURL(resultPreviewUrl);
    setResultPreviewUrl(null);
    setErrorMsg('');
    // Trigger re-run
    setTimeout(() => {
      processedRef.current = true;
      runBgRemoval();
    }, 0);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (resultPreviewUrl) URL.revokeObjectURL(resultPreviewUrl);
    };
  }, [resultPreviewUrl]);

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      {/* Processing State */}
      {status === 'processing' && (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center w-full max-w-sm">
            <h3 className="text-xl font-bold mb-2">
              {getPhaseMessage(phase)}
            </h3>
            {phase && phase.includes('fetch:onnx') && (
              <p className="text-xs text-muted-foreground mb-4">
                {language === 'en'
                  ? 'This may take ~10 seconds. The model is cached for next time.'
                  : '這可能需要約 10 秒。模型會被快取以供下次使用。'}
              </p>
            )}
            <div className="w-full bg-muted rounded-full h-1.5 mt-4 overflow-hidden">
              {progress > 0 ? (
                <div
                  className="bg-primary h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              ) : (
                <div className="bg-primary h-1.5 rounded-full w-1/3 animate-[shimmer_1.5s_ease-in-out_infinite]" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Done State */}
      {status === 'done' && resultPreviewUrl && (
        <div className="text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
            <Check className="w-7 h-7 text-green-500" />
          </div>
          <h3 className="text-lg font-bold mb-4">
            {language === 'en' ? 'Background removed!' : '背景已移除！'}
          </h3>

          {/* Result preview with checkerboard background */}
          <div className="checkerboard-bg rounded-xl p-4 mb-6 border border-border">
            <img
              src={resultPreviewUrl}
              alt="Result"
              className="max-w-full max-h-[40vh] mx-auto object-contain"
            />
          </div>

          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={onRedo} className="border-border text-foreground hover:bg-muted">
              <RotateCcw className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Redo' : '重做'}
            </Button>
            <Button onClick={() => onComplete(resultBlob)}>
              {language === 'en' ? 'Looks good! Continue' : '看起來不錯！繼續'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Error State */}
      {status === 'error' && (
        <div className="text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
            <span className="text-2xl">!</span>
          </div>
          <h3 className="text-lg font-bold mb-2">
            {language === 'en' ? 'Something went wrong' : '發生錯誤'}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {language === 'en'
              ? 'Background removal failed. Try a different image or a smaller crop.'
              : '去背失敗。請嘗試不同的圖片或較小的裁切。'}
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={onRedo} className="border-border text-foreground hover:bg-muted">
              {language === 'en' ? 'Try different image' : '嘗試不同圖片'}
            </Button>
            <Button onClick={handleRetry}>
              {language === 'en' ? 'Retry' : '重試'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BgRemoval;
