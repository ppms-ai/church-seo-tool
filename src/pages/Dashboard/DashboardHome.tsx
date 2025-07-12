import React from 'react';
import { Video, FileText, Calendar, TrendingUp } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useSermons } from '../../hooks/useSermons';

export function DashboardHome() {
  const { churchUser } = useAuth();
  const { sermons } = useSermons();

  const stats = [
    {
      name: 'Total Sermons',
      value: sermons.length,
      icon: Video,
      color: 'bg-blue-500',
    },
    {
      name: 'This Month',
      value: sermons.filter(s => new Date(s.sermon_date).getMonth() === new Date().getMonth()).length,
      icon: Calendar,
      color: 'bg-green-500',
    },
    {
      name: 'Processed Content',
      value: sermons.filter(s => s.sermon_content?.processing_status === 'completed').length,
      icon: FileText,
      color: 'bg-purple-500',
    },
    {
      name: 'Success Rate',
      value: sermons.length > 0 
        ? `${Math.round((sermons.filter(s => s.sermon_content?.processing_status === 'completed').length / sermons.length) * 100)}%`
        : '0%',
      icon: TrendingUp,
      color: 'bg-yellow-500',
    },
  ];

  const recentSermons = sermons.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your church content
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Sermons */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Sermons</h2>
        </div>
        <div className="p-6">
          {recentSermons.length > 0 ? (
            <div className="space-y-4">
              {recentSermons.map((sermon) => (
                <div
                  key={sermon.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{sermon.title}</h3>
                    <p className="text-sm text-gray-600">
                      {sermon.speaker_name} • {new Date(sermon.sermon_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {sermon.sermon_content && (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          sermon.sermon_content.processing_status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : sermon.sermon_content.processing_status === 'processing'
                            ? 'bg-yellow-100 text-yellow-800'
                            : sermon.sermon_content.processing_status === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {sermon.sermon_content.processing_status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No sermons uploaded yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}