'use client';


import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context';


const HandwritingContext = createContext();


export function HandwritingProvider({ children }) {
  const [handwritingSamples, setHandwritingSamples] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();


  // Fetch user's handwriting samples
  useEffect(() => {
    if (user) {
      fetchHandwritingSamples();
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
    addHandwritingSample,
    refreshSamples: fetchHandwritingSamples
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

