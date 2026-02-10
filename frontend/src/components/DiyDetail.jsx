import { useParams, useNavigate, Link } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import { useState, useEffect, lazy, Suspense } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabaseClient';
import { ShoppingCart, Check, Palette, Ruler, Type, MessageSquare, Sparkles, Plus, X, RefreshCw, AlertCircle, ArrowLeft, Gift, LogIn, Heart, Camera, Upload, Loader2, Eye, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import '../styles/DiyDetail.css';

function isLightColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 180;
}

const RoomVisualizer = lazy(() =>
  import('./room-visualizer/RoomVisualizer').catch(() => {
    // Chunk may be stale after a new deployment — reload to get fresh assets
    window.location.reload();
    return { default: () => null };
  })
);

// Map project IDs to image paths (images are in public/images/)
// Now supports arrays for multiple angles!
const localImageMap = {
  '1': ['/images/Wavy-photo-frame-coverphoto.PNG', '/images/Wavy-frame.JPG'],
  '2': ['/images/dog-pizza.JPG'],
  '3': ['/images/customize-twistt-sticks-pet-bouquet.png', '/images/customize-twistt-sticks-pet-bouquet-closedup.PNG'],
  '4': ['/images/Flower-balloon.PNG'],
  '5': ['/images/7-11-coverphoto-1.PNG', '/images/7-11-04.PNG', '/images/7-11.PNG', '/images/7-11-store-mangents2.PNG'],
  '6': ['/images/weaved-black-crossbody-bag.PNG', '/images/weaved-black-crossbody-bag-closedup.PNG'],
  '9': ['/images/Cookie-cusion.JPG', '/images/cookie-cusion-detail.PNG'],
  '10': ['/images/Ham-hideout.PNG'],
  '11': ['/images/cat-hideout1.png', '/images/cat-hideout2.png'],
  '12': ['/images/AH-DAI-pen-holder.PNG', '/images/AH-DAI-penholder2.PNG'],
  '14': ['/images/flower-box-with-jellycat.JPG', '/images/Flower-box-wth-stufftoy2.JPG'],
  '15': ['/images/Fuji-Mountain-weaved-bag.png'],
  '16': ['/images/icecream-cake.JPG'],
  '17': ['/images/Kawaii-twisty-sticks-keychain.PNG'],
  '18': ['/images/Miffy-clock2.png', '/images/Miffy-clock.PNG'],
  '19': ['/images/twistysticks-flower.PNG'],
  '20': ['/images/Chiikawa-frame2.png', '/images/Chiikawa-frame.JPG'],
  '21': ['/images/Crossbodybag-1.JPG', '/images/crossbodybag-2.JPG', '/images/crossbody-bag-detail.JPG'],
  '22': ['/images/Cat-bow-frame.png'],
  '23': ['/images/double-frame-clay-frame.PNG'],
  '24': ['/images/Fancy-fruit-basket1.png'],
  '25': ['/images/2nd-shape-wavy-mirror-frame.JPG', '/images/2nd-shape-wavy-mirror-frame02.JPG'],
  '26': ['/images/white-weaving-handbag.png', '/images/white-weaving-handbag2.png'],
  '27': ['/images/cat-pizza01.png', '/images/cat-pizza02.JPEG'],
  '28': ['/images/custom-pet-inscense-stick-holder-01.PNG', '/images/custom-pet-inscense-stick-holder-02.PNG'],
};

function DiyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { diyProjects } = useOutletContext();
  const { addToCart, hasItems, replaceCart, addAsAdditionalRequest, cart, orderWindowInfo, userBirthday } = useCart();
  const { user } = useAuth();
  const { t, language } = useLanguage();
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [added, setAdded] = useState(false);
  const [showRoomVisualizer, setShowRoomVisualizer] = useState(false);

  // Modal state for "already have item in cart"
  const [showCartModal, setShowCartModal] = useState(false);
  const [additionalReason, setAdditionalReason] = useState('');
  const [pendingProject, setPendingProject] = useState(null);
  
  // Customization state
  const [customization, setCustomization] = useState({
    colors: [],
    size: '',
    personalization: '',
    specialRequests: '',
    petPhotoUrl: ''
  });

  // Pet photo upload state
  const [petPhotoFile, setPetPhotoFile] = useState(null);
  const [petPhotoPreview, setPetPhotoPreview] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Projects that support pet photo customization
  const petPhotoProjects = ['3', '22', '28']; // Twisty Sticks Pet Bouquet, Cat Bow Frame, Pet Incense Holder
  const supportsPetPhoto = petPhotoProjects.includes(id);


  // Like state
  const [likesCount, setLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  // Color picker state (must be before any early returns to satisfy Rules of Hooks)
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customColorInput, setCustomColorInput] = useState('#FF6B6B');

  const project = diyProjects.find((project) => project.id === id);

  // Fetch likes on mount
  useEffect(() => {
    if (id) {
      fetchLikes();
    }
  }, [id, user]);

  const fetchLikes = async () => {
    try {
      // Get total likes count
      const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', parseInt(id));

      setLikesCount(count || 0);

      // Check if current user has liked
      if (user) {
        const { data } = await supabase
          .from('likes')
          .select('id')
          .eq('project_id', parseInt(id))
          .eq('user_id', user.id)
          .maybeSingle();

        setHasLiked(!!data);
      }
    } catch (error) {
      // Ignore errors (table might not exist yet)
    }
  };

  const toggleLike = async () => {
    if (!user || likeLoading) return;

    setLikeLoading(true);
    try {
      if (hasLiked) {
        // Unlike
        await supabase
          .from('likes')
          .delete()
          .eq('project_id', parseInt(id))
          .eq('user_id', user.id);

        setHasLiked(false);
        setLikesCount(prev => Math.max(0, prev - 1));
      } else {
        // Like
        await supabase
          .from('likes')
          .insert({ project_id: parseInt(id), user_id: user.id });

        setHasLiked(true);
        setLikesCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLikeLoading(false);
    }
  };

  if (!project) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-xl">Project not found!</p>
      </div>
    );
  }

  // Default color palette (used when project has no custom colors configured)
  const defaultColors = [
    { name: 'Periwinkle', hex: '#9BA8E5' },
    { name: 'Lime', hex: '#E2EDA3' },
    { name: 'Navy', hex: '#2A3362' },
    { name: 'Pink', hex: '#F0B8E8' },
    { name: 'Sky Blue', hex: '#CCE5FF' },
    { name: 'Lavender', hex: '#B8A8F0' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Black', hex: '#000000' },
  ];

  // Color options from DB: null = default, [] = hidden, [...] = custom
  const hideColors = Array.isArray(project.colorOptions) && project.colorOptions.length === 0;
  const presetColors = (Array.isArray(project.colorOptions) && project.colorOptions.length > 0)
    ? project.colorOptions
    : defaultColors;

  // Size options
  const sizeOptions = ['Small', 'Medium', 'Large', 'Custom'];

  // Toggle a color (add/remove from selection)
  const handleColorToggle = (hex) => {
    setCustomization(prev => ({
      ...prev,
      colors: prev.colors.includes(hex)
        ? prev.colors.filter(c => c !== hex)
        : [...prev.colors, hex]
    }));
  };

  // Add custom color from picker
  const handleAddCustomColor = () => {
    if (customColorInput && !customization.colors.includes(customColorInput)) {
      setCustomization(prev => ({
        ...prev,
        colors: [...prev.colors, customColorInput]
      }));
    }
    setShowColorPicker(false);
  };

  // Remove a specific color
  const handleRemoveColor = (hex) => {
    setCustomization(prev => ({
      ...prev,
      colors: prev.colors.filter(c => c !== hex)
    }));
  };

  // Handle pet photo selection
  const handlePetPhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert(language === 'en' ? 'Please select an image file' : '請選擇圖片檔案');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert(language === 'en' ? 'Image must be less than 5MB' : '圖片必須小於 5MB');
      return;
    }

    setPetPhotoFile(file);
    setPetPhotoPreview(URL.createObjectURL(file));
  };

  // Upload pet photo to Supabase Storage
  const uploadPetPhoto = async () => {
    if (!petPhotoFile || !user) return null;

    setUploadingPhoto(true);
    try {
      const fileExt = petPhotoFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('pet-photos')
        .upload(fileName, petPhotoFile);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('pet-photos')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading pet photo:', error);
      alert(language === 'en' ? 'Failed to upload photo' : '上傳照片失敗');
      return null;
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Remove pet photo
  const handleRemovePetPhoto = () => {
    setPetPhotoFile(null);
    setPetPhotoPreview(null);
    setCustomization(prev => ({ ...prev, petPhotoUrl: '' }));
  };

  const handleAddToCart = async () => {
    // Upload pet photo if selected
    let finalCustomization = { ...customization };
    if (petPhotoFile && supportsPetPhoto) {
      const photoUrl = await uploadPetPhoto();
      if (photoUrl) {
        finalCustomization.petPhotoUrl = photoUrl;
      }
    }

    const projectWithCustomization = {
      ...project,
      customization: finalCustomization
    };

    // Check if cart already has items
    if (hasItems()) {
      // Show modal to ask user what they want to do
      setPendingProject(projectWithCustomization);
      setShowCartModal(true);
    } else {
      // First item - add directly
      addToCart(projectWithCustomization);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
      navigate('/cart');
    }
  };

  // Handle replacing current cart item
  const handleReplaceCart = async () => {
    if (pendingProject) {
      await replaceCart(pendingProject);
      setShowCartModal(false);
      setPendingProject(null);
      navigate('/cart');
    }
  };

  // Handle adding as additional request
  const handleAddAsAdditional = async () => {
    if (pendingProject && additionalReason.trim()) {
      await addAsAdditionalRequest(pendingProject, additionalReason);
      setShowCartModal(false);
      setPendingProject(null);
      setAdditionalReason('');
      navigate('/cart');
    }
  };

  const hasCustomization = () => {
    return customization.colors.length > 0 ||
           customization.size ||
           customization.personalization ||
           customization.specialRequests ||
           petPhotoPreview;
  };

  // Get local images array for this project
  const localImages = localImageMap[id] || [];
  const allImages = localImages.length > 0 ? localImages : (project.images || []);
  const mainImage = selectedImage || allImages[0] || '/images/placeholder.png';

  // When room visualizer is open, replace the whole page content
  if (showRoomVisualizer) {
    return (
      <div className="flex-1">
        <Suspense fallback={
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        }>
          <RoomVisualizer
            isOpen={showRoomVisualizer}
            onClose={() => setShowRoomVisualizer(false)}
            projectId={id}
            projectName={project.projectName}
            images={allImages}
          />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        {/* Back Button */}
        <button
          onClick={() => navigate('/list')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">{language === 'en' ? 'Back to Gallery' : '返回畫廊'}</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 items-start">
          {/* Left: Image Gallery */}
          <div className="space-y-4 lg:sticky lg:top-24">
            <Card className="overflow-hidden">
              <img
                src={mainImage}
          alt={project.projectName}
                className="w-full aspect-square object-cover"
                onError={(e) => {
                  e.target.src = '/images/placeholder.png';
                }}
              />
            </Card>
            
            {/* Thumbnails - show when we have multiple images */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      mainImage === image 
                        ? 'border-primary ring-2 ring-primary/30' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <img
              src={image}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Room Visualizer Button */}
            <button
                onClick={() => setShowRoomVisualizer(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-primary/40 text-primary hover:border-primary hover:bg-primary/5 transition-all text-sm font-medium"
              >
                <Eye className="w-4 h-4" />
                {language === 'en' ? 'See it in your room' : '看看它在你的房間裡的樣子'}
              </button>
          </div>

          {/* Right: Project Info & Customization */}
          <div>
            <Card className="overflow-hidden">
              {/* Project Info */}
              <div className="text-center px-5 pt-5 pb-4">
                <h1 className="text-2xl sm:text-3xl font-bold mb-1">{project.projectName}</h1>
                <p className="text-sm text-muted-foreground mb-2">{project.description}</p>

                <div className="flex justify-center gap-4 text-xs text-muted-foreground">
                  <div className="relative group inline-flex items-center gap-1 cursor-default">
                    <span className="font-semibold">Time:</span> {project.estimatedTime}
                    <Info className="w-3 h-3 text-muted-foreground" />
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 text-xs font-normal text-white bg-gray-800 dark:bg-gray-700 rounded-lg w-48 text-center opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                      {language === 'en'
                        ? 'This is the longest estimate during high demand. It\'s usually shorter!'
                        : '這是高需求時的最長估計時間，通常會更快完成！'}
                    </span>
                  </div>
                  {project.materials && (
                    <div>
                      <span className="font-semibold">Materials:</span> {project.materials.join(', ')}
                    </div>
                  )}
                </div>

                <button
                  onClick={toggleLike}
                  disabled={!user || likeLoading}
                  className={`mt-3 inline-flex items-center gap-1.5 text-xs transition-all ${
                    hasLiked
                      ? 'text-red-500'
                      : 'text-muted-foreground hover:text-red-400'
                  } ${!user ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  title={!user ? (language === 'en' ? 'Log in to favorite' : '登入後即可收藏') : ''}
                >
                  <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current' : ''}`} />
                  {hasLiked
                    ? (language === 'en' ? `Favorited (${likesCount})` : `已收藏 (${likesCount})`)
                    : (language === 'en' ? `Favorite this item (${likesCount})` : `收藏此商品 (${likesCount})`)}
                </button>
              </div>

              {/* Customization Section */}
              <div className="border-t border-border px-5 pt-4 pb-1">
                <h3 className="flex items-center gap-2 text-sm font-bold mb-3">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Customize Your Gift
                </h3>
              </div>
              <div className="space-y-3 px-5 pb-5">
                {/* Pet Photo Upload - Only for pet-related projects */}
                {supportsPetPhoto && (
                  <div className="pb-3 border-b border-border">
                    <label className="flex items-center gap-2 text-xs font-semibold mb-2">
                      <Camera className="w-3.5 h-3.5" />
                      {language === 'en' ? 'Upload Your Pet\'s Photo' : '上傳你的寵物照片'}
                      <span className="relative group">
                        <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 text-xs font-normal text-white bg-gray-800 dark:bg-gray-700 rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                          {language === 'en'
                            ? 'Upload a clear photo and we\'ll customize the gift to look like your pet!'
                            : '上傳清晰照片，我們會將禮物客製成寵物的樣子！'}
                        </span>
                      </span>
                    </label>

                    {!petPhotoPreview ? (
                      <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-all">
                        <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                        <span className="text-sm text-muted-foreground">
                          {language === 'en' ? 'Click to upload photo' : '點擊上傳照片'}
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">
                          JPG, PNG (max 5MB)
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePetPhotoSelect}
                          className="hidden"
                        />
                      </label>
                    ) : (
                      <div className="relative">
                        <img
                          src={petPhotoPreview}
                          alt="Pet preview"
                          className="w-full h-28 object-cover rounded-xl"
                        />
                        <button
                          onClick={handleRemovePetPhoto}
                          className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-green-500/90 rounded-full text-white text-xs flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          {language === 'en' ? 'Photo ready' : '照片已準備好'}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Color Selection */}
                {!hideColors && <div>
                  <label className="flex items-center gap-2 text-xs font-semibold mb-1.5">
                    <Palette className="w-3.5 h-3.5" />
                    Colors
                  </label>

                  {/* Preset Colors Grid */}
                  <div className="grid grid-cols-8 gap-1.5 mb-1.5">
                    {presetColors.map((color) => (
                      <button
                        key={color.hex}
                        onClick={() => handleColorToggle(color.hex)}
                        className={`relative aspect-square rounded-lg border-2 transition-all hover:scale-110 ${
                          customization.colors.includes(color.hex)
                            ? 'border-primary ring-2 ring-primary/30 scale-105'
                            : 'border-border hover:border-primary/50'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      >
                        {customization.colors.includes(color.hex) && (
                          <Check className={`absolute inset-0 m-auto w-3.5 h-3.5 drop-shadow-lg ${
                            isLightColor(color.hex) ? 'text-gray-700' : 'text-white'
                          }`} />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Custom Color Picker Button */}
                  <button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    Custom color
                  </button>

                  {/* Custom Color Picker */}
                  {showColorPicker && (
                    <div className="mt-3 p-4 rounded-lg bg-muted/50 border border-border">
                      <p className="text-sm font-medium mb-2">Pick any color:</p>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={customColorInput}
                          onChange={(e) => setCustomColorInput(e.target.value)}
                          className="w-16 h-16 rounded-lg cursor-pointer border-2 border-border"
                        />
                        <div className="flex-1">
                          <input
                            type="text"
                            value={customColorInput}
                            onChange={(e) => setCustomColorInput(e.target.value)}
                            placeholder="#RRGGBB"
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm font-mono"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Click the color square or enter a hex code
                          </p>
                        </div>
                        <Button
                          onClick={handleAddCustomColor}
                          size="sm"
                          className="shrink-0"
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Selected Colors Display */}
                  {customization.colors.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground mb-1.5">
                        Selected ({customization.colors.length}):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {customization.colors.map((hex) => {
                          const preset = presetColors.find(c => c.hex === hex);
                          return (
                            <div
                              key={hex}
                              className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted border border-border"
                            >
                              <div
                                className="w-4 h-4 rounded-full border border-border"
                                style={{ backgroundColor: hex }}
                              />
                              <span className="text-xs font-medium">
                                {preset?.name || hex}
                              </span>
                              <button
                                onClick={() => handleRemoveColor(hex)}
                                className="ml-1 text-muted-foreground hover:text-destructive transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>}

                {/* Size Selection */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold mb-1.5">
                    <Ruler className="w-3.5 h-3.5" />
                    Size
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {sizeOptions.map((size) => (
                      <button
                        key={size}
                        onClick={() => setCustomization(prev => ({ ...prev, size }))}
                        className={`px-2 py-1.5 rounded-lg border-2 font-medium transition-all text-xs ${
                          customization.size === size
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Personalization */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold mb-1.5">
                    <Type className="w-3.5 h-3.5" />
                    Personalization
                  </label>
                  <input
                    type="text"
                    value={customization.personalization}
                    onChange={(e) => setCustomization(prev => ({
                      ...prev,
                      personalization: e.target.value
                    }))}
                    placeholder="Name, initials, date, or quote..."
                    className="w-full px-2.5 py-1.5 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all text-xs"
                    maxLength={50}
                  />
                </div>

                {/* Special Requests */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold mb-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Notes
                  </label>
                  <textarea
                    value={customization.specialRequests}
                    onChange={(e) => setCustomization(prev => ({
                      ...prev,
                      specialRequests: e.target.value
                    }))}
                    placeholder="Any special requests..."
                    className="w-full px-2.5 py-1.5 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none text-xs"
                    rows="2"
                    maxLength={500}
                  />
                </div>
              </div>

              {/* Add to Cart Button - Different states based on user */}
              <div className="border-t border-border px-5 py-4 space-y-2">
              {!user ? (
                /* Not logged in */
                <div className="text-center p-3 bg-primary/5 rounded-xl border border-primary/20">
                  <p className="font-medium text-foreground text-sm mb-2">
                    {language === 'en'
                      ? 'Hey friend! Log in to claim your free birthday gift'
                      : '嗨朋友！登入領取你的免費生日禮物'}
                  </p>
                  <Link to="/login">
                    <Button size="lg" className="w-full">
                      <LogIn className="w-5 h-5 mr-2" />
                      {language === 'en' ? 'Log In' : '登入'}
                    </Button>
                  </Link>
                </div>
              ) : !userBirthday ? (
                /* Logged in but no birthday set */
                <div className="text-center p-3 bg-primary/5 rounded-xl border border-primary/20">
                  <p className="font-medium text-foreground text-sm mb-2">
                    {language === 'en'
                      ? 'Set your birthday to claim your free gift!'
                      : '設定生日以領取免費禮物！'}
                  </p>
                  <Link to="/profile">
                    <Button size="lg" className="w-full">
                      {language === 'en' ? 'Set Birthday' : '設定生日'}
                    </Button>
                  </Link>
                </div>
              ) : orderWindowInfo?.canOrder ? (
                /* Can order - show normal button */
                <>
                  <Button
                    onClick={handleAddToCart}
                    size="lg"
                    className="w-full"
                    variant={added ? "secondary" : "default"}
                    disabled={uploadingPhoto}
                  >
                    {uploadingPhoto ? (
                      <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> {language === 'en' ? 'Uploading...' : '上傳中...'}</>
                    ) : added ? (
                      <><Check className="w-5 h-5 mr-2" /> Added to Cart!</>
                    ) : (
                      <><Gift className="w-5 h-5 mr-2" /> {language === 'en' ? 'Add Birthday Gift' : '加入生日禮物'}</>
                    )}
                  </Button>

                  {hasCustomization() && (
                    <p className="text-sm text-center text-primary">
                      ✨ {language === 'en' ? 'Your customization will be saved with this item' : '你的客製化選項將與此項目一起保存'}
                    </p>
                  )}


                </>
              ) : (
                /* Already ordered or window closed */
                <div className="space-y-3">
                  <div className="text-center p-4 bg-muted rounded-xl">
                    <p className="text-sm text-muted-foreground mb-2">
                      {orderWindowInfo?.message || (language === 'en' ? 'Birthday gift not available' : '生日禮物暫時不可用')}
                    </p>
                  </div>

                  {/* Buy for Others option */}
                  <div className="text-center p-4 bg-primary/5 rounded-xl border border-primary/20">
                    <p className="text-sm text-muted-foreground mb-3">
                      {language === 'en'
                        ? 'Want to buy this as a gift for someone else?'
                        : '想買這個送給別人嗎？'}
                    </p>
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full"
                      onClick={() => window.location.href = 'mailto:ariel40927@gmail.com?subject=Gift Purchase Inquiry&body=Hi Ariel, I would like to purchase: ' + project.projectName}
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      {language === 'en' ? 'Contact to Buy' : '聯繫購買'}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      {language === 'en' ? 'Coming soon: Online purchase option' : '即將推出：線上購買選項'}
                    </p>
                  </div>
                </div>
              )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal: Already have item in cart */}
      {showCartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCartModal(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
            <button
              onClick={() => setShowCartModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <AlertCircle className="w-12 h-12 text-primary mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-2">
                {language === 'en' ? 'You already have a gift selected!' : '你已經選了一個禮物！'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {language === 'en' 
                  ? 'Each person can typically request one birthday gift. What would you like to do?'
                  : '每人通常只能選擇一個生日禮物。你想怎麼做？'
                }
              </p>
            </div>

            {/* Current cart item preview */}
            {cart[0] && (
              <div className="bg-muted/50 rounded-lg p-3 mb-4 flex items-center gap-3">
                <div className="text-xs text-muted-foreground">
                  {language === 'en' ? 'Currently selected:' : '目前已選：'}
                </div>
                <div className="font-medium text-sm">{cart[0].projectName}</div>
              </div>
            )}

            <div className="space-y-3">
              {/* Option 1: Replace */}
              <Button
                onClick={handleReplaceCart}
                className="w-full"
                variant="default"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Replace with this one' : '換成這個'}
              </Button>

              {/* Divider */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-card px-3 text-xs text-muted-foreground">
                    {language === 'en' ? 'or request additional' : '或申請額外禮物'}
                  </span>
                </div>
              </div>

              {/* Option 2: Request additional */}
              <div className="space-y-2">
                <textarea
                  value={additionalReason}
                  onChange={(e) => setAdditionalReason(e.target.value)}
                  placeholder={language === 'en' 
                    ? "Please explain why you'd like an additional gift (e.g., for a different occasion, as a backup option...)"
                    : "請說明為什麼需要額外禮物（例如：不同場合、備用選項...）"
                  }
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm resize-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  rows="3"
                />
                <Button
                  onClick={handleAddAsAdditional}
                  className="w-full"
                  variant="outline"
                  disabled={!additionalReason.trim()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {language === 'en' ? 'Request additional gift' : '申請額外禮物'}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  {language === 'en' 
                    ? '* Additional requests require approval'
                    : '* 額外請求需要審核批准'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DiyDetail;
