import { useState, useRef, useEffect } from 'react';
import { useNavigate, useOutletContext, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabaseClient';
import { ArrowLeft, Upload, X, Loader2, ShoppingCart, Check, Lightbulb, Camera, Palette, Ruler, MessageSquare, Image } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

const MAX_PHOTOS = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Auto-compress an image file to be under MAX_FILE_SIZE
// Uses canvas to resize and reduce quality progressively
function compressImage(file, maxSize = MAX_FILE_SIZE) {
  return new Promise((resolve) => {
    // If already small enough, return as-is
    if (file.size <= maxSize) {
      resolve(file);
      return;
    }

    const img = new window.Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const canvas = document.createElement('canvas');
      let { width, height } = img;

      // Scale down large images (max 2000px on longest side)
      const MAX_DIM = 2000;
      if (width > MAX_DIM || height > MAX_DIM) {
        const ratio = Math.min(MAX_DIM / width, MAX_DIM / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // Try progressively lower quality until under maxSize
      const tryQuality = (quality) => {
        canvas.toBlob(
          (blob) => {
            if (blob.size <= maxSize || quality <= 0.3) {
              const compressed = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressed);
            } else {
              tryQuality(quality - 0.1);
            }
          },
          'image/jpeg',
          quality
        );
      };

      tryQuality(0.8);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file); // fallback to original if something goes wrong
    };

    img.src = url;
  });
}

