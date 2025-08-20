'use client';

import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function LetterEditor() {
  const [letterContent, setLetterContent] = useState('');

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving letter:', letterContent);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Letter Editor</h2>
      <div>
        <label htmlFor="letter-content" className="block text-sm font-medium text-gray-700 mb-2">
          Letter Content
        </label>
        <textarea
          id="letter-content"
          value={letterContent}
          onChange={(e) => setLetterContent(e.target.value)}
          className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Start writing your letter..."
        />
      </div>
      <div className="flex space-x-4">
        <Button onClick={handleSave}>Save Letter</Button>
        <Button className="bg-gray-600 hover:bg-gray-700">Preview</Button>
      </div>
    </div>
  );
}
