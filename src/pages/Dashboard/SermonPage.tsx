import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { SermonList } from '../../components/Sermons/SermonList';
import { SermonForm } from '../../components/Sermons/SermonForm';
import { useSermons } from '../../hooks/useSermons';
import { Sermon } from '../../lib/supabase';
import toast from 'react-hot-toast';

export function SermonPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingSermon, setEditingSermon] = useState<Sermon | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const { sermons, loading, createSermon, updateSermon, deleteSermon } = useSermons();

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      if (editingSermon) {
        await updateSermon(editingSermon.id, data);
        toast.success('Sermon updated successfully');
      } else {
        await createSermon(data);
        toast.success('Sermon created successfully');
      }
      handleCloseForm();
    } catch (error) {
      toast.error('Failed to save sermon');
      console.error('Error saving sermon:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (sermon: Sermon) => {
    setEditingSermon(sermon);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this sermon?')) {
      try {
        await deleteSermon(id);
        toast.success('Sermon deleted successfully');
      } catch (error) {
        toast.error('Failed to delete sermon');
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingSermon(undefined);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sermons</h1>
          <p className="text-gray-600 mt-1">
            Manage your sermon collection and content generation
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Sermon
        </button>
      </div>

      <SermonList
        sermons={sermons}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {showForm && (
        <SermonForm
          sermon={editingSermon}
          onSubmit={handleSubmit}
          onClose={handleCloseForm}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}