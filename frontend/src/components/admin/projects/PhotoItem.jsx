import { memo } from 'react';
import { Star, MoveUp, MoveDown, X } from 'lucide-react';

const PhotoItem = memo(function PhotoItem({ image, index, totalImages, onMove, onSetCover, onDelete }) {
  return (
    <div className="relative bg-background border-2 border-border rounded-xl p-3 hover:border-primary hover:shadow-md transition-all group">
      <div className="flex items-center gap-4">
        {/* Thumbnail Preview */}
        <div className="relative flex-shrink-0">
          <img
            src={image}
            alt={`Preview ${index + 1}`}
            className="w-20 h-20 object-cover rounded-lg border-2 border-border bg-muted shadow-sm"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"%3E%3Crect width="80" height="80" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="28" fill="%239ca3af"%3E%3F%3C/text%3E%3C/svg%3E';
            }}
          />
          {/* Cover Badge */}
          {index === 0 && (
            <div className="absolute -top-2 -right-2 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full p-1.5 shadow-lg border-2 border-background">
              <Star className="w-3.5 h-3.5 text-white fill-white" />
            </div>
          )}
        </div>

        {/* Image Info */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground truncate">
            Photo {index + 1}
          </p>
          <p className="text-xs text-muted-foreground/70 truncate mt-1">
            {image}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {index > 0 && (
            <button
              type="button"
              onClick={() => onMove(index, index - 1)}
              className="p-2 hover:bg-primary/20 rounded-lg transition-colors"
              title="Move up"
            >
              <MoveUp className="w-4 h-4" />
            </button>
          )}

          {index < totalImages - 1 && (
            <button
              type="button"
              onClick={() => onMove(index, index + 1)}
              className="p-2 hover:bg-primary/20 rounded-lg transition-colors"
              title="Move down"
            >
              <MoveDown className="w-4 h-4" />
            </button>
          )}

          {index !== 0 && (
            <button
              type="button"
              onClick={() => onSetCover(index)}
              className="p-2 hover:bg-yellow-500/20 rounded-lg transition-colors text-yellow-600"
              title="Set as cover photo"
            >
              <Star className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => onDelete(index)}
            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-600"
            title="Delete photo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
});

export default PhotoItem;
