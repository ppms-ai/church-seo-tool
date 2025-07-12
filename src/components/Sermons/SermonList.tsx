import React from 'react';
import { format } from 'date-fns';
import { Play, Calendar, User, ExternalLink } from 'lucide-react';
import { Sermon } from '../../lib/supabase';

interface SermonListProps {
  sermons: Sermon[];
  onEdit: (sermon: Sermon) => void;
  onDelete: (id: string) => void;
}

export function SermonList({ sermons, onEdit, onDelete }: SermonListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {sermons.map((sermon) => (
        <div
          key={sermon.id}
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {sermon.title}
                </h3>
                {sermon.sermon_content && (
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      sermon.sermon_content.processing_status
                    )}`}
                  >
                    {sermon.sermon_content.processing_status}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {sermon.speaker_name}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {format(new Date(sermon.sermon_date), 'MMM d, yyyy')}
                </div>
                {sermon.series_name && (
                  <div className="text-blue-600 font-medium">
                    {sermon.series_name}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <a
                  href={sermon.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  <Play className="w-4 h-4 mr-1" />
                  Watch Video
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit(sermon)}
                className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(sermon.id)}
                className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}

      {sermons.length === 0 && (
        <div className="text-center py-12">
          <Play className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No sermons yet</h3>
          <p className="text-gray-500">Add your first sermon to get started.</p>
        </div>
      )}
    </div>
  );
}