import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';

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
  '12': '/images/AH-DAI-pen-holder.PNG',
  '13': '/images/cat-bow-frame.PNG',
  '14': '/images/flower-box-with-jellycat.JPG',
  '15': '/images/Fuji-Mountain-weaved-bag.png',
  '16': '/images/icecream-cake.JPG',
  '17': '/images/Kawaii-twisty-sticks-keychain.PNG',
  '18': '/images/Miffy-clock2.png',
  '19': '/images/twistysticks-flower.PNG',
  '20': '/images/Chiikawa-frame2.png',
  '21': '/images/Crossbodybag-1.JPG',
  '22': '/images/Cat-bow-frame.png',
};

function DiyCard({ diyProjectDetails }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Use local image if available, otherwise use placeholder
  const imageUrl = localImageMap[diyProjectDetails.id] 
    || (diyProjectDetails.images && diyProjectDetails.images.length > 0 
      ? diyProjectDetails.images[0] 
      : 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&h=800&fit=crop');

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(diyProjectDetails);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
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
              e.target.src = 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&h=800&fit=crop';
            }}
          />
          {/* Spotify-style play button overlay - theme aware */}
          <div className={`absolute inset-0 bg-white/70 dark:bg-black/40 backdrop-blur-[2px] flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <Button 
              variant="play" 
              size="icon"
              className="w-14 h-14 shadow-2xl"
            >
              <span className="text-2xl">▶</span>
            </Button>
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
          onClick={handleAddToCart}
          className="w-full"
          variant={added ? "secondary" : "default"}
          size="sm"
        >
          {added ? (
            <><Check className="w-4 h-4 mr-2 inline" /> Added to Cart</>
          ) : (
            <><ShoppingCart className="w-4 h-4 mr-2 inline" /> Add to Cart</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default DiyCard;
