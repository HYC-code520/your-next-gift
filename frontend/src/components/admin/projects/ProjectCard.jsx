import { Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';

function ProjectCard({ project, onEdit, onDelete }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{project.project_name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(project)}
              className="text-gray-700 dark:text-white hover:text-primary hover:bg-primary/10"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(project.id)}
              className="text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium">Time:</span> {project.estimated_time}
          </div>
          {project.categories && project.categories.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {project.categories.map((cat, i) => (
                <span key={i} className="px-2 py-0.5 bg-primary/20 text-primary rounded-full text-xs">
                  {cat}
                </span>
              ))}
            </div>
          )}
          {project.images && project.images.length > 0 && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <ImageIcon className="w-3 h-3" />
              <span className="text-xs">{project.images.length} photo{project.images.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ProjectCard;
