import { useParams, useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { ShoppingCart, Check, Palette, Ruler, Type, MessageSquare, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import '../styles/DiyDetail.css';

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
    { name: 'White', value: 'white', hex: '#FFFFFF' },
    { name: 'Black', value: 'black', hex: '#000000' },
    { name: 'Pink', value: 'pink', hex: '#FFC0CB' },
    { name: 'Blue', value: 'blue', hex: '#4A90E2' },
    { name: 'Green', value: 'green', hex: '#1DB954' },
    { name: 'Gold', value: 'gold', hex: '#FFD700' },
    { name: 'Silver', value: 'silver', hex: '#C0C0C0' },
    { name: 'Purple', value: 'purple', hex: '#9B59B6' },
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

  const imageUrl = selectedImage || (project.images && project.images.length > 0 
    ? project.images[0] 
    : 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&h=800&fit=crop');

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <img
                src={imageUrl}
                alt={project.projectName}
                className="w-full aspect-square object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&h=800&fit=crop';
                }}
              />
            </Card>
            
            {/* Thumbnails */}
            {project.images && project.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {project.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      (selectedImage || project.images[0]) === image 
                        ? 'border-primary' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover"
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
