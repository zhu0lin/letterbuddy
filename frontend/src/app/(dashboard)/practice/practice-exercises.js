'use client';

import { useState, useEffect } from 'react';
import { Button, Card, LoadingSpinner } from '@/components/ui';
import { useAuth, useHandwriting } from '@/context'; // Add useHandwriting import
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function PracticeExercises() {
  const { isAuthenticated, loading } = useAuth();
  const { lettersToImprove } = useHandwriting(); // Get letters to improve from context
  const router = useRouter();
  const [isPracticing, setIsPracticing] = useState(false);
  const [practiceSentences, setPracticeSentences] = useState(null);
  const [isGeneratingSentences, setIsGeneratingSentences] = useState(false);
  const [difficulty, setDifficulty] = useState('beginner');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated === false && !loading) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  // Show loading state while checking authentication
  if (loading || isAuthenticated === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Use letters from analysis or fallback to 'A', and clean any whitespace
  const practiceLetters = lettersToImprove.length > 0 
    ? lettersToImprove.map(letter => letter.trim()).filter(letter => letter.length > 0)
    : ['A'];

  // Single practice exercise for the first letter that needs improvement
  const practiceExercise = {
    title: `Practice Letter ${practiceLetters[0]}`,
    description: `Focus on forming clear, consistent uppercase and lowercase letter ${practiceLetters[0]}`,
    icon: '🔤',
    exercises: [
      `Write uppercase "${practiceLetters[0]}" 10 times, focusing on consistent angles and proportions`,
      `Practice lowercase "${practiceLetters[0].toLowerCase()}" 10 times with proper shape`,
      `Write "${practiceLetters[0]}${practiceLetters[0].toLowerCase()}" combinations 5 times, maintaining consistent size`,
      `Practice "${practiceLetters[0]}" in different sizes: small, medium, and large`,
      `Write "${practiceLetters[0]}" with proper spacing between letters`
    ]
  };

  const handleStartPractice = async () => {
    console.log('Starting practice with:', { practiceLetters, difficulty });
    
    if (!practiceLetters || practiceLetters.length === 0) {
      setError('No letters available for practice. Please upload a handwriting sample first.');
      return;
    }
    
    const targetLetter = practiceLetters[0];
    if (!targetLetter) {
      setError('Invalid target letter. Please try again.');
      return;
    }
    
    setIsPracticing(true);
    setIsGeneratingSentences(true);
    setError(null);
    
    try {
      console.log('Calling API with:', { targetLetter, difficulty });
      const result = await api.generatePracticeSentences(
        targetLetter, 
        difficulty, 
        5
      );
      console.log('API result:', result);
      setPracticeSentences(result);
    } catch (err) {
      console.error('Failed to generate practice sentences:', err);
      setError(err.message);
    } finally {
      setIsGeneratingSentences(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Handwriting Practice</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {lettersToImprove.length > 0 
              ? `Focus on mastering the letters that need improvement: ${lettersToImprove.join(', ')}`
              : 'Focus on mastering letter formation with consistent practice.'}
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
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <label className="text-sm font-medium text-gray-700">Difficulty:</label>
                    <select 
                      value={difficulty} 
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  
                  <Button
                    onClick={handleStartPractice}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3"
                  >
                    Start Practice
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h4 className="font-medium text-green-800 mb-2">Practice Session Active</h4>
                    <p className="text-green-700 text-sm">Ready to practice letter {practiceLetters[0]}. Use lined paper and focus on consistency.</p>
                  </div>
                  
                  {isGeneratingSentences ? (
                    <div className="text-center py-8">
                      <LoadingSpinner />
                      <p className="text-gray-600 mt-4">Generating AI practice sentences...</p>
                    </div>
                  ) : error ? (
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                      <p className="text-red-700 text-sm">{error}</p>
                      <Button 
                        onClick={() => setIsPracticing(false)}
                        className="mt-2 bg-red-600 hover:bg-red-700 text-sm"
                      >
                        Try Again
                      </Button>
                    </div>
                  ) : practiceSentences ? (
                    <div className="space-y-4">
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <h4 className="font-medium text-blue-800 mb-2">
                          AI-Generated Practice Sentences for Letter &quot;{practiceSentences.target_letter}&quot;
                        </h4>
                                                  <p className="text-blue-700 text-sm mb-3">
                            Difficulty: {practiceSentences.difficulty} • 
                            Total &quot;{practiceSentences.target_letter}&quot; occurrences: {practiceSentences.total_letter_count}
                          </p>
                      </div>
                      
                      <div className="space-y-3">
                        {practiceSentences.sentences.map((sentence, index) => (
                          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                            <p className="text-gray-800 text-lg leading-relaxed">{sentence}</p>
                            <div className="mt-2 text-sm text-gray-500">
                              Letter count: {sentence.toUpperCase().split(practiceSentences.target_letter).length - 1}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                        <h5 className="font-medium text-yellow-800 mb-2">Practice Tips:</h5>
                        <ul className="space-y-1">
                          {practiceSentences.practice_tips.map((tip, index) => (
                            <li key={index} className="text-yellow-700 text-sm flex items-start">
                              <span className="text-yellow-600 mr-2">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <h5 className="font-medium text-blue-800 mb-2">📝 Next Steps:</h5>
                        <p className="text-blue-700 text-sm mb-3">
                          Now it&apos;s time to practice! Write these sentences on paper, focusing on the letter &quot;{practiceSentences.target_letter}&quot;.
                        </p>
                        <div className="flex items-center justify-center space-x-4">
                          <Link href="/upload">
                            <Button className="bg-blue-600 hover:bg-blue-700">
                              📤 Upload Practice Sample
                            </Button>
                          </Link>
                          <p className="text-blue-600 text-sm font-medium">
                            Get new AI feedback on your improved handwriting!
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}
                  
                  <div className="flex space-x-4">
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

        {/* Additional letters to practice section */}
        {lettersToImprove.length > 1 && (
          <Card className="bg-white shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Other Letters to Practice</h3>
            <div className="flex flex-wrap gap-2">
              {lettersToImprove.slice(1).map((letter, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-2 rounded-md text-sm font-semibold">
                  {letter}
                </span>
              ))}
            </div>
            <p className="text-gray-600 text-sm mt-3">
              Focus on one letter at a time. After mastering {practiceLetters[0]}, move on to these letters.
            </p>
          </Card>
        )}

        {/* Practice Tips */}
        <Card className="bg-white shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Practice Tips for Letter {practiceLetters[0]}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Start with the basic strokes and build up to the full letter</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Pay attention to consistent sizing and proportions</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">Focus on smooth, controlled movements</p>
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