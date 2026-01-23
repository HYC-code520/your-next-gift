import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Sparkles, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { useLanguage } from '../context/LanguageContext';

// Map project IDs to image arrays (images are in public/images/)
// Now supports multiple images for hover slideshow!
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

function DiyCard({ diyProjectDetails }) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get all images for this project
  const projectImages = localImageMap[diyProjectDetails.id] || ['/images/placeholder.png'];
  const hasMultipleImages = projectImages.length > 1;
  const currentImage = projectImages[currentImageIndex];

  const handleCustomize = (e) => {
    e.preventDefault();
    navigate(`/list/${diyProjectDetails.id}`);
  };

  const handleDotClick = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    // Auto-swap to 2nd image on hover if available
    if (hasMultipleImages && currentImageIndex === 0) {
      setCurrentImageIndex(1);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Reset to first image when mouse leaves
    setCurrentImageIndex(0);
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-all duration-300 group animate-fade-in"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={`/list/${diyProjectDetails.id}`}>
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted to-muted/50">
          <img
            src={currentImage}
            alt={diyProjectDetails.projectName}
            className="w-full h-full object-cover transition-all duration-500"
            loading="lazy"
            onError={(e) => {
              e.target.src = '/images/placeholder.png';
            }}
          />
          
          {/* Subtle overlay on hover */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

          {/* Image indicator dots - always visible if multiple images */}
          {hasMultipleImages && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {projectImages.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => handleDotClick(e, index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex
                      ? 'bg-white w-6'
                      : 'bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </Link>
      
      <CardHeader className="pb-3">
        <CardTitle className="text-base hover:underline">
          <Link to={`/list/${diyProjectDetails.id}`}>
            {diyProjectDetails.projectName}
          </Link>
        </CardTitle>
        <CardDescription className="line-clamp-2 text-xs">
          {diyProjectDetails.description || "No description available"}
        </CardDescription>
      </CardHeader>

      <CardFooter>
        <Button 
          onClick={handleCustomize}
          className="w-full"
          variant="default"
          size="sm"
        >
          <Sparkles className="w-4 h-4 mr-2 inline" />
          {language === 'en' ? 'Customize & Order' : '客製化訂購'}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default DiyCard;
