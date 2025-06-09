import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { JobAnalysisResponse } from './types.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
console.log('google api key:', process.env.GOOGLE_API_KEY);
// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');


const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: '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',
  defaultHeaders: {
    'HTTP-Referer': 'aOliver-test', // Optional. Site URL for rankings on openrouter.ai.
    'X-Title': 'aOliver-test', // Optional. Site title for rankings on openrouter.ai.
  },
});
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
      4. A new version of the resume that better aligns with the job description
      
      Format the response as JSON with the following structure:
      {
        "summary": "job description summary",
        "idealCandidate": "ideal candidate profile",
        "resumeSuggestions": "resume alignment suggestions",
        "newResume": "new resume"
      }
      and return it as a json string without special characters.
    `;

    //google/gemini-2.0-flash-exp:free
    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-4-maverick:free",
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });
    console.log('completion.choices[0].message.content', completion.choices[0].message.content);
    const responseString:string = completion.choices[0].message.content ?? '';
    const jsonString = responseString.replace(/^```json\n/, '').replace(/\n```$/, '').replace(/'/,'\'');;
    console.log(jsonString);
    const parsedObject: JobAnalysisResponse = JSON.parse(jsonString);
    res.json(parsedObject);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while analyzing the job and resume' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 