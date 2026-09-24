import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { 
  Box, 
  Typography, 
  Button, 
  IconButton, 
  Slider, 
  ToggleButton, 
  ToggleButtonGroup, 
  AppBar, 
  Toolbar, 
  Container,
  Paper
} from '@mui/material';
import Layout from '../../components/Layout';
import ReflectionModal from '../../components/ReflectionModal';


const PlayIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/>
  </svg>
);

const PauseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
    <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
  </svg>
);

const SkipBackIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <polyline points="7 1 3 5 7 9" />
    <text x="12" y="16" fontSize="8" strokeWidth="1">15</text>
  </svg>
);

const SkipForwardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11V9a4 4 0 0 0-4-4H3" />
    <polyline points="17 1 21 5 17 9" />
    <text x="12" y="16" fontSize="8" strokeWidth="1">15</text>
  </svg>
);

const BackIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

// Mock dynamic data
const modulesData: Record<string, any> = {
  '1': {
    title: 'The Illusion of Urgency',
    duration: '8 mins',
    author: 'Executive Coach Sarah',
    phase: 'Phase 1: Reflect',
    content: [
      { type: 'paragraph', text: "In today's hyper-connected world, we often confuse urgency with importance. Emails ping, Slack notifications pop up, and our immediate reaction is to respond. We feel productive because we are busy." },
      { type: 'paragraph', text: "But true productivity is not about doing more things; it's about doing the right things. The most effective executives understand the difference between noise and signal." },
      { type: 'heading', text: "The Cost of Context Switching" },
      { type: 'paragraph', text: "Every time you stop a deep work task to check an \"urgent\" message, it takes an average of 23 minutes to regain your focus. Over a week, this translates to hours of lost deep cognitive work. You aren't just losing time; you're losing mental bandwidth." },
      { type: 'quote', text: "Busyness is often a lazy way of avoiding the hard work of deciding what actually matters." },
      { type: 'paragraph', text: "Take a moment today to evaluate your calendar. Are your meetings and tasks driving your core objectives, or are they simply filling time?" }
    ]
  },
  '2': {
    title: 'Owning Your Calendar',
    duration: '10 mins',
    author: 'Executive Coach Sarah',
    phase: 'Phase 2: Own',
    content: [
      { type: 'paragraph', text: "Time is the only resource you can never get back. Yet, many leaders let others dictate how they spend their days." },
      { type: 'quote', text: "If you don't prioritize your life, someone else will." },
      { type: 'heading', text: "Proactive vs. Reactive Leadership" },
      { type: 'paragraph', text: "Owning your calendar means shifting from a reactive state to a proactive one. Block out time for deep work, strategic thinking, and rest. Protect these blocks as fiercely as you would a meeting with your board." }
    ]
  },
  '3': {
    title: 'Asserting Boundaries',
    duration: '12 mins',
    author: 'Executive Coach Sarah',
    phase: 'Phase 3: Assert',
    content: [
      { type: 'paragraph', text: "Saying 'no' is a complete sentence. Many leaders struggle with boundaries because they fear disappointing others or missing out on opportunities." },
      { type: 'heading', text: "The Power of the Graceful No" },
      { type: 'paragraph', text: "Asserting boundaries isn't about being unhelpful; it's about being focused. When you say 'no' to a low-impact task, you are saying 'yes' to your strategic priorities." },
      { type: 'quote', text: "Every 'yes' is a 'no' to something else. Choose wisely." }
    ]
  }
};

