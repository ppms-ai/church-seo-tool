import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';

function App() {
  const [activeTab, setActiveTab] = useState('sermons');
  const [formData, setFormData] = useState({
    sermonUrl: '',
    sermonDate: '',
    speakerName: '',
    sermonTitle: ''
  });

  // This would be dynamic per church in production
  const currentChurch = {
    id: 'demo-church-123',
    name: 'Demo Church',
    notionEmbedUrl: 'https://www.notion.so/embed/your-church-content-hub-url'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.sermonUrl || !formData.sermonDate || !formData.speakerName) {
      alert('Please fill in all required fields');
      return;
    }

    // Your actual n8n webhook URL
    const n8nWebhookUrl = 'https://79jn2mpy.rpcl.app/webhook-test/church-seo-intake';
    
    const sermonData = {
      churchId: currentChurch.id,
      churchName: currentChurch.name,
      sermonUrl: formData.sermonUrl,
      sermonDate: formData.sermonDate,
      speakerName: formData.speakerName,
      sermonTitle: formData.sermonTitle,
      timestamp: new Date().toISOString()
    };

    try {
      console.log('Sending to n8n:', sermonData);
      
      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sermonData)
      });

      if (response.ok) {
        alert('Your sermon has been submitted and your content will be available shortly!');
        
        // Reset form
        setFormData({
          sermonUrl: '',
          sermonDate: '',
          speakerName: '',
          sermonTitle: ''
        });
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
    } catch (error) {
      console.error('Webhook error:', error);
      alert('Failed to submit sermon. Please try again or contact support.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-800">Church SEO Assistant</h1>
              <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded font-medium">
                {currentChurch.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('sermons')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'sermons'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Submit Sermon
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'content'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Content Hub
            </button>
          </nav>
        </div>

        {/* Submit Sermon Tab */}
        {activeTab === 'sermons' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Submit New Sermon</h2>
            <p className="text-gray-600 mb-6">
              Submit your sermon details below and we'll automatically generate SEO content, social media posts, and marketing materials for you.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sermon URL *
                  </label>
                  <input
                    type="url"
                    value={formData.sermonUrl}
                    onChange={(e) => setFormData({...formData, sermonUrl: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="https://youtube.com/watch?v=..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sermon Date *
                  </label>
                  <input
                    type="date"
                    value={formData.sermonDate}
                    onChange={(e) => setFormData({...formData, sermonDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Speaker Name *
                  </label>
                  <input
                    type="text"
                    value={formData.speakerName}
                    onChange={(e) => setFormData({...formData, speakerName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Pastor John Smith"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sermon Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.sermonTitle}
                    onChange={(e) => setFormData({...formData, sermonTitle: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Walking in Faith"
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Submit Sermon
                </button>
              </div>
            </form>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-sm font-medium text-blue-900 mb-2">What happens next?</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• AI analyzes your sermon content</li>
                <li>• Generates blog posts, social media content, and SEO materials</li>
                <li>• Content appears in your Content Hub within minutes</li>
                <li>• Ready to copy, customize, and publish</li>
              </ul>
            </div>

            {/* Debug Info */}
            <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600">
              <strong>Debug Info:</strong> Webhook URL: {n8nWebhookUrl} | Church ID: {currentChurch.id}
            </div>
          </div>
        )}

        {/* Content Hub Tab */}
        {activeTab === 'content' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Your Content Hub</h2>
              <p className="text-sm text-gray-600 mt-1">
                All your generated content organized by sermon. Click any item to view and edit.
              </p>
            </div>
            
            <div className="p-6">
              <div className="mb-4 text-sm text-gray-500">
                Your personalized content database powered by Notion
              </div>
              
              {/* Notion Embed */}
              <div className="border rounded-lg overflow-hidden" style={{ height: '600px' }}>
                <iframe
                  src={currentChurch.notionEmbedUrl}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  title="Church Content Hub"
                  className="w-full h-full"
                />
              </div>
              
              <div className="mt-4 text-xs text-gray-400">
                ✨ Content automatically generated by Church SEO Assistant
              </div>
            </div>
          </div>
        )}
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;