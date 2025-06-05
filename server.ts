import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

// API endpoint for job analysis
app.post('/api/analyze', async (req, res) => {
  try {
    const { jobDescription, resume } = req.body;

    if (!jobDescription || !resume) {
      return res.status(400).json({ error: 'Job description and resume are required' });
    }

    const prompt = `
      Please analyze the following job description and resume:
      
      Job Description:
      ${jobDescription}
      
      Resume:
      ${resume}
      
      Please provide:
      1. A summary of the job description
      2. A profile of the ideal candidate
      3. Specific suggestions to align the resume with the job description
      
      Format the response as JSON with the following structure:
      {
        "summary": "job description summary",
        "idealCandidate": "ideal candidate profile",
        "resumeSuggestions": "resume alignment suggestions"
      }
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the response text as JSON
    const analysis = JSON.parse(text);
    
    res.json(analysis);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while analyzing the job and resume' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 