export default function ModulePage() {
  const router = useRouter();
  const { id } = router.query;
  const moduleId = (typeof id === 'string' ? id : '1') || '1';
  
  const [mode, setMode] = useState<'read' | 'listen'>('read');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isReflectionOpen, setIsReflectionOpen] = useState(false);

  const moduleInfo = modulesData[moduleId] || {
    title: `Module ${moduleId}`,
    duration: '10 mins',
    author: 'Executive Coach Sarah',
    phase: 'Phase X',
    content: [
      { type: 'paragraph', text: `This is the content for module ${moduleId}. Dynamic loading in action.` }
    ]
  };

  const handleModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: 'read' | 'listen',
  ) => {
    if (newMode !== null) {
      setMode(newMode);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (event: Event, newValue: number | number[]) => {
    setProgress(newValue as number);
  };

  return (
    <Layout>
      <Box sx={{ minHeight: '100vh', bgcolor: '#fdfdfc', pb: 15 }}>
        {/* Top App Bar */}
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: '#0b1730', color: 'white' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => router.back()} aria-label="back">
              <BackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, ml: 2, fontWeight: 'bold' }}>
              Module {moduleId}
            </Typography>
            <Typography variant="subtitle2" sx={{ color: '#f59e0b' }}>
              {moduleInfo.phase}
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="sm" sx={{ mt: 4 }}>
          {/* Title Area */}
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 800, color: '#0b1730' }}>
            {moduleInfo.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
            Duration: {moduleInfo.duration} • By {moduleInfo.author}
          </Typography>

          {/* Toggle Read/Listen */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 5 }}>
            <ToggleButtonGroup
              value={mode}
              exclusive
              onChange={handleModeChange}
              aria-label="read or listen mode"
              sx={{
                bgcolor: '#e2e8f0',
                p: 0.5,
                borderRadius: '50px',
                '& .MuiToggleButton-root': {
                  border: 'none',
                  borderRadius: '50px !important',
                  px: 4,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 600,
                  color: '#64748b',
                  '&.Mui-selected': {
                    bgcolor: '#0b1730',
                    color: 'white',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                    '&:hover': {
                      bgcolor: '#0b1730',
                    }
                  }
                }
              }}
            >
              <ToggleButton value="read" aria-label="read mode">
                Read
              </ToggleButton>
              <ToggleButton value="listen" aria-label="listen mode">
                Listen
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Audio Player UI */}
          {mode === 'listen' && (
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                mb: 5, 
                borderRadius: 4, 
                bgcolor: '#0b1730', 
                color: 'white',
                boxShadow: '0 10px 15px -3px rgb(11 23 48 / 0.3)'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Box sx={{ 
                  width: 120, 
                  height: 120, 
                  borderRadius: '50%', 
                  bgcolor: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '4px solid #f59e0b'
                }}>
                  <Typography variant="h2" sx={{ color: '#f59e0b' }}>🎧</Typography>
                </Box>
              </Box>

              <Slider
                value={progress}
                onChange={handleProgressChange}
                aria-label="time-indicator"
                sx={{
                  color: '#f59e0b',
                  height: 4,
                  '& .MuiSlider-thumb': {
                    width: 12,
                    height: 12,
                    '&:hover, &.Mui-focusVisible': {
                      boxShadow: '0px 0px 0px 8px rgb(245 158 11 / 16%)',
                    },
                  },
                  '& .MuiSlider-rail': {
                    bgcolor: 'rgba(255,255,255,0.2)',
                  },
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: -1, mb: 2 }}>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>0:00</Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>8:45</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                <IconButton sx={{ color: 'white' }}>
                  <SkipBackIcon />
                </IconButton>
                <IconButton 
                  onClick={handlePlayPause}
                  sx={{ 
                    bgcolor: '#f59e0b', 
                    color: '#0b1730',
                    width: 64,
                    height: 64,
                    '&:hover': { bgcolor: '#d97706' }
                  }}
                >
                  {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </IconButton>
                <IconButton sx={{ color: 'white' }}>
                  <SkipForwardIcon />
                </IconButton>
              </Box>
            </Paper>
          )}

          {/* Module Content */}
          <Box sx={{ 
            typography: 'body1', 
            lineHeight: 1.8, 
            color: '#334155',
            fontSize: '1.1rem',
            opacity: mode === 'listen' ? 0.5 : 1,
            transition: 'opacity 0.3s ease'
          }}>
            {moduleInfo.content.map((block: any, idx: number) => {
              if (block.type === 'paragraph') {
                return (
                  <Typography key={idx} variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                    {block.text}
                  </Typography>
                );
              } else if (block.type === 'heading') {
                return (
                  <Typography key={idx} variant="h6" gutterBottom sx={{ mt: 4, mb: 2, color: '#0b1730', fontWeight: 'bold' }}>
                    {block.text}
                  </Typography>
                );
              } else if (block.type === 'quote') {
                return (
                  <Box key={idx} sx={{ 
                    my: 4, 
                    p: 3, 
                    borderLeft: '4px solid #f59e0b', 
                    bgcolor: '#fffbeb',
                    borderRadius: '0 8px 8px 0'
                  }}>
                    <Typography variant="subtitle1" sx={{ fontStyle: 'italic', color: '#b45309', fontWeight: 500 }}>
                      "{block.text}"
                    </Typography>
                  </Box>
                );
              }
              return null;
            })}
          </Box>
          
          {/* Next Module Button */}
          <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => router.push(`/module/${parseInt(moduleId) + 1}`)}
              sx={{
                color: '#0b1730',
                borderColor: '#0b1730',
                borderWidth: 2,
                fontWeight: 'bold',
                px: 4,
                py: 1.5,
                borderRadius: 2,
                '&:hover': {
                  borderColor: '#f59e0b',
                  color: '#f59e0b',
                  borderWidth: 2,
                }
              }}
            >
              Next Module →
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Prominent Reflect Button */}
      <Paper 
        elevation={24} 
        sx={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          p: 2, 
          bgcolor: 'white',
          borderTop: '1px solid #e2e8f0',
          zIndex: 1000
        }}
      >
        <Container maxWidth="sm">
          <Button 
            variant="contained" 
            fullWidth
            size="large"
            sx={{ 
              bgcolor: '#3b82f6', // Reflect phase blue
              color: 'white',
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: 3,
              textTransform: 'none',
              boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)',
              '&:hover': {
                bgcolor: '#2563eb',
              }
            }}
            onClick={() => setIsReflectionOpen(true)}
          >
            Reflect & Earn 5 Credits ✨
          </Button>
        </Container>
      </Paper>

      {/* Interactive Reflection Modal */}
      <ReflectionModal
        open={isReflectionOpen}
        onClose={() => setIsReflectionOpen(false)}
        moduleId={moduleId}
      />
    </Layout>
  );
}
