'use client';


import { useState, useRef } from 'react';
import { Button, Card } from '@/components/ui';
import { useAuth, useHandwriting } from '@/context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';


export default function UploadPage() {
  const { isAuthenticated } = useAuth();
  const { addHandwritingSample } = useHandwriting();
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);


  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }


  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setAnalysisResult(null);
      setError(null);
     
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
    setError(null);
    setAnalysisResult(null);


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
      // Call the backend handwriting analysis API using the utility
      const result = await api.analyzeHandwriting(selectedFile);
     
      clearInterval(interval);
      setUploadProgress(100);
      setAnalysisResult(result);
     
      // Save to Supabase
      await addHandwritingSample({
        type: 'Handwriting Analysis',
        focus: 'AI Analysis',
        score: Math.round(result.confidence_score * 100),
        feedback: result.analysis,
        status: 'analyzed',
        image: preview,
        analysis: result
      });
     
      // Show success message
      setTimeout(() => {
        setUploadProgress(0);
      }, 2000);
     
    } catch (error) {
      console.error('Upload failed:', error);
      setError(error.message || 'Failed to analyze handwriting. Please try again.');
      clearInterval(interval);
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };


  const removeFile = () => {
    setSelectedFile(null);
    setPreview(null);
    setAnalysisResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };


  const resetAnalysis = () => {
    setAnalysisResult(null);
    setError(null);
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
                  {preview && (
                    <Image
                      src={preview}
                      alt="Handwriting preview"
                      width={400}
                      height={300}
                      className="w-full h-auto rounded-lg border border-gray-200 shadow-sm"
                    />
                  )}
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


              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Analysis Failed</h3>
                      <p className="text-sm text-red-700 mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}


              {/* Analysis Results */}
              {analysisResult && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-800 mb-6">Handwriting Analysis Results</h3>
                 
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <h4 className="font-medium text-green-700 mb-3">Detected Letters</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.detected_letters.map((letter, index) => (
                          <span key={index} className="bg-green-100 text-green-800 px-3 py-2 rounded-md text-sm font-mono font-semibold">
                            {letter}
                          </span>
                        ))}
                      </div>
                    </div>
                   
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <h4 className="font-medium text-green-700 mb-3">Quality Assessment</h4>
                      <div className="space-y-2">
                        <p className="text-gray-800 font-semibold text-lg">{analysisResult.handwriting_quality}</p>
                        <p className="text-gray-600 text-sm">Confidence: <span className="font-semibold">{(analysisResult.confidence_score * 100).toFixed(0)}%</span></p>
                      </div>
                    </div>
                  </div>


                  <div className="mb-6">
                    <h4 className="font-medium text-green-700 mb-3">Suggestions for Improvement</h4>
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <ul className="space-y-2">
                        {analysisResult.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="text-green-500 mt-1">•</span>
                            <span className="text-gray-700 text-sm">{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>


                  <div>
                    <h4 className="font-medium text-green-700 mb-3">Detailed Analysis</h4>
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      {(() => {
                        const analysis = analysisResult.analysis;
                       
                        // Check if the analysis follows the structured format
                        if (analysis.includes('DETECTED_LETTERS:') && analysis.includes('QUALITY:') && analysis.includes('CONFIDENCE:') && analysis.includes('SUGGESTIONS:') && analysis.includes('ANALYSIS:')) {
                          // Parse structured format
                          const sections = analysis.split(/(?=DETECTED_LETTERS:|QUALITY:|CONFIDENCE:|SUGGESTIONS:|ANALYSIS:)/);
                         
                          return (
                            <div className="space-y-4">
                              {sections.map((section, index) => {
                                if (!section.trim()) return null;
                               
                                const [header, ...content] = section.split('\n');
                                const title = header.replace(':', '');
                                const text = content.join('\n').trim();
                               
                                if (!text) return null;
                               
                                // Split the content by line breaks and filter out empty lines
                                const lines = text.split('\n').filter(line => line.trim());
                               
                                return (
                                  <div key={index} className="border-b border-gray-100 pb-3 last:border-b-0">
                                    <h5 className="font-semibold text-gray-800 mb-2 text-base">{title}</h5>
                                    <div className="space-y-2">
                                      {lines.map((line, lineIndex) => (
                                        <p key={lineIndex} className="text-gray-700 text-sm leading-relaxed">
                                          {line.trim()}
                                        </p>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        } else {
                          // Fallback for non-structured format - also split by lines
                          const lines = analysis.split('\n').filter(line => line.trim());
                         
                          return (
                            <div className="space-y-2">
                              {lines.map((line, index) => (
                                <p key={index} className="text-gray-700 text-sm leading-relaxed">
                                  {line.trim()}
                                </p>
                              ))}
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </div>
                </div>
              )}


              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Analyzing handwriting...</span>
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
                      Analysis complete!
                    </p>
                  )}
                </div>
              )}


              {/* Action Buttons */}
              <div className="flex justify-center space-x-4">
                {!isUploading && !analysisResult && (
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
               
                {analysisResult && (
                  <>
                    <Button
                      onClick={resetAnalysis}
                      variant="outline"
                      size="lg"
                    >
                      Analyze Another Image
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

