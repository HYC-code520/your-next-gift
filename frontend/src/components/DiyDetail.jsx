import { useParams, useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { ShoppingCart, Check, Palette, Ruler, Type, MessageSquare, Sparkles, Plus, X, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import '../styles/DiyDetail.css';

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
  const { addToCart, hasItems, replaceCart, addAsAdditionalRequest, cart } = useCart();
  const { t, language } = useLanguage();
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [added, setAdded] = useState(false);
  
  // Modal state for "already have item in cart"
  const [showCartModal, setShowCartModal] = useState(false);
  const [additionalReason, setAdditionalReason] = useState('');
  const [pendingProject, setPendingProject] = useState(null);
  
  // Customization state
  const [customization, setCustomization] = useState({
    colors: [],
    size: '',
    personalization: '',
    specialRequests: ''
  });

  const project = diyProjects.find((project) => project.id === id);

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-xl">Project not found!</p>
      </div>
    );
  }

  // Preset color options (popular choices)
  const presetColors = [
    { name: 'Periwinkle', hex: '#9BA8E5' },
    { name: 'Lime', hex: '#E2EDA3' },
    { name: 'Navy', hex: '#2A3362' },
    { name: 'Pink', hex: '#F0B8E8' },
    { name: 'Sky Blue', hex: '#CCE5FF' },
    { name: 'Lavender', hex: '#B8A8F0' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Black', hex: '#000000' },
    { name: 'Coral', hex: '#FF7F7F' },
    { name: 'Mint', hex: '#98FF98' },
    { name: 'Peach', hex: '#FFCBA4' },
    { name: 'Teal', hex: '#008080' },
  ];

  // State for custom color picker
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customColorInput, setCustomColorInput] = useState('#FF6B6B');

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

  const handleAddToCart = () => {
    const projectWithCustomization = {
      ...project,
      customization: customization
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
           customization.specialRequests;
  };

  // Get local images array for this project
  const localImages = localImageMap[id] || [];
  const allImages = localImages.length > 0 ? localImages : (project.images || []);
  const mainImage = selectedImage || allImages[0] || '/images/placeholder.png';

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
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
          </div>

          {/* Right: Project Info & Customization */}
          <div className="space-y-4">
            {/* Project Info */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{project.projectName}</h1>
              <p className="text-base text-muted-foreground mb-3">{project.description}</p>
              
              <div className="flex gap-4 text-sm text-muted-foreground">
                <div>
                  <span className="font-semibold">Time:</span> {project.estimatedTime}
                </div>
                {project.materials && (
                  <div>
                    <span className="font-semibold">Materials:</span> {project.materials.join(', ')}
                  </div>
                )}
              </div>
            </div>

            {/* Customization Section */}
            <Card className="border-primary/30">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Customize Your Gift
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Color Selection */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                    <Palette className="w-4 h-4" />
                    Choose Colors (select multiple)
                  </label>
                  
                  {/* Preset Colors Grid */}
                  <div className="grid grid-cols-6 gap-2 mb-2">
                    {presetColors.map((color) => (
                      <button
                        key={color.hex}
                        onClick={() => handleColorToggle(color.hex)}
                        className={`relative aspect-square rounded-xl border-2 transition-all hover:scale-110 ${
                          customization.colors.includes(color.hex)
                            ? 'border-primary ring-2 ring-primary/30 scale-105'
                            : 'border-border hover:border-primary/50'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      >
                        {customization.colors.includes(color.hex) && (
                          <Check className={`absolute inset-0 m-auto w-5 h-5 drop-shadow-lg ${
                            ['#FFFFFF', '#E2EDA3', '#CCE5FF', '#98FF98', '#FFCBA4'].includes(color.hex) 
                              ? 'text-gray-700' 
                              : 'text-white'
                          }`} />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Custom Color Picker Button */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowColorPicker(!showColorPicker)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-all text-sm text-muted-foreground hover:text-foreground"
                    >
                      <Plus className="w-4 h-4" />
                      Add Custom Color
                    </button>
                  </div>

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
                </div>

                {/* Size Selection */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                    <Ruler className="w-4 h-4" />
                    Choose Size
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {sizeOptions.map((size) => (
                      <button
                        key={size}
                        onClick={() => setCustomization(prev => ({ ...prev, size }))}
                        className={`px-3 py-2 rounded-lg border-2 font-medium transition-all text-sm ${
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
                  <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                    <Type className="w-4 h-4" />
                    Add Personalization (optional)
                  </label>
                  <input
                    type="text"
                    value={customization.personalization}
                    onChange={(e) => setCustomization(prev => ({ 
                      ...prev, 
                      personalization: e.target.value 
                    }))}
                    placeholder="Name, initials, date, or quote..."
                    className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm"
                    maxLength={50}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {customization.personalization.length}/50 characters
                  </p>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                    <MessageSquare className="w-4 h-4" />
                    Special Requests or Notes (optional)
                  </label>
                  <textarea
                    value={customization.specialRequests}
                    onChange={(e) => setCustomization(prev => ({ 
                      ...prev, 
                      specialRequests: e.target.value 
                    }))}
                    placeholder="Any special requests or modifications..."
                    className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none text-sm"
                    rows="3"
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {customization.specialRequests.length}/500 characters
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Add to Cart Button */}
            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="w-full"
                variant={added ? "secondary" : "default"}
              >
                {added ? (
                  <><Check className="w-5 h-5 mr-2" /> Added to Cart!</>
                ) : (
                  <><ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart</>
                )}
              </Button>
              
              {hasCustomization() && (
                <p className="text-sm text-center text-primary">
                  ✨ Your customization will be saved with this item
                </p>
              )}
              
              <Button
                onClick={() => navigate('/cart')}
                size="lg"
                variant="outline"
                className="w-full"
              >
                View Cart & Checkout
              </Button>
            </div>
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
