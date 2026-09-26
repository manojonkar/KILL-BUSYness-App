import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, TextField, IconButton, Paper, Button, Container, AppBar, Toolbar, Stack } from '@mui/material';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function CoachPage() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inlineFeedback, setInlineFeedback] = useState<Record<string, 'up' | 'down'>>({});

  const handleInlineFeedback = async (logId: string, feedback: 'up' | 'down') => {
    if (!logId) return;
    setInlineFeedback(prev => ({ ...prev, [logId]: feedback }));
    try {
      await fetch('/api/coach/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ log_id: logId, feedback })
      });
    } catch (error) {
      console.error('Failed to submit feedback', error);
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const userMessage = input;
    setInput('');
    
    const loadingPhrases = [
      "Thanks for your query. Let me consult the KILL BUSYness frameworks...",
      "Give me just a minute to pull the right OD perspective for you...",
      "Reflecting on that... let me see what the methodology suggests.",
      "That's a great question. Processing your query now...",
      "Let me dive into the book and get the best answer for you..."
    ];
    const randomPhrase = loadingPhrases[Math.floor(Math.random() * loadingPhrases.length)];
    const loadingId = 'loading-' + Date.now().toString();

    setMessages((prev) => [
      ...prev, 
      { id: Date.now().toString(), role: 'user', content: userMessage },
      { id: loadingId, role: 'assistant', content: randomPhrase, isTemp: true }
    ]);
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, { role: 'user', content: userMessage }] })
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }
      
      const data = await res.json();
      
      setMessages((prev) => prev.map(msg => 
        msg.id === loadingId 
          ? { id: Date.now().toString(), role: 'assistant', content: data.text || "Sorry, I received an empty response. Please try again.", log_id: data.log_id } 
          : msg
      ));
    } catch (err: any) {
      console.error("Submit error:", err);
      let errorMsg = "An error occurred while connecting to the Coach. Please try again.";
      if (err.message.includes("503") || err.message.includes("high demand")) {
        errorMsg = "Google's AI servers are currently experiencing extremely high demand and are overloaded. Please wait a moment and try asking again.";
      }
      
      setMessages((prev) => prev.map(msg => 
        msg.id === loadingId 
          ? { id: Date.now().toString(), role: 'assistant', content: `⚠️ **Server Overloaded**\n\n${errorMsg}` } 
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };
  
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  
  // Feedback state for the last AI message
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<'yes' | 'no' | null>(null);
  const [customQuestion, setCustomQuestion] = useState('');

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    if (messages.length > 0 && messages[messages.length - 1].role === 'assistant' && !isLoading) {
      if (messages[messages.length - 1].content.includes('[END_SESSION]')) {
        setShowFeedback(true);
      } else {
        setShowFeedback(false);
        setFeedbackGiven(null);
      }
    } else {
      setShowFeedback(false);
      setFeedbackGiven(null);
    }
  }, [messages, isLoading]);

  const handleEmailSubmit = () => {
    const subject = encodeURIComponent('Question for the KILL BUSYness Team');
    const body = encodeURIComponent(`Hello,\n\nI have a question regarding KILL BUSYness:\n\n${customQuestion}\n\nBest regards,`);
    window.location.href = `mailto:manoj@managementinnovations.co.in?subject=${subject}&body=${body}`;
    setFeedbackGiven(null);
    setCustomQuestion('');
  };

  return (
    <Layout>
      <AppBar position="fixed" elevation={0} sx={{ top: 70, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', zIndex: 10 }}>
        <Toolbar sx={{ minHeight: '56px !important', display: 'flex', alignItems: 'center' }}>
          <IconButton edge="start" onClick={() => router.back()} sx={{ color: '#0b1730', mr: 2 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </IconButton>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#0b1730' }}>AI Coach</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ pt: 10, pb: 12, height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column' }}>
        
        {/* Messages List */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {messages.length === 0 && (
            <Box sx={{ textAlign: 'center', mt: 10, color: '#64748b' }}>
              <Typography variant="h1" sx={{ fontSize: '3rem', mb: 2 }}>🤖</Typography>
              <Typography variant="h6" fontWeight="bold" color="#0b1730">Ask me anything about KILL BUSYness!</Typography>
              <Typography variant="body2">I have memorized every module, chapter, and framework.</Typography>
            </Box>
          )}

          {messages?.map((m: any) => (
            <Box key={m.id} sx={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <Paper sx={{ 
                p: 2, 
                maxWidth: '85%', 
                bgcolor: m.role === 'user' ? '#0b1730' : 'white',
                color: m.role === 'user' ? 'white' : (m.isTemp ? '#64748b' : '#0b1730'),
                borderRadius: 4,
                borderBottomRightRadius: m.role === 'user' ? 4 : 24,
                borderBottomLeftRadius: m.role === 'user' ? 24 : 4,
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                whiteSpace: 'pre-wrap',
                opacity: m.isTemp ? 0.7 : 1,
                fontStyle: m.isTemp ? 'italic' : 'normal',
                animation: m.isTemp ? 'pulse 1.5s infinite' : 'none',
                '@keyframes pulse': {
                  '0%': { opacity: 0.6 },
                  '50%': { opacity: 0.9 },
                  '100%': { opacity: 0.6 }
                }
              }}>
                <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                  {m.content.replace('\\[END_SESSION\\]', '').replace('[END_SESSION]', '').trim()}
                </Typography>
                {m.role === 'assistant' && !m.isTemp && m.log_id && (
                  <Stack direction="row" spacing={1} sx={{ mt: 2, pt: 1, borderTop: '1px solid #f1f5f9', justifyContent: 'flex-end' }}>
                    <IconButton 
                      size="small" 
                      onClick={() => handleInlineFeedback(m.log_id, 'up')}
                      color={inlineFeedback[m.log_id] === 'up' ? 'success' : 'default'}
                    >
                      {inlineFeedback[m.log_id] === 'up' ? <ThumbUpIcon fontSize="small" /> : <ThumbUpOffAltIcon fontSize="small" />}
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleInlineFeedback(m.log_id, 'down')}
                      color={inlineFeedback[m.log_id] === 'down' ? 'error' : 'default'}
                    >
                      {inlineFeedback[m.log_id] === 'down' ? <ThumbDownIcon fontSize="small" /> : <ThumbDownOffAltIcon fontSize="small" />}
                    </IconButton>
                  </Stack>
                )}
              </Paper>
            </Box>
          ))}
          
          {/* Feedback UI blocks appended after the last AI message finishes */}
          {showFeedback && (
            <Box sx={{ alignSelf: 'flex-start', maxWidth: '85%', mt: 2, pl: 2 }}>
              {!feedbackGiven && (
                <Box>
                  <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>Were you satisfied with this answer?</Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="outlined" size="small" onClick={() => setFeedbackGiven('yes')} sx={{ borderRadius: 10 }}>👍 Yes</Button>
                    <Button variant="outlined" size="small" color="error" onClick={() => setFeedbackGiven('no')} sx={{ borderRadius: 10 }}>👎 No</Button>
                  </Box>
                </Box>
              )}

              {feedbackGiven === 'yes' && (
                <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 'bold' }}>Awesome! Let me know if you have any other questions.</Typography>
              )}

              {feedbackGiven === 'no' && (
                <Paper sx={{ p: 3, borderRadius: 4, bgcolor: '#fef2f2', border: '1px solid #fca5a5' }}>
                  <Typography variant="subtitle2" sx={{ color: '#b91c1c', mb: 2, fontWeight: 'bold' }}>
                    What would you like to ask the KILL BUSYness team directly?
                  </Typography>
                  <TextField 
                    fullWidth 
                    multiline 
                    rows={3} 
                    variant="outlined" 
                    placeholder="Type your specific question here..."
                    value={customQuestion}
                    onChange={(e) => setCustomQuestion(e.target.value)}
                    sx={{ bgcolor: 'white', mb: 2 }}
                  />
                  <Button variant="contained" color="error" fullWidth onClick={handleEmailSubmit}>
                    Email KillBUSYness Team
                  </Button>
                </Paper>
              )}
            </Box>
          )}

          <div ref={messagesEndRef} />
        </Box>

        {/* Input Form */}
        <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 10, boxShadow: '0 -10px 40px rgba(0,0,0,0.05)' }}>
          <form onSubmit={handleCustomSubmit} style={{ display: 'flex', gap: '8px' }}>
            <TextField
              fullWidth
              variant="standard"
              placeholder="Ask the AI Coach..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              InputProps={{ disableUnderline: true, sx: { px: 2, py: 1 } }}
            />
            <IconButton type="submit" disabled={isLoading || !input} sx={{ bgcolor: '#f59e0b', color: 'white', '&:hover': { bgcolor: '#d97706' } }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </IconButton>
          </form>
        </Box>

      </Container>
    </Layout>
  );
}
