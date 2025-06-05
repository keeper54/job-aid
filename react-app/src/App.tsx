import { useState } from 'react'
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { analyzeJobAndResume } from './services/api'

function App() {
  const [jobDescription, setJobDescription] = useState('')
  const [resume, setResume] = useState('')
  const [loading, setLoading] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const handleSubmit = async () => {
    if (!jobDescription || !resume) {
      alert('Please fill in both the job description and resume fields')
      return
    }

    setLoading(true)
    try {
      const result = await analyzeJobAndResume(jobDescription, resume)
      const resultWindow = window.open('', '_blank')
      if (resultWindow) {
        resultWindow.document.write(`
          <html>
            <head>
              <title>Job Analysis Results</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
                h2 { color: #1976d2; }
                .section { margin-bottom: 30px; }
              </style>
            </head>
            <body>
              <h2>Job Description Summary</h2>
              <div class="section">${result.summary}</div>
              
              <h2>Ideal Candidate Profile</h2>
              <div class="section">${result.idealCandidate}</div>
              
              <h2>Resume Alignment Suggestions</h2>
              <div class="section">${result.resumeSuggestions}</div>

              <h2>New Resume Suggestion</h2>
              <div class="section">${result.newResume}</div>
              </body>
          </html>
        `)
        resultWindow.document.close()
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred while analyzing the job and resume. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Job Description Analyzer
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Job Description"
            multiline
            rows={6}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            fullWidth
            variant="outlined"
          />
          
          <TextField
            label="Resume"
            multiline
            rows={6}
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            fullWidth
            variant="outlined"
          />
          
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? 'Analyzing...' : 'Analyze Job and Resume'}
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}

export default App
