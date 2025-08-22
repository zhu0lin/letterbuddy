'use client';

import { useState, useEffect } from 'react';
import { useAuth, useHandwriting } from '@/context';
import { Button, Card, LoadingSpinner, EmptyState } from '@/components/ui';
import { useRouter } from 'next/navigation';
import WelcomeMessage from '@/components/ui/WelcomeMessage';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const { handwritingSamples, isLoading } = useHandwriting();
  const router = useRouter();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Wait for samples to load
    if (!isLoading) {
      setIsInitialLoading(false);
    }
  }, [isAuthenticated, router, isLoading]);

  if (!isAuthenticated) {
    return null;
  }

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your practice dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalSamples = handwritingSamples.length;
  const averageScore = totalSamples > 0 
    ? Math.round(handwritingSamples.reduce((acc, sample) => acc + sample.score, 0) / totalSamples)
    : 0;
  const highScores = handwritingSamples.filter(s => s.score >= 80).length;
  const needsPractice = handwritingSamples.filter(s => s.score < 75).length;
  
  // Get recent samples (last 5)
  const recentSamples = handwritingSamples.slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <WelcomeMessage user={user} />
        </div>
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Handwriting Practice Dashboard</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Welcome back, {user?.name}! Ready to improve your handwriting? 
            Upload photos of your writing for AI analysis and feedback.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/upload">
            <Card className="border-2 border-blue-200 hover:border-blue-300 transition-colors cursor-pointer h-full">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload New Sample</h3>
                <p className="text-gray-600 text-sm">Take a photo and get AI feedback</p>
              </div>
            </Card>
          </Link>

          <Link href="/practice">
            <Card className="border-2 border-green-200 hover:border-green-300 transition-colors cursor-pointer h-full">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Practice Exercises</h3>
                <p className="text-gray-600 text-sm">Get personalized practice based on feedback</p>
              </div>
            </Card>
          </Link>

          <Link href="/progress">
            <Card className="border-2 border-purple-200 hover:border-purple-300 transition-colors cursor-pointer h-full">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Progress</h3>
                <p className="text-gray-600 text-sm">See your improvement over time</p>
              </div>
            </Card>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-md">
            <div className="text-center p-4">
              <p className="text-3xl font-bold text-blue-600">{totalSamples}</p>
              <p className="text-gray-600">Samples Analyzed</p>
            </div>
          </Card>
          <Card className="bg-white shadow-md">
            <div className="text-center p-4">
              <p className="text-3xl font-bold text-green-600">
                {averageScore}%
              </p>
              <p className="text-gray-600">Average Score</p>
            </div>
          </Card>
          <Card className="bg-white shadow-md">
            <div className="text-center p-4">
              <p className="text-3xl font-bold text-purple-600">
                {highScores}
              </p>
              <p className="text-gray-600">High Scores</p>
            </div>
          </Card>
          <Card className="bg-white shadow-md">
            <div className="text-center p-4">
              <p className="text-3xl font-bold text-yellow-600">
                {needsPractice}
              </p>
              <p className="text-gray-600">Need Practice</p>
            </div>
          </Card>
        </div>

        {/* Recent Handwriting Samples */}
        <Card className="bg-white shadow-md">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 p-6 gap-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Handwriting Samples</h2>
            <Link href="/upload">
              <Button>Upload New Sample</Button>
            </Link>
          </div>
          
          {totalSamples === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
              </div>
              <p className="text-gray-500 mb-4">You haven&apos;t uploaded any handwriting samples yet.</p>
              <Link href="/upload">
                <Button>Take Your First Assessment</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4 px-6 pb-6">
              {recentSamples.map((sample) => (
                <div
                  key={sample.id}
                  className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors gap-4"
                >
                  <div className="flex items-start space-x-4 flex-1">
                    {sample.image && sample.image.trim() !== '' && (
                      <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                        <img 
                          src={sample.image} 
                          alt="Handwriting sample" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{sample.type || 'Handwriting Sample'}</h3>
                      <p className="text-sm text-gray-600">
                        Focus: {sample.focus || 'General handwriting'}
                      </p>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        Feedback: {sample.feedback || 'No detailed feedback available'}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Uploaded: {sample.uploadedAt ? sample.uploadedAt.toLocaleDateString() : 'Unknown date'}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
                    <div className="text-left sm:text-right">
                      <p className="text-2xl font-bold text-green-600">{sample.score}%</p>
                      <p className="text-xs text-gray-500">Score</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/analysis/${sample.id}`}>
                        <Button size="sm" variant="outline">View Analysis</Button>
                      </Link>
                      <Link href="/practice">
                        <Button size="sm" variant="outline">Practice</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              {totalSamples > 5 && (
                <div className="text-center pt-4">
                  <Link href="/samples">
                    <Button variant="outline">View All Samples</Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Practice Recommendations */}
        {totalSamples > 0 && (
          <Card className="bg-white shadow-md mt-8">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommended Next Steps</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <h3 className="font-medium text-blue-900 mb-2">Improve Letter Sizing</h3>
                  <p className="text-blue-700 text-sm">Your letters vary in size. Try our sizing consistency exercises.</p>
                  <Link href="/practice?focus=sizing">
                    <Button size="sm" className="mt-2" variant="outline">Practice Sizing</Button>
                  </Link>
                </div>
                <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                  <h3 className="font-medium text-green-900 mb-2">Master Cursive</h3>
                  <p className="text-green-700 text-sm">Great job on basic strokes! Ready for more advanced cursive.</p>
                  <Link href="/practice?focus=cursive">
                    <Button size="sm" className="mt-2" variant="outline">Continue Cursive</Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Upload Section */}
        <Card className="bg-white shadow-md mt-8">
          <div className="p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Ready to Improve?</h2>
            <p className="text-gray-600 mb-6">
              Master beautiful, legible handwriting with AI-powered photo analysis. 
              Perfect for iPad, Apple Pencil, and drawing tablets. 
              Upload photos of your writing and get personalized feedback to improve.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/upload">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                  Upload Handwriting Sample
                </Button>
              </Link>
              <Link href="/practice">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  View Practice Exercises
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}