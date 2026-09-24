import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  Box, Typography, Button, IconButton, Slider, ToggleButton, 
  ToggleButtonGroup, AppBar, Toolbar, Container, Paper
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

export default function ModulePage() {
  const router = useRouter();
  const { id } = router.query;
  const moduleId = typeof id === 'string' ? id : '1';

  const [mode, setMode] = useState('read');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isReflectionOpen, setIsReflectionOpen] = useState(false);
  const [moduleInfo, setModuleInfo] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    fetch('/data/all_modules.json')
      .then(res => res.json())
      .then(data => {
        const found = data.find((m: any) => m.linear_id.toString() === id.toString());
        if (found) setModuleInfo(found);
      });
  }, [id]);

  const handleModeChange = (e: any, newMode: string) => {
    if (newMode !== null) setMode(newMode);
  };

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleProgressChange = (e: any, newValue: number | number[]) => setProgress(newValue as number);

  if (!moduleInfo) {
    return <Layout><Box sx={{ p: 4, pt: 12, textAlign: 'center' }}><Typography>Loading the deep dive...</Typography></Box></Layout>;
  }

  // Split the massive 400-word paragraph into readable chunks
  const paragraphs = moduleInfo.core_lesson.split(/(?<=\.)\s+/);

  return (
    <Layout>
      <AppBar position="fixed" elevation={0} sx={{ top: 70, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', zIndex: 10 }}>
        <Toolbar sx={{ minHeight: '56px !important', display: 'flex', justifyContent: 'space-between' }}>
          <IconButton edge="start" onClick={() => router.back()} sx={{ color: '#0b1730' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </IconButton>
          <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 'bold' }}>
            {moduleInfo.phase} PHASE
          </Typography>
          <Box sx={{ width: 40 }} />
        </Toolbar>
      </AppBar>

      <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', pt: 10, pb: 16 }}>
        <Container maxWidth="md" sx={{ px: 3, pt: 6 }}>
          <Typography variant="overline" sx={{ color: '#f59e0b', fontWeight: 900, letterSpacing: 2 }}>
            {moduleInfo.chapter}
          </Typography>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 900, color: '#0b1730', lineHeight: 1.2, mt: 1, mb: 3 }}>
            {moduleInfo.title}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 5 }}>
            <ToggleButtonGroup value={mode} exclusive onChange={handleModeChange} sx={{ bgcolor: '#e2e8f0', p: 0.5, borderRadius: '50px', '& .MuiToggleButton-root': { border: 'none', borderRadius: '50px !important', px: 4, py: 1, textTransform: 'none', fontWeight: 600, color: '#64748b', '&.Mui-selected': { bgcolor: '#0b1730', color: 'white' } } }}>
              <ToggleButton value="read">Read</ToggleButton>
              <ToggleButton value="listen">Listen</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {mode === 'listen' && (
            <Paper elevation={0} sx={{ p: 3, mb: 5, borderRadius: 4, bgcolor: '#0b1730', color: 'white', boxShadow: '0 10px 15px -3px rgb(11 23 48 / 0.3)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Box sx={{ width: 120, height: 120, borderRadius: '50%', bgcolor: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid #f59e0b' }}>
                  <Typography variant="h2" sx={{ color: '#f59e0b' }}>🎧</Typography>
                </Box>
              </Box>
              <Slider value={progress} onChange={handleProgressChange} sx={{ color: '#f59e0b', height: 4 }} />
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
                <IconButton onClick={handlePlayPause} sx={{ bgcolor: '#f59e0b', color: '#0b1730', width: 64, height: 64, '&:hover': { bgcolor: '#d97706' } }}>
                  {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </IconButton>
              </Box>
            </Paper>
          )}

          <Box sx={{ typography: 'body1', lineHeight: 1.9, color: '#1e293b', fontSize: '1.15rem', opacity: mode === 'listen' ? 0.5 : 1, transition: 'opacity 0.3s ease' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, color: '#f59e0b', fontStyle: 'italic' }}>
              {moduleInfo.reflection_question}
            </Typography>
            {paragraphs.map((p: string, idx: number) => {
              if (!p.trim()) return null;
              if (idx > 0 && idx % 3 === 0) {
                return (
                  <Box key={idx} sx={{ my: 4, p: 3, borderLeft: '4px solid #f59e0b', bgcolor: '#fffbeb', borderRadius: '0 8px 8px 0' }}>
                    <Typography variant="subtitle1" sx={{ fontStyle: 'italic', color: '#b45309', fontWeight: 700 }}>
                      "{p.trim()}"
                    </Typography>
                  </Box>
                );
              }
              return (
                <Typography key={idx} variant="body1" paragraph sx={{ fontSize: '1.15rem', lineHeight: 1.9, mb: 3 }}>
                  {p.trim()}.
                </Typography>
              );
            })}
          </Box>
          
          <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
            <Button variant="outlined" size="large" onClick={() => router.push(`/module/${parseInt(moduleId) + 1}`)} sx={{ color: '#0b1730', borderColor: '#0b1730', borderWidth: 2, fontWeight: 'bold', px: 4, py: 1.5, borderRadius: 2 }}>
              Next Module ➔
            </Button>
          </Box>
        </Container>
      </Box>

      <Paper elevation={24} sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, p: 2, bgcolor: 'white', borderTop: '1px solid #e2e8f0', zIndex: 1000 }}>
        <Container maxWidth="sm">
          <Button variant="contained" fullWidth size="large" sx={{ bgcolor: '#3b82f6', color: 'white', py: 2, fontSize: '1.1rem', fontWeight: 'bold', borderRadius: 3 }} onClick={() => setIsReflectionOpen(true)}>
            Reflect & Earn 5 Credits ✅
          </Button>
        </Container>
      </Paper>

      <ReflectionModal open={isReflectionOpen} onClose={() => setIsReflectionOpen(false)} moduleId={moduleId} />
    </Layout>
  );
}
