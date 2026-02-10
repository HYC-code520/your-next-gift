import { useCallback } from 'react';
import PhotoItem from './PhotoItem';

function PhotoGallery({ images, setFormData }) {
  const handleMove = useCallback((fromIndex, toIndex) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      [newImages[fromIndex], newImages[toIndex]] = [newImages[toIndex], newImages[fromIndex]];
      return { ...prev, images: newImages };
    });
  }, [setFormData]);

  const handleSetCover = useCallback((index) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      const [removed] = newImages.splice(index, 1);
      newImages.unshift(removed);
      return { ...prev, images: newImages };
    });
  }, [setFormData]);

  const handleDelete = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  }, [setFormData]);

  return (
    <div className="bg-muted/30 rounded-xl p-6">
      <h4 className="text-sm font-semibold mb-4 flex items-center justify-between">
        <span>Gallery ({images.length})</span>
      </h4>
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {images.map((image, index) => (
          <PhotoItem
            key={image + index}
            image={image}
            index={index}
            totalImages={images.length}
            onMove={handleMove}
            onSetCover={handleSetCover}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default PhotoGallery;
