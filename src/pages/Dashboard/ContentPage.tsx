import React from 'react';
import { NotionEmbed } from '../../components/NotionEmbed';

export function ContentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Content Hub</h1>
        <p className="text-gray-600 mt-1">
          View your generated sermon content and blog posts
        </p>
      </div>

      <NotionEmbed />
    </div>
  );
}