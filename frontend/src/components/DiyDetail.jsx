import { useParams, useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { ShoppingCart, Check, Palette, Ruler, Type, MessageSquare, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import '../styles/DiyDetail.css';

// Map project IDs to image paths (images are in public/images/)
// Now supports arrays for multiple angles!
const localImageMap = {
  '1': ['/images/Wavy-frame.JPG'],
  '2': ['/images/dog-pizza.JPG'],
  '3': ['/images/customize-twistt-sticks-pet-bouquet.png', '/images/customize-twistt-sticks-pet-bouquet-closedup.PNG'],
  '4': ['/images/Flower-balloon.PNG'],
  '5': ['/images/7-11.PNG'],
  '6': ['/images/weaved-black-crossbody-bag.PNG', '/images/weaved-black-crossbody-bag-closedup.PNG'],
  '9': ['/images/Cookie-cusion.JPG'],
  '10': ['/images/Ham-hideout.PNG'],
  '12': ['/images/AH-DAI-pen-holder.PNG', '/images/AH-DAI-penholder2.PNG'],
  '13': ['/images/cat-bow-frame.PNG'],
  '14': ['/images/flower-box-with-jellycat.JPG'],
  '15': ['/images/Fuji-Mountain-weaved-bag.png'],
  '16': ['/images/icecream-cake.JPG'],
  '17': ['/images/Kawaii-twisty-sticks-keychain.PNG'],
  '18': ['/images/Miffy-clock2.png', '/images/Miffy-clock.PNG'],
  '19': ['/images/twistysticks-flower.PNG'],
  '20': ['/images/Chiikawa-frame2.png', '/images/Chiikawa-frame.JPG'],
  '21': ['/images/Crossbodybag-1.JPG', '/images/crossbodybag-2.JPG'],
  '22': ['/images/Cat-bow-frame.png'],
};

function DiyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { diyProjects } = useOutletContext();
  const { addToCart } = useCart();
  const { t } = useLanguage();
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [added, setAdded] = useState(false);
  
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

  // Color options (you can customize these per project later)
  const colorOptions = [
    { name: 'Saturated Blue', value: 'saturated-blue', hex: '#88A2FF' },
    { name: 'Neon Green', value: 'neon-green', hex: '#E3FC87' },
    { name: 'Deep Blue', value: 'deep-blue', hex: '#253A82' },
    { name: 'Bright Pink', value: 'bright-pink', hex: '#FFB2F7' },
    { name: 'Light Blue', value: 'light-blue', hex: '#C0E0FF' },
    { name: 'Saturated Violet', value: 'saturated-violet', hex: '#AB9DFF' },
    { name: 'White', value: 'white', hex: '#FFFFFF' },
    { name: 'Black', value: 'black', hex: '#000000' },
  ];

  // Size options
  const sizeOptions = ['Small', 'Medium', 'Large', 'Custom'];

  const handleColorToggle = (color) => {
    setCustomization(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  const handleAddToCart = () => {
    const projectWithCustomization = {
      ...project,
      customization: customization
    };
    
    addToCart(projectWithCustomization);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    
    // Optionally navigate to cart
    // navigate('/cart');
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
  const mainImage = selectedImage || allImages[0] || 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&h=800&fit=crop';

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <img
                src={mainImage}
          alt={project.projectName}
                className="w-full aspect-square object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&h=800&fit=crop';
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
          <div className="space-y-6">
            {/* Project Info */}
            <div>
              <h1 className="text-4xl font-bold mb-4">{project.projectName}</h1>
              <p className="text-lg text-muted-foreground mb-4">{project.description}</p>
              
              <div className="flex gap-6 text-sm text-muted-foreground">
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
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Customize Your Gift
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Color Selection */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                    <Palette className="w-4 h-4" />
                    Choose Colors (select multiple)
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => handleColorToggle(color.value)}
                        className={`relative aspect-square rounded-lg border-2 transition-all hover:scale-105 ${
                          customization.colors.includes(color.value)
                            ? 'border-primary ring-2 ring-primary/20'
                            : 'border-border'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      >
                        {customization.colors.includes(color.value) && (
                          <Check className="absolute inset-0 m-auto w-6 h-6 text-white drop-shadow-lg" />
                        )}
                      </button>
                    ))}
                  </div>
                  {customization.colors.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Selected: {customization.colors.map(c => 
                        colorOptions.find(opt => opt.value === c)?.name
                      ).join(', ')}
                    </p>
                  )}
                </div>

                {/* Size Selection */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                    <Ruler className="w-4 h-4" />
                    Choose Size
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {sizeOptions.map((size) => (
                      <button
                        key={size}
                        onClick={() => setCustomization(prev => ({ ...prev, size }))}
                        className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
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
                  <label className="flex items-center gap-2 text-sm font-semibold mb-3">
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
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    maxLength={50}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {customization.personalization.length}/50 characters
                  </p>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold mb-3">
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
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none"
                    rows="4"
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
    </div>
  );
}

export default DiyDetail;
