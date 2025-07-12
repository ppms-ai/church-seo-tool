import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { X } from 'lucide-react';
import { Sermon } from '../../lib/supabase';

const schema = yup.object({
  title: yup.string().required('Title is required'),
  speaker_name: yup.string().required('Speaker name is required'),
  sermon_date: yup.string().required('Sermon date is required'),
  youtube_url: yup
    .string()
    .url('Must be a valid URL')
    .required('YouTube URL is required'),
  series_name: yup.string(),
});

interface SermonFormData {
  title: string;
  speaker_name: string;
  sermon_date: string;
  youtube_url: string;
  series_name?: string;
}

interface SermonFormProps {
  sermon?: Sermon;
  onSubmit: (data: SermonFormData) => Promise<void>;
  onClose: () => void;
  isLoading: boolean;
}

export function SermonForm({ sermon, onSubmit, onClose, isLoading }: SermonFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SermonFormData>({
    resolver: yupResolver(schema),
    defaultValues: sermon
      ? {
          title: sermon.title,
          speaker_name: sermon.speaker_name,
          sermon_date: sermon.sermon_date,
          youtube_url: sermon.youtube_url,
          series_name: sermon.series_name || '',
        }
      : undefined,
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {sermon ? 'Edit Sermon' : 'Add New Sermon'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Sermon Title *
            </label>
            <input
              {...register('title')}
              type="text"
              id="title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter sermon title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="speaker_name" className="block text-sm font-medium text-gray-700 mb-1">
              Speaker Name *
            </label>
            <input
              {...register('speaker_name')}
              type="text"
              id="speaker_name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter speaker name"
            />
            {errors.speaker_name && (
              <p className="mt-1 text-sm text-red-600">{errors.speaker_name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="sermon_date" className="block text-sm font-medium text-gray-700 mb-1">
              Sermon Date *
            </label>
            <input
              {...register('sermon_date')}
              type="date"
              id="sermon_date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.sermon_date && (
              <p className="mt-1 text-sm text-red-600">{errors.sermon_date.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="youtube_url" className="block text-sm font-medium text-gray-700 mb-1">
              YouTube URL *
            </label>
            <input
              {...register('youtube_url')}
              type="url"
              id="youtube_url"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://youtube.com/watch?v=..."
            />
            {errors.youtube_url && (
              <p className="mt-1 text-sm text-red-600">{errors.youtube_url.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="series_name" className="block text-sm font-medium text-gray-700 mb-1">
              Series Name (Optional)
            </label>
            <input
              {...register('series_name')}
              type="text"
              id="series_name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter series name"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Saving...' : sermon ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}