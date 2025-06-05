import axios from 'axios';
import type { JobAnalysisResponse } from '../types/api';

const API_URL = 'http://localhost:3001/api/analyze';

export const analyzeJobAndResume = async (jobDescription: string, resume: string): Promise<JobAnalysisResponse> => {
  try {
    const response = await axios.post(API_URL, {
      jobDescription,
      resume
    });
    return response.data;
  } catch (error) {
    console.error('Error analyzing job and resume:', error);
    throw error;
  }
}; 