import PhotoItem from './PhotoItem';

function PhotoGallery({ images, setFormData, formData }) {
  return (
    <div className="bg-muted/30 rounded-xl p-6">
      <h4 className="text-sm font-semibold mb-4 flex items-center justify-between">
        <span>Gallery ({images.length})</span>
        <span className="text-xs text-muted-foreground font-normal">Drag to reorder</span>
      </h4>
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {images.map((image, index) => (
          <PhotoItem
            key={index}
            image={image}
            index={index}
            totalImages={images.length}
            formData={formData}
            setFormData={setFormData}
          />
        ))}
      </div>
    </div>
  );
}

export default PhotoGallery;
