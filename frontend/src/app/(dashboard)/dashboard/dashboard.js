'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context';
import { Button, Card, LoadingSpinner, EmptyState } from '@/components/ui';
import { useRouter } from 'next/navigation';
import WelcomeMessage from '@/components/ui/WelcomeMessage';

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

    // Load user's letters (simulated for now)
    const loadLetters = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
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
      } catch (error) {
        console.error('Error loading letters:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLetters();
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="xl" text="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <WelcomeMessage user={user} />
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
            <EmptyState
              title="No letters yet"
              description="You haven't created any letters yet. Start writing your first letter today!"
              actionText="Write Your First Letter"
              onAction={() => console.log('Create letter clicked')}
            />
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
