import { Package } from 'lucide-react';

const CATEGORY_OPTIONS = ['Wood', 'Bag', 'Pet', 'Photo Frame', 'Decor', 'Bouquet', 'Food', 'Home'];

function ProjectDetailsForm({ formData, setFormData }) {
  const handleCategoryToggle = (category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-muted/30 rounded-xl p-6 space-y-5">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Package className="w-5 h-5" />
          Project Details
        </h3>
        
        <div>
          <label className="block text-sm font-semibold mb-2 text-foreground">
            Project Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.project_name}
            onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
            className="w-full px-4 py-3 bg-background border-2 border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="Enter project name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-foreground">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 bg-background border-2 border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            rows="4"
            placeholder="Describe your project..."
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-foreground">
              Time <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.estimated_time}
              onChange={(e) => setFormData({ ...formData, estimated_time: e.target.value })}
              placeholder="2 hours"
              className="w-full px-4 py-3 bg-background border-2 border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2 text-foreground">
              Materials
            </label>
            <input
              type="text"
              value={formData.materials.join(', ')}
              onChange={(e) => setFormData({ ...formData, materials: e.target.value.split(',').map(m => m.trim()) })}
              placeholder="Wood, Paint..."
              className="w-full px-4 py-3 bg-background border-2 border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-3 text-foreground">
            Categories
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_OPTIONS.map(category => (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryToggle(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  formData.categories.includes(category)
                    ? 'bg-gradient-to-r from-[#CCE5FF] to-[#E5D4FF] text-gray-900 shadow-md scale-105'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:scale-105'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetailsForm;
