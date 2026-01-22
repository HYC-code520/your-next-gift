import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Sparkles, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { useLanguage } from '../context/LanguageContext';

// Map project IDs to image paths (images are in public/images/)
const localImageMap = {
  '1': '/images/Wavy-frame.JPG',
  '2': '/images/dog-pizza.JPG',
  '3': '/images/customize-twistt-sticks-pet-bouquet.png',
  '4': '/images/Flower-balloon.PNG',
  '5': '/images/7-11.PNG',
  '6': '/images/weaved-black-crossbody-bag.PNG',
  '9': '/images/Cookie-cusion.JPG',
  '10': '/images/Ham-hideout.PNG',
  '11': '/images/cat-hideout1.png',
  '12': '/images/AH-DAI-pen-holder.PNG',
  '14': '/images/flower-box-with-jellycat.JPG',
  '15': '/images/Fuji-Mountain-weaved-bag.png',
  '16': '/images/icecream-cake.JPG',
  '17': '/images/Kawaii-twisty-sticks-keychain.PNG',
  '18': '/images/Miffy-clock2.png',
  '19': '/images/twistysticks-flower.PNG',
  '20': '/images/Chiikawa-frame2.png',
  '21': '/images/Crossbodybag-1.JPG',
  '22': '/images/Cat-bow-frame.png',
  '23': '/images/double-frame-clay-frame.PNG',
  '24': '/images/Fancy-fruit-basket1.png',
  '25': '/images/2nd-shape-wavy-mirror-frame.JPG',
  '26': '/images/white-weaving-handbag.png',
  '27': '/images/cat-pizza01.png',
};

function DiyCard({ diyProjectDetails }) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  // Use local image if available, otherwise use placeholder
  const imageUrl = localImageMap[diyProjectDetails.id] 
    || (diyProjectDetails.images && diyProjectDetails.images.length > 0 
      ? diyProjectDetails.images[0] 
      : '/images/placeholder.png');

  const handleCustomize = (e) => {
    e.preventDefault();
    navigate(`/list/${diyProjectDetails.id}`);
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-all duration-300 group animate-fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/list/${diyProjectDetails.id}`}>
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted to-muted/50">
          <img
            src={imageUrl}
            alt={diyProjectDetails.projectName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              e.target.src = '/images/placeholder.png';
            }}
          />
          {/* View overlay on hover */}
          <div className={`absolute inset-0 bg-white/60 dark:bg-black/40 backdrop-blur-[2px] flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex flex-col items-center gap-2 text-foreground">
              <Eye className="w-8 h-8" />
              <span className="text-sm font-medium">View Details</span>
            </div>
          </div>
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
