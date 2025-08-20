'use client';

import { Button, Card } from "@/components/ui";
import { LetterEditor } from "@/components/features";
import { useAuth } from "@/context";
import Link from "next/link";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Welcome to LetterBuddy
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Your AI-powered assistant for creating beautiful, personalized letters. 
            Whether it's a thank you note, business letter, or personal message, 
            we've got you covered.
          </p>
          <div className="flex justify-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button size="lg" className="text-lg px-8 py-3">
                    Go to Dashboard
                  </Button>
                </Link>
                <Button size="lg" className="text-lg px-8 py-3 bg-gray-600 hover:bg-gray-700">
                  Start Writing
                </Button>
              </>
            ) : (
              <>
                <Link href="/signup">
                  <Button size="lg" className="text-lg px-8 py-3">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" className="text-lg px-8 py-3 bg-gray-600 hover:bg-gray-700">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Smart Editor</h3>
              <p className="text-gray-600">
                Our intelligent editor helps you craft the perfect letter with 
                suggestions and real-time feedback.
              </p>
            </Card>
            <Card>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Letter Templates</h3>
              <p className="text-gray-600">
                Choose from a variety of professional and personal letter templates 
                to get started quickly.
              </p>
            </Card>
            <Card>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Assistance</h3>
              <p className="text-gray-600">
                Get AI-powered suggestions for tone, structure, and content to 
                make your letters more effective.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Section - Only show for authenticated users */}
      {isAuthenticated && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Try It Out
            </h2>
            <div className="max-w-4xl mx-auto">
              <LetterEditor />
            </div>
          </div>
        </section>
      )}

      {/* Call to Action for non-authenticated users */}
      {!isAuthenticated && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Ready to Start Writing?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already creating beautiful letters with LetterBuddy.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8 py-3">
                  Create Free Account
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" className="text-lg px-8 py-3 bg-gray-600 hover:bg-gray-700">
                   Login
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
