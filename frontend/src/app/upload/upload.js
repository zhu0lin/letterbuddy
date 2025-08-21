'use client';

import { useState, useRef } from 'react';
import { Button, Card } from '@/components/ui';
import { useAuth, useHandwriting } from '@/context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function UploadPage() {
  const { isAuthenticated } = useAuth();
  const { addHandwritingSample } = useHandwriting();
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(interval);
      setUploadProgress(100);
      
      // Add the new handwriting sample to the context
      addHandwritingSample({
        id: Date.now(),
        type: 'New Assessment',
        focus: 'Overall handwriting analysis',
        score: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
        feedback: 'Good letter formation, needs work on spacing and consistency',
        uploadedAt: new Date(),
        status: 'analyzed',
        image: preview // Use the preview image
      });
      
      // Redirect to dashboard after successful upload
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
      
    } catch (error) {
      console.error('Upload failed:', error);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Upload Handwriting Sample</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Take a photo of your handwriting and upload it for AI analysis. 
            Get detailed feedback on spacing, sizing, alignment, and overall neatness.
          </p>
        </div>

        {/* Upload Area */}
        <Card className="bg-white shadow-lg p-8">
          {!selectedFile ? (
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload your handwriting sample</h3>
              <p className="text-gray-600 mb-4">
                Drag and drop an image here, or click to browse files
              </p>
              <p className="text-sm text-gray-500">
                Supports JPG, PNG, GIF up to 10MB
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-6">
              {/* File Preview */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
                <div className="max-w-md mx-auto">
                  <Image
                    src={preview}
                    alt="Handwriting preview"
                    width={400}
                    height={300}
                    className="w-full h-auto rounded-lg border border-gray-200 shadow-sm"
                  />
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    <strong>File:</strong> {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  {uploadProgress === 100 && (
                    <p className="text-green-600 text-center font-medium">
                      Upload complete! Redirecting to dashboard...
                    </p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4">
                {!isUploading && (
                  <>
                    <Button
                      onClick={handleUpload}
                      size="lg"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Analyze Handwriting
                    </Button>
                    <Button
                      onClick={removeFile}
                      variant="outline"
                      size="lg"
                    >
                      Choose Different File
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </Card>

        {/* Tips Section */}
        <Card className="bg-white shadow-lg mt-8 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tips for Best Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Ensure good lighting for clear photos</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Write on plain, white paper</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Keep the camera steady and level</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Include enough text for analysis</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Avoid shadows and glare</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Use a dark pen for better contrast</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Back to Dashboard */}
        <div className="text-center mt-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
              ← Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
