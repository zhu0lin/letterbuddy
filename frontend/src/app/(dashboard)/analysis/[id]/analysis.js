'use client';

import { useState, useEffect } from 'react';
import { useAuth, useHandwriting } from '@/context';
import { Button, Card } from '@/components/ui';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

export default function AnalysisPage({ id }) {
  const { user, isAuthenticated } = useAuth();
  const { handwritingSamples } = useHandwriting();
  const router = useRouter();
  const [sample, setSample] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Find the sample by ID
    const foundSample = handwritingSamples.find(s => s.id.toString() === id);
    if (foundSample) {
      setSample(foundSample);
      setIsLoading(false);
    } else {
      // If sample not found in context, try to fetch from database
      fetchSampleFromDatabase();
    }
  }, [id, handwritingSamples, isAuthenticated, router]);

  const fetchSampleFromDatabase = async () => {
    try {
      const { data, error } = await supabase
        .from('user_uploads')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        const formattedSample = {
          id: data.id,
          type: data.type || 'Handwriting Sample',
          focus: data.focus || 'Overall handwriting',
          score: data.score || 0,
          feedback: data.feedback || 'No feedback yet',
          uploadedAt: new Date(data.uploaded_at),
          status: data.status || 'analyzed',
          image: data.image_url
        };
        setSample(formattedSample);
      } else {
        // If sample not found, redirect to dashboard
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error fetching sample:', error);
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (!sample) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/dashboard" className="text-blue-600 hover:text-blue-500 mb-4 inline-flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </Link>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Handwriting Analysis</h1>
              <p className="text-xl text-gray-600">Detailed feedback and improvement suggestions</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">{sample.score}%</p>
              <p className="text-sm text-gray-500">Overall Score</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div>
            <Card className="bg-white shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Handwriting Sample</h2>
              {sample.image && (
                <div className="mb-4">
                  <Image
                    src={sample.image}
                    alt="Handwriting sample"
                    width={500}
                    height={400}
                    className="w-full h-auto rounded-lg border border-gray-200 shadow-sm"
                  />
                </div>
              )}
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">Type:</span> {sample.type}</p>
                <p><span className="font-medium">Focus Area:</span> {sample.focus}</p>
                <p><span className="font-medium">Uploaded:</span> {sample.uploadedAt.toLocaleDateString()}</p>
                <p><span className="font-medium">Status:</span> <span className="text-green-600 capitalize">{sample.status}</span></p>
              </div>
            </Card>
          </div>

          {/* Analysis Section */}
          <div className="space-y-6">
            {/* Overall Feedback */}
            <Card className="bg-white shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">AI Analysis & Feedback</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-blue-800">{sample.feedback}</p>
              </div>
              
              {/* Score Breakdown */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-gray-900">Score Breakdown</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Letter Formation</span>
                    <span className="text-sm font-medium text-gray-900">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Spacing</span>
                    <span className="text-sm font-medium text-gray-900">72%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Alignment</span>
                    <span className="text-sm font-medium text-gray-900">78%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Neatness</span>
                    <span className="text-sm font-medium text-gray-900">80%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Improvement Suggestions */}
            <Card className="bg-white shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Improvement Suggestions</h2>
              <div className="space-y-4">
                <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                  <h3 className="font-medium text-yellow-900 mb-2">Focus on Spacing</h3>
                  <p className="text-yellow-800 text-sm">Your letters are well-formed but could benefit from more consistent spacing between words and letters.</p>
                </div>
                
                <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <h3 className="font-medium text-blue-900 mb-2">Maintain Letter Size</h3>
                  <p className="text-blue-800 text-sm">Some letters vary in size. Practice maintaining consistent letter heights for better readability.</p>
                </div>
                
                <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                  <h3 className="font-medium text-green-900 mb-2">Great Progress!</h3>
                  <p className="text-green-800 text-sm">Your letter formation is excellent. Keep practicing to improve consistency.</p>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Link href="/upload">
                <Button size="lg" className="w-full">
                  Upload Another Sample
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full">
                Practice Exercises
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}