function CustomRequest() {
  const navigate = useNavigate();
  const { diyProjects } = useOutletContext();
  const { addToCart, hasItems, replaceCart, addAsAdditionalRequest } = useCart();
  const { user } = useAuth();
  const { language } = useLanguage();
  const fileInputRef = useRef(null);

  // Find the Custom Request project from the database
  const customProject = (diyProjects || []).find(p => p.projectName === 'Custom Request');

  // Form state
  const [requestTitle, setRequestTitle] = useState('');
  const [requestDescription, setRequestDescription] = useState('');
  const [colorPreference, setColorPreference] = useState('');
  const [sizePreference, setSizePreference] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Photo state
  const [photoFiles, setPhotoFiles] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Submit state
  const [added, setAdded] = useState(false);

  // Cart modal state (same pattern as DiyDetail)
  const [showCartModal, setShowCartModal] = useState(false);
  const [additionalReason, setAdditionalReason] = useState('');
  const [pendingProject, setPendingProject] = useState(null);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      photoPreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const handlePhotoSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    const remaining = MAX_PHOTOS - photoFiles.length;
    const toAdd = files.slice(0, remaining);

    // Validate all are images
    for (const file of toAdd) {
      if (!file.type.startsWith('image/')) {
        alert(language === 'en' ? 'Please select image files only' : '請只選擇圖片檔案');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
    }

    // Auto-compress any files over 5MB
    const processed = await Promise.all(
      toAdd.map(file => compressImage(file))
    );

    const newPreviews = processed.map(f => URL.createObjectURL(f));
    setPhotoFiles(prev => [...prev, ...processed]);
    setPhotoPreviews(prev => [...prev, ...newPreviews]);

    // Reset input so user can select the same file again if removed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePhoto = (index) => {
    URL.revokeObjectURL(photoPreviews[index]);
    setPhotoFiles(prev => prev.filter((_, i) => i !== index));
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadPhotos = async () => {
    if (photoFiles.length === 0 || !user) return [];

    const urls = [];
    for (const file of photoFiles) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`;

      const { error } = await supabase.storage
        .from('custom-request-photos')
        .upload(fileName, file);

      if (error) {
        console.error('Error uploading photo:', error);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('custom-request-photos')
        .getPublicUrl(fileName);

      urls.push(publicUrl);
    }
    return urls;
  };

  const handleSubmit = async () => {
    if (!requestTitle.trim()) {
      alert(language === 'en' ? 'Please enter what you\'d like made' : '請輸入你想要什麼');
      return;
    }

    if (!customProject) {
      alert(language === 'en' ? 'Custom request project not found. Please contact admin.' : '找不到自訂請求專案，請聯繫管理員。');
      return;
    }

    setUploading(true);

    try {
      // Upload reference photos
      const photoUrls = await uploadPhotos();

      const customization = {
        isCustomRequest: true,
        requestTitle: requestTitle.trim(),
        requestDescription: requestDescription.trim(),
        referencePhotos: photoUrls,
        colorPreference: colorPreference.trim(),
        sizePreference: sizePreference.trim(),
        additionalNotes: additionalNotes.trim(),
      };

      const projectWithCustomization = {
        ...customProject,
        customization,
      };

      // Same cart logic as DiyDetail
      if (hasItems()) {
        setPendingProject(projectWithCustomization);
        setShowCartModal(true);
      } else {
        addToCart(projectWithCustomization);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
        navigate('/cart');
      }
    } catch (error) {
      console.error('Error submitting custom request:', error);
      alert(language === 'en' ? 'Something went wrong. Please try again.' : '出了點問題，請再試一次。');
    } finally {
      setUploading(false);
    }
  };

  const handleReplaceCart = async () => {
    if (pendingProject) {
      await replaceCart(pendingProject);
      setShowCartModal(false);
      setPendingProject(null);
      navigate('/cart');
    }
  };

  const handleAddAsAdditional = async () => {
    if (pendingProject && additionalReason.trim()) {
      await addAsAdditionalRequest(pendingProject, additionalReason);
      setShowCartModal(false);
      setPendingProject(null);
      setAdditionalReason('');
      navigate('/cart');
    }
  };

  const isFormValid = requestTitle.trim().length > 0;

  return (
    <div className="flex-1">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate('/list')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {language === 'en' ? 'Back to Projects' : '返回專案列表'}
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Lightbulb className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {language === 'en' ? 'Custom Request' : '自訂禮物請求'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'en'
              ? 'Tell me what you\'d like me to make! Add reference photos and details.'
              : '告訴我你想要什麼！可以附上參考照片和細節。'}
          </p>
        </div>

        <div className="space-y-6">
          {/* What would you like? */}
          <Card>
            <CardContent className="p-6">
              <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                <Lightbulb className="w-4 h-4 text-primary" />
                {language === 'en' ? 'What would you like me to make?' : '你想要我做什麼？'}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={requestTitle}
                onChange={(e) => setRequestTitle(e.target.value)}
                placeholder={language === 'en' ? 'e.g. A crochet dinosaur plushie' : '例如：一個恐龍鉤針玩偶'}
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all outline-none"
              />
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardContent className="p-6">
              <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                <MessageSquare className="w-4 h-4 text-primary" />
                {language === 'en' ? 'Describe your idea' : '描述你的想法'}
              </label>
              <textarea
                value={requestDescription}
                onChange={(e) => setRequestDescription(e.target.value)}
                placeholder={language === 'en'
                  ? 'Describe what you have in mind — shape, style, purpose, who it\'s for...'
                  : '描述你的想法 — 形狀、風格、用途、送給誰...'}
                rows={4}
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all outline-none resize-none"
              />
            </CardContent>
          </Card>

          {/* Reference Photos */}
          <Card>
            <CardContent className="p-6">
              <label className="flex items-center gap-2 text-sm font-semibold mb-1">
                <Camera className="w-4 h-4 text-primary" />
                {language === 'en' ? 'Reference Photos' : '參考照片'}
              </label>
              <p className="text-xs text-muted-foreground mb-4">
                {language === 'en'
                  ? `Upload up to ${MAX_PHOTOS} reference photos (large photos are auto-resized)`
                  : `最多上傳 ${MAX_PHOTOS} 張參考照片（大圖片會自動縮小）`}
              </p>

              {/* Photo grid */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {photoPreviews.map((preview, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                    <img
                      src={preview}
                      alt={`Reference ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {/* Add photo button */}
                {photoFiles.length < MAX_PHOTOS && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Upload className="w-5 h-5" />
                    <span className="text-[10px]">
                      {language === 'en' ? 'Add' : '新增'}
                    </span>
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoSelect}
                className="hidden"
              />
            </CardContent>
          </Card>

          {/* Color & Size Preferences */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                  <Palette className="w-4 h-4 text-primary" />
                  {language === 'en' ? 'Color Preferences' : '顏色偏好'}
                </label>
                <input
                  type="text"
                  value={colorPreference}
                  onChange={(e) => setColorPreference(e.target.value)}
                  placeholder={language === 'en' ? 'e.g. Pastel pink and white' : '例如：粉色和白色'}
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all outline-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                  <Ruler className="w-4 h-4 text-primary" />
                  {language === 'en' ? 'Size Preferences' : '尺寸偏好'}
                </label>
                <input
                  type="text"
                  value={sizePreference}
                  onChange={(e) => setSizePreference(e.target.value)}
                  placeholder={language === 'en' ? 'e.g. About 15cm tall' : '例如：大約 15 公分高'}
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all outline-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <Card>
            <CardContent className="p-6">
              <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                <MessageSquare className="w-4 h-4 text-primary" />
                {language === 'en' ? 'Additional Notes' : '其他備註'}
              </label>
              <textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder={language === 'en'
                  ? 'Any other details, deadlines, or special requests...'
                  : '其他細節、截止日期或特殊要求...'}
                rows={3}
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all outline-none resize-none"
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid || uploading}
            className="w-full"
            size="lg"
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {language === 'en' ? 'Uploading...' : '上傳中...'}
              </>
            ) : added ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                {language === 'en' ? 'Added to Cart!' : '已加入購物車！'}
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5 mr-2" />
                {language === 'en' ? 'Add to Cart' : '加入購物車'}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Cart conflict modal - same pattern as DiyDetail */}
      {showCartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-bold">
                {language === 'en' ? 'You already have items in your cart' : '你的購物車已有商品'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === 'en'
                  ? 'Would you like to replace your current cart or add this as an additional request?'
                  : '你想要替換購物車中的商品，還是新增為額外請求？'}
              </p>

              <div className="space-y-3">
                <Button
                  onClick={handleReplaceCart}
                  variant="outline"
                  className="w-full"
                >
                  {language === 'en' ? 'Replace Cart' : '替換購物車'}
                </Button>

                <div className="space-y-2">
                  <textarea
                    value={additionalReason}
                    onChange={(e) => setAdditionalReason(e.target.value)}
                    placeholder={language === 'en'
                      ? 'Why do you want this additional gift?'
                      : '為什麼想要這個額外的禮物？'}
                    rows={2}
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:border-primary outline-none resize-none"
                  />
                  <Button
                    onClick={handleAddAsAdditional}
                    disabled={!additionalReason.trim()}
                    className="w-full"
                  >
                    {language === 'en' ? 'Add as Additional Request' : '新增為額外請求'}
                  </Button>
                </div>

                <Button
                  onClick={() => { setShowCartModal(false); setPendingProject(null); }}
                  variant="ghost"
                  className="w-full"
                >
                  {language === 'en' ? 'Cancel' : '取消'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default CustomRequest;
