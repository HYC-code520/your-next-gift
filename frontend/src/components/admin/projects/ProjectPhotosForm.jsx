import { Upload, Star, Image as ImageIcon } from 'lucide-react';
import PhotoGallery from './PhotoGallery';

function ProjectPhotosForm({ formData, setFormData, onFileUpload }) {
  return (
    <div className="space-y-6">
      <div className="bg-muted/30 rounded-xl p-6 space-y-5">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Project Photos
        </h3>
        
        {/* Upload Button */}
        <label className="block">
          <input
            type="file"
            accept="image/*"
            onChange={onFileUpload}
            className="hidden"
          />
          <div className="w-full px-6 py-4 bg-gradient-to-r from-[#CCE5FF] to-[#E5D4FF] text-gray-900 rounded-xl cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all text-center font-semibold flex items-center justify-center gap-3">
            <Upload className="w-5 h-5" />
            Upload Photo
          </div>
        </label>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-2">
          <Star className="w-4 h-4 text-yellow-600 fill-yellow-600" />
          <span>First photo will be the cover image</span>
        </div>
      </div>

      {/* Photo Gallery */}
      {formData.images && formData.images.length > 0 && (
        <PhotoGallery images={formData.images} setFormData={setFormData} formData={formData} />
      )}
    </div>
  );
}

export default ProjectPhotosForm;
