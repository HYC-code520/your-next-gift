import { useEffect, useRef } from 'react';
import { X, Save } from 'lucide-react';
import ProjectDetailsForm from './ProjectDetailsForm';
import ProjectPhotosForm from './ProjectPhotosForm';
import Portal from './Portal';

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

  if (!isOpen) {
    return null;
  }

  return (
    <Portal>
      <div 
        className="fixed inset-0 flex items-center justify-center p-4" 
        style={{ 
          zIndex: 9999,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)'
        }}
      >
        <div 
          ref={modalRef}
          className="rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-hidden flex flex-col"
          style={{
            backgroundColor: 'white'
          }}
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
          <div className="border-t-2 px-8 py-6 flex gap-4" style={{ borderColor: '#e5e7eb', backgroundColor: '#f9fafb' }}>
            <button
              onClick={onSave}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-[#CCE5FF] to-[#E5D4FF] text-gray-900 rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
            >
              <Save className="w-5 h-5" />
              {isAdding ? 'Create Project' : 'Save Changes'}
            </button>
            <button
              onClick={onCancel}
              className="px-6 py-4 rounded-xl font-semibold hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
              style={{ backgroundColor: '#e5e7eb', color: '#374151' }}
            >
              <X className="w-5 h-5" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}

export default ProjectModal;
