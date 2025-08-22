'use client';

import { useState } from 'react';
import { Button, Card } from '@/components/ui';
import { useAuth } from '@/context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PracticeExercises() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isPracticing, setIsPracticing] = useState(false);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  // Single practice exercise for letter A
  const practiceExercise = {
    title: 'Practice Letter A',
    description: 'Focus on forming clear, consistent uppercase and lowercase letter A',
    icon: '🔤',
    exercises: [
      'Write uppercase &quot;A&quot; 10 times, focusing on consistent angles and proportions',
      'Practice lowercase &quot;a&quot; 10 times with proper oval shape and tail',
      'Write &quot;Aa&quot; combinations 5 times, maintaining consistent size',
      'Practice &quot;A&quot; in different sizes: small, medium, and large',
      'Write &quot;A&quot; with proper spacing between letters'
    ]
  };

  const handleStartPractice = () => {
    setIsPracticing(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Handwriting Practice</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Focus on mastering the letter &quot;A&quot; with consistent formation and proper proportions.
          </p>
        </div>

        {/* Single Practice Card */}
        <div className="mb-8">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{practiceExercise.icon}</div>
                <h3 className="text-3xl font-semibold text-gray-900 mb-3">{practiceExercise.title}</h3>
                <p className="text-gray-600 text-lg">{practiceExercise.description}</p>
              </div>
              
              <div className="space-y-4 mb-6">
                <h4 className="font-medium text-gray-800 text-lg">Today&apos;s Practice Plan:</h4>
                <ul className="space-y-3">
                  {practiceExercise.exercises.map((exercise, index) => (
                    <li key={index} className="text-gray-700 flex items-start">
                      <span className="text-blue-500 mr-3 text-lg">•</span>
                      <span className="text-base">{exercise}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {!isPracticing ? (
                <Button
                  onClick={handleStartPractice}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3"
                >
                  Start Practice
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h4 className="font-medium text-green-800 mb-2">Practice Session Active</h4>
                    <p className="text-green-700 text-sm">Ready to practice letter A. Use lined paper and focus on consistency.</p>
                  </div>
                  
                  <div className="flex space-x-4">
                    <Button className="bg-green-600 hover:bg-green-700 flex-1">
                      📝 Continue Writing
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsPracticing(false)}
                      className="flex-1"
                    >
                      End Session
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Practice Tips */}
        <Card className="bg-white shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Practice Tips for Letter A</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Start with the left diagonal line, then the right diagonal</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Keep both diagonal lines the same length</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Place the horizontal line in the middle</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Practice for 10-15 minutes daily</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Use lined paper to maintain consistent height</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Focus on quality over speed</p>
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
