import { useState } from 'react';
import { Package, Palette, Plus, X } from 'lucide-react';

const CATEGORY_OPTIONS = ['Wood', 'Bag', 'Pet', 'Photo Frame', 'Decor', 'Bouquet', 'Food', 'Home'];

const COLOR_MODES = {
  DEFAULT: 'default',
  NONE: 'none',
  CUSTOM: 'custom',
};

function getColorMode(colorOptions) {
  if (colorOptions === null || colorOptions === undefined) return COLOR_MODES.DEFAULT;
  if (Array.isArray(colorOptions) && colorOptions.length === 0) return COLOR_MODES.NONE;
  return COLOR_MODES.CUSTOM;
}

function ProjectDetailsForm({ formData, setFormData }) {
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#9BA8E5');

  const colorMode = getColorMode(formData.color_options);

  const handleCategoryToggle = (category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleColorModeChange = (mode) => {
    setFormData(prev => ({
      ...prev,
      color_options: mode === COLOR_MODES.DEFAULT ? null
        : mode === COLOR_MODES.NONE ? []
        : prev.color_options && prev.color_options.length > 0 ? prev.color_options : []
    }));
  };

  const handleAddColor = () => {
    const name = newColorName.trim();
    if (!name) return;
    setFormData(prev => ({
      ...prev,
      color_options: [...(prev.color_options || []), { name, hex: newColorHex }]
    }));
    setNewColorName('');
  };

  const handleRemoveColor = (index) => {
    setFormData(prev => ({
      ...prev,
      color_options: prev.color_options.filter((_, i) => i !== index)
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
            onChange={(e) => setFormData(prev => ({ ...prev, project_name: e.target.value }))}
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
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-4 py-3 bg-background border-2 border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-y min-h-[120px]"
            rows="6"
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
              onChange={(e) => setFormData(prev => ({ ...prev, estimated_time: e.target.value }))}
              placeholder="2 hours"
              className="w-full px-4 py-3 bg-background border-2 border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-foreground">
              Materials
            </label>
            <textarea
              value={formData.materials.join(', ')}
              onChange={(e) => setFormData(prev => ({ ...prev, materials: e.target.value.split(',').map(m => m.trim()) }))}
              placeholder="Wood, Paint..."
              rows="2"
              className="w-full px-4 py-3 bg-background border-2 border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-y min-h-[60px]"
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
                    ? 'bg-gradient-to-r from-[#CCE5FF] to-[#E5D4FF] dark:from-[#2A3362] dark:to-[#3D2B5A] text-foreground shadow-md scale-105'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:scale-105'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Color Options */}
        <div>
          <label className="block text-sm font-semibold mb-3 text-foreground flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Color Options
          </label>

          {/* Mode selector */}
          <div className="flex gap-2 mb-3">
            {[
              { mode: COLOR_MODES.DEFAULT, label: 'Default palette' },
              { mode: COLOR_MODES.NONE, label: 'No colors' },
              { mode: COLOR_MODES.CUSTOM, label: 'Custom' },
            ].map(({ mode, label }) => (
              <button
                key={mode}
                type="button"
                onClick={() => handleColorModeChange(mode)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  colorMode === mode
                    ? 'bg-gradient-to-r from-[#CCE5FF] to-[#E5D4FF] dark:from-[#2A3362] dark:to-[#3D2B5A] text-foreground shadow-md scale-105'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:scale-105'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {colorMode === COLOR_MODES.DEFAULT && (
            <p className="text-xs text-muted-foreground">Users will see the standard color palette.</p>
          )}

          {colorMode === COLOR_MODES.NONE && (
            <p className="text-xs text-muted-foreground">Color picker will be hidden for this project.</p>
          )}

          {colorMode === COLOR_MODES.CUSTOM && (
            <div className="space-y-3">
              {/* Current colors */}
              {formData.color_options && formData.color_options.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.color_options.map((color, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-full bg-background border border-border"
                    >
                      <div
                        className="w-5 h-5 rounded-full border border-border shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-xs font-medium">{color.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(index)}
                        className="ml-0.5 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add new color */}
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={newColorHex}
                  onChange={(e) => setNewColorHex(e.target.value)}
                  className="w-9 h-9 rounded-lg cursor-pointer border border-border shrink-0"
                />
                <input
                  type="text"
                  value={newColorName}
                  onChange={(e) => setNewColorName(e.target.value)}
                  placeholder="Color name..."
                  className="flex-1 px-3 py-2 bg-background border-2 border-border rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddColor())}
                />
                <button
                  type="button"
                  onClick={handleAddColor}
                  disabled={!newColorName.trim()}
                  className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Users will only see these colors + a custom color option.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectDetailsForm;
