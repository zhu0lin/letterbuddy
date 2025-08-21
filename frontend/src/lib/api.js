// API utility functions for backend communication

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = {
  // Handwriting analysis
  async analyzeHandwriting(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await fetch(`${API_BASE_URL}/handwriting/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error(`Network Error: Unable to connect to the analysis service. Please check your internet connection and try again. If the problem persists, the service may be temporarily unavailable.`);
      }
      throw error;
    }
  },

  // Get demo analysis
  async getDemoAnalysis() {
    try {
      const response = await fetch(`${API_BASE_URL}/handwriting/demo`);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error(`Network Error: Unable to connect to the analysis service. Please check your internet connection and try again.`);
      }
      throw error;
    }
  },

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error(`Network Error: Unable to connect to the analysis service.`);
      }
      throw error;
    }
  }
};
