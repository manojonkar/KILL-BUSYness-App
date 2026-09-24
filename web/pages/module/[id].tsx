import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  Box, Typography, Button, IconButton, Slider, ToggleButton, 
  ToggleButtonGroup, AppBar, Toolbar, Container, Paper
} from '@mui/material';
import Layout from '../../components/Layout';
import ReflectionModal from '../../components/ReflectionModal';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

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
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch('/data/all_modules.json')
      .then(res => res.json())
      .then(data => {
        const found = data.find((m: any) => m.linear_id.toString() === id.toString());
        if (found) setModuleInfo(found);
      });
      
    // Cleanup audio on unmount
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
      }
    };
  }, [id, audioElement]);

  const handleModeChange = (e: any, newMode: string) => {
    if (newMode !== null) setMode(newMode);
  };

  const loadAndPlayAudio = async () => {
    if (audioUrl && audioElement) {
      if (isPlaying) {
        audioElement.pause();
        setIsPlaying(false);
      } else {
        audioElement.play();
        setIsPlaying(true);
      }
      return;
    }

    if (!moduleInfo || !moduleInfo.core_lesson) return;
    
    setIsLoadingAudio(true);
    try {
      const res = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: moduleInfo.core_lesson.replace(/[#*`_]/g, '') })
      });
      const data = await res.json();
      if (data.audioUrl) {
        setAudioUrl(data.audioUrl);
        const audio = new Audio(data.audioUrl);
        
        audio.addEventListener('timeupdate', () => {
          setProgress((audio.currentTime / audio.duration) * 100 || 0);
        });
        
        audio.addEventListener('ended', () => {
          setIsPlaying(false);
          setProgress(100);
        });

        setAudioElement(audio);
        audio.play();
        setIsPlaying(true);
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoadingAudio(false);
  };

  const handlePlayPause = () => loadAndPlayAudio();
  const handleProgressChange = (e: any, newValue: number | number[]) => setProgress(newValue as number);

  if (!moduleInfo) {
    return <Layout><Box sx={{ p: 4, pt: 12, textAlign: 'center' }}><Typography>Loading the module...</Typography></Box></Layout>;
  }

  return (
    <Layout>
      <AppBar position="fixed" elevation={0} sx={{ top: 70, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', zIndex: 10 }}>
        <Toolbar sx={{ minHeight: '56px !important', display: 'flex', justifyContent: 'space-between' }}>
          <IconButton edge="start" onClick={() => router.back()} sx={{ color: '#0b1730' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </IconButton>
          {moduleInfo.phase ? (
            <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>
              {moduleInfo.phase} PHASE
            </Typography>
          ) : <Box />}
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
                <IconButton onClick={handlePlayPause} disabled={isLoadingAudio} sx={{ bgcolor: '#f59e0b', color: '#0b1730', width: 64, height: 64, '&:hover': { bgcolor: '#d97706' } }}>
                  {isLoadingAudio ? <Typography sx={{ fontSize: '1rem', fontWeight: 'bold' }}>...</Typography> : (isPlaying ? <PauseIcon /> : <PlayIcon />)}
                </IconButton>
              </Box>
            </Paper>
          )}

          <Box sx={{ 
            typography: 'body1', 
            lineHeight: 1.9, 
            color: '#1e293b', 
            fontSize: '1.15rem', 
            opacity: mode === 'listen' ? 0.5 : 1, 
            transition: 'opacity 0.3s ease',
            '& img': { maxWidth: '100%', height: 'auto', borderRadius: '8px', my: 4, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' },
            '& h1, & h2, & h3': { color: '#0b1730', fontWeight: 800, mt: 4, mb: 2 },
            '& blockquote': { borderLeft: '4px solid #f59e0b', bgcolor: '#fffbeb', p: 3, my: 4, borderRadius: '0 8px 8px 0', fontStyle: 'italic', color: '#b45309', fontWeight: 700 },
            '& table': { width: '100%', borderCollapse: 'collapse', mb: 4 },
            '& th, & td': { border: '1px solid #e2e8f0', p: 2, textAlign: 'left' },
            '& th': { bgcolor: '#f1f5f9', fontWeight: 'bold' }
          }}>
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
              {moduleInfo.core_lesson}
            </ReactMarkdown>
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
