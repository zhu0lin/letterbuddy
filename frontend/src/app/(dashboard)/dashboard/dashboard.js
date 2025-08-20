'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context';
import { Button, Card } from '@/components/ui';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [letters, setLetters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Simulate loading user's letters
    setTimeout(() => {
      setLetters([
        {
          id: 1,
          title: 'Thank You Letter to Grandma',
          recipient: 'Grandma Smith',
          type: 'personal',
          status: 'draft',
          createdAt: new Date('2024-01-15')
        },
        {
          id: 2,
          title: 'Job Application Follow-up',
          recipient: 'Hiring Manager',
          type: 'business',
          status: 'sent',
          createdAt: new Date('2024-01-10')
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {user?.name}! Here's an overview of your letters.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{letters.length}</p>
              <p className="text-gray-600">Total Letters</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {letters.filter(l => l.status === 'draft').length}
              </p>
              <p className="text-gray-600">Drafts</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {letters.filter(l => l.status === 'sent').length}
              </p>
              <p className="text-gray-600">Sent</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {letters.filter(l => l.type === 'business').length}
              </p>
              <p className="text-gray-600">Business</p>
            </div>
          </Card>
        </div>

        {/* Recent Letters */}
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Letters</h2>
            <Button>Create New Letter</Button>
          </div>
          
          {letters.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">You haven't created any letters yet.</p>
              <Button>Write Your First Letter</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {letters.map((letter) => (
                <div
                  key={letter.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{letter.title}</h3>
                    <p className="text-sm text-gray-600">
                      To: {letter.recipient} • {letter.type} • {letter.status}
                    </p>
                    <p className="text-xs text-gray-500">
                      Created: {letter.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm" variant="outline">View</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
