import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Card, CardContent, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import Layout from '../components/Layout';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import { useGamification } from '../components/GamificationOverlay';

interface Briefing {
  id: number;
  title: string;
  videoUrl: string;
}

export default function Resources() {
  const [briefings, setBriefings] = useState<Briefing[]>([]);
  const [activeVideo, setActiveVideo] = useState<Briefing | null>(null);
  const { earnCredits } = useGamification();

  useEffect(() => {
    fetch('/data/briefings.json')
      .then(res => res.json())
      .then(data => setBriefings(data))
      .catch(console.error);
  }, []);

  const handleVideoComplete = () => {
    if (activeVideo) {
      earnCredits(10, `Watched Briefing: ${activeVideo.title}`, 'Reflect');
      setActiveVideo(null);
    }
  };

  return (
    <Layout>
      <Box sx={{ minHeight: '100vh', bgcolor: '#0b1730', color: '#f8fafc', pb: 12, pt: 8 }}>
        
        {/* Header */}
        <Box sx={{ p: 4, textAlign: 'center', background: 'linear-gradient(135deg, #0b1730, #132a52)' }}>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>Executive Briefings</Typography>
          <Typography variant="body1" sx={{ color: '#94a3b8' }}>
            Curated 2-minute strategic insights for CEOs transitioning to a Generative Organization.
          </Typography>
          <Typography variant="caption" sx={{ display: 'inline-block', mt: 2, bgcolor: '#0E9C74', px: 1.5, py: 0.5, borderRadius: 2, fontWeight: 'bold' }}>
            Earn +10 MI Credits per video
          </Typography>
        </Box>

        <Container>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2, mt: 3 }}>
            {briefings.map((briefing) => (
              <Card 
                key={briefing.id} 
                onClick={() => setActiveVideo(briefing)}
                sx={{ 
                  bgcolor: '#1e293b', 
                  color: 'white', 
                  borderRadius: 3, 
                  cursor: 'pointer',
                  border: '1px solid #334155',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.02)', borderColor: '#f59e0b' }
                }}
              >
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: '20px !important' }}>
                  <Box sx={{ color: '#0E9C74', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PlayCircleOutlineIcon sx={{ fontSize: 40 }} />
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 'bold', letterSpacing: 1, textTransform: 'uppercase' }}>
                      Briefing {briefing.id < 10 ? `0${briefing.id}` : briefing.id}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
                      {briefing.title}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>

        {/* Video Player Dialog */}
        <Dialog 
          open={!!activeVideo} 
          onClose={() => setActiveVideo(null)}
          fullWidth
          maxWidth="sm"
          PaperProps={{ sx: { bgcolor: '#0b1730', color: 'white', m: 2, borderRadius: 3 } }}
        >
          {activeVideo && (
            <>
              <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', p: 2 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#0E9C74', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    Briefing {activeVideo.id < 10 ? `0${activeVideo.id}` : activeVideo.id}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                    {activeVideo.title}
                  </Typography>
                </Box>
                <IconButton onClick={() => setActiveVideo(null)} sx={{ color: 'white' }}><CloseIcon /></IconButton>
              </DialogTitle>
              <DialogContent sx={{ p: 0, bgcolor: 'black', display: 'flex', justifyContent: 'center' }}>
                <video 
                  controls 
                  autoPlay 
                  src={activeVideo.videoUrl} 
                  style={{ width: '100%', maxHeight: '60vh' }} 
                  onEnded={handleVideoComplete}
                />
              </DialogContent>
              <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                  Finish the video to automatically earn +10 MI Credits!
                </Typography>
              </DialogActions>
            </>
          )}
        </Dialog>

      </Box>
    </Layout>
  );
}
