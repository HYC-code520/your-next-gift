import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export function useProjectManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    project_name: '',
    description: '',
    materials: [],
    estimated_time: '',
    categories: [],
    images: []
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('diy_projects')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project.id);
    setFormData({
      project_name: project.project_name,
      description: project.description,
      materials: project.materials || [],
      estimated_time: project.estimated_time,
      categories: project.categories || [],
      images: project.images || []
    });
    setIsAdding(false);
    setShowModal(true);
  };

  const handleAdd = () => {
    console.log('🚀 handleAdd called');
    setIsAdding(true);
    setEditingProject(null);
    setFormData({
      project_name: '',
      description: '',
      materials: [],
      estimated_time: '',
      categories: [],
      images: []
    });
    setShowModal(true);
    console.log('✅ Modal should be showing now');
  };

  const handleCancel = () => {
    setEditingProject(null);
    setIsAdding(false);
    setShowModal(false);
    setFormData({
      project_name: '',
      description: '',
      materials: [],
      estimated_time: '',
      categories: [],
      images: []
    });
  };

  const handleSave = async () => {
    try {
      if (editingProject) {
        const { error } = await supabase
          .from('diy_projects')
          .update(formData)
          .eq('id', editingProject);

        if (error) throw error;
        alert('Project updated successfully!');
      } else {
        const { error } = await supabase
          .from('diy_projects')
          .insert([formData]);

        if (error) throw error;
        alert('Project added successfully!');
      }

      handleCancel();
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Error saving project');
    }
  };

  const handleDelete = async (projectId) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const { error } = await supabase
        .from('diy_projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;
      
      alert('Project deleted successfully!');
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project');
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `project-images/${fileName}`;

      const { error } = await supabase.storage
        .from('project-photos')
        .upload(filePath, file);

      if (error) {
        console.error('Upload error:', error);
        alert('Error uploading file: ' + error.message);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('project-photos')
        .getPublicUrl(filePath);

      setFormData({
        ...formData,
        images: [...(formData.images || []), publicUrl]
      });

      alert('Photo uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading file');
    }
  };

  return {
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
  };
}
