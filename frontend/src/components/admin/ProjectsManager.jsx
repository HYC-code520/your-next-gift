import { Plus, Package } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { useProjectManager } from './projects/useProjectManager';
import ProjectModal from './projects/ProjectModal';
import ProjectCard from './projects/ProjectCard';

function ProjectsManager() {
  const { t } = useLanguage();
  const {
    projects,
    loading,
    isAdding,
    showModal,
    formData,
    setFormData,
    handleEdit,
    handleAdd,
    handleCancel,
    handleSave,
    handleDelete,
    handleFileUpload
  } = useProjectManager();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  console.log('📊 ProjectsManager render - showModal:', showModal, 'isAdding:', isAdding);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          {t('allProjects')} ({projects.length})
        </h3>
        <Button onClick={() => {
          console.log('🔘 Add button clicked');
          handleAdd();
        }}>
          <Plus className="w-4 h-4 mr-2" />
          {t('addProject')}
        </Button>
      </div>

      {/* Modal */}
      <ProjectModal
        isOpen={showModal}
        isAdding={isAdding}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSave}
        onCancel={handleCancel}
        onFileUpload={handleFileUpload}
      />

      {/* Projects List */}
      {projects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">{t('noProjects')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectsManager;
