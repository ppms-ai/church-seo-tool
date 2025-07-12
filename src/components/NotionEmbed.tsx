import React from 'react';
import { useAuth } from '../hooks/useAuth';

export function NotionEmbed() {
  const { churchUser } = useAuth();

  if (!churchUser?.church?.notion_page_url) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Notion Page Not Configured</h3>
          <p className="text-gray-600 mb-4">
            Your Notion content hub hasn't been set up yet. Contact your administrator to configure the Notion page URL.
          </p>
          <p className="text-sm text-gray-500">
            Once configured, your generated sermon content will appear here automatically.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden h-[800px]">
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900">Content Hub</h3>
          <a
            href={churchUser.church.notion_page_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Open in Notion
          </a>
        </div>
      </div>
      <iframe
        src={churchUser.church.notion_page_url}
        className="w-full h-full border-0"
        title="Church Content Hub"
        allow="fullscreen"
      />
    </div>
  );
}