'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context';

const HandwritingContext = createContext();

export function HandwritingProvider({ children }) {
  const [handwritingSamples, setHandwritingSamples] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lettersToImprove, setLettersToImprove] = useState([]);
  const { user } = useAuth();

  // Fetch user's handwriting samples and letters to improve
  useEffect(() => {
    if (user) {
      fetchHandwritingSamples();
      fetchLettersToImprove();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchHandwritingSamples = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching samples for user:', user.id);
      
      const { data, error } = await supabase
        .from('user_uploads')
        .select('*')
        .eq('user_id', user.id)
        .order('uploaded_at', { ascending: false });

      if (error) {
        console.error('Error fetching samples:', error);
        throw error;
      }

      console.log('Fetched samples:', data);

      // Transform data to match the expected format
      const samples = data.map(item => ({
        id: item.id,
        type: item.type || 'Handwriting Sample',
        focus: item.focus || 'Overall handwriting',
        score: item.score || 0,
        feedback: item.feedback || 'No feedback yet',
        uploadedAt: new Date(item.uploaded_at),
        status: item.status || 'analyzed',
        image: item.image_url,
        analysis: item.analysis || null
      }));

      setHandwritingSamples(samples);
    } catch (error) {
      console.error('Error fetching handwriting samples:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLettersToImprove = async () => {
    try {
      const { data, error } = await supabase
        .from('user_letters_to_improve')
        .select('letters')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found"
        console.error('Error fetching letters to improve:', error);
        return;
      }

      if (data && data.letters) {
        setLettersToImprove(data.letters);
      }
    } catch (error) {
      console.error('Error fetching letters to improve:', error);
    }
  };

  const updateLettersToImprove = async (newLetters) => {
    try {
      // First try to update existing record
      const { data, error } = await supabase
        .from('user_letters_to_improve')
        .upsert({
          user_id: user.id,
          letters: newLetters,
          updated_at: new Date().toISOString()
        })
        .select();

      if (error) {
        console.error('Error updating letters to improve:', error);
        throw error;
      }

      if (data && data.length > 0) {
        setLettersToImprove(data[0].letters);
      }
    } catch (error) {
      console.error('Error updating letters to improve:', error);
    }
  };

  const addHandwritingSample = async (newSample) => {
    try {
      console.log('Adding sample to database:', newSample);
      
      // Insert into Supabase
      const { data, error } = await supabase
        .from('user_uploads')
        .insert([
          {
            user_id: user.id,
            image_url: newSample.image,
            type: newSample.type,
            focus: newSample.focus,
            score: newSample.score,
            feedback: newSample.feedback,
            status: newSample.status,
            analysis: newSample.analysis
          }
        ])
        .select();

      if (error) {
        console.error('Error inserting sample:', error);
        throw error;
      }

      console.log('Inserted sample:', data);

      // Update letters to improve if analysis contains letters_to_improve
      if (newSample.analysis && newSample.analysis.letters_to_improve) {
        await updateLettersToImprove(newSample.analysis.letters_to_improve);
      }

      // Update local state with the returned data
      if (data && data.length > 0) {
        const insertedSample = data[0];
        const formattedSample = {
          id: insertedSample.id,
          type: insertedSample.type || 'Handwriting Sample',
          focus: insertedSample.focus || 'Overall handwriting',
          score: insertedSample.score || 0,
          feedback: insertedSample.feedback || 'No feedback yet',
          uploadedAt: new Date(insertedSample.uploaded_at),
          status: insertedSample.status || 'analyzed',
          image: insertedSample.image_url,
          analysis: insertedSample.analysis || null
        };
        
        setHandwritingSamples(prev => [formattedSample, ...prev]);
        return formattedSample;
      }
    } catch (error) {
      console.error('Error adding handwriting sample:', error);
      throw error;
    }
  };

  const value = {
    handwritingSamples,
    isLoading,
    lettersToImprove,
    addHandwritingSample,
    refreshSamples: fetchHandwritingSamples,
    refreshLetters: fetchLettersToImprove
  };

  return (
    <HandwritingContext.Provider value={value}>
      {children}
    </HandwritingContext.Provider>
  );
}

export function useHandwriting() {
  const context = useContext(HandwritingContext);
  if (!context) {
    throw new Error('useHandwriting must be used within a HandwritingProvider');
  }
  return context;
}