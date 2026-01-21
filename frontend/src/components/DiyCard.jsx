import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';

function DiyCard({ diyProjectDetails }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Get the first image from the images array, or use a nice Unsplash placeholder
  const imageUrl = diyProjectDetails.images && diyProjectDetails.images.length > 0 
    ? diyProjectDetails.images[0] 
    : 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&h=800&fit=crop';

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
