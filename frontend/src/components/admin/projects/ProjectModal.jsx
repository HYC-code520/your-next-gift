import { useEffect, useRef } from 'react';
import { X, Save } from 'lucide-react';
import ProjectDetailsForm from './ProjectDetailsForm';
import ProjectPhotosForm from './ProjectPhotosForm';

function ProjectModal({ 
  isOpen, 
  isAdding, 
  formData, 
  setFormData, 
  onSave, 
  onCancel,
  onFileUpload 
}) {
  const modalRef = useRef(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        ref={modalRef}
        className="bg-card rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#CCE5FF] to-[#E5D4FF] px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isAdding ? 'Add Project' : 'Edit Project'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {isAdding ? 'Create a new DIY project' : 'Update project details and photos'}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-white/50 rounded-full transition-all hover:rotate-90 duration-300"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ProjectDetailsForm formData={formData} setFormData={setFormData} />
            <ProjectPhotosForm 
              formData={formData} 
              setFormData={setFormData}
              onFileUpload={onFileUpload}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t-2 border-border bg-muted/30 px-8 py-6 flex gap-4">
          <button
            onClick={onSave}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-[#CCE5FF] to-[#E5D4FF] text-gray-900 rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
          >
            <Save className="w-5 h-5" />
            {isAdding ? 'Create Project' : 'Save Changes'}
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-4 bg-muted hover:bg-muted/80 text-foreground rounded-xl font-semibold hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
          >
            <X className="w-5 h-5" />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectModal;
