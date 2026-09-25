import React from 'react';
import { Box, Typography, Card, CardContent, Grid, LinearProgress, Container, Button, Avatar } from '@mui/material';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';
import { useGamification } from '../components/GamificationOverlay';

const themeColors = {
  navyDark: '#0b1730',
  navyLight: '#1e293b',
  gold: '#f59e0b',
  textMain: '#f8fafc',
  bgLight: '#f8fafc',
  reflect: '#3b82f6',
  own: '#f59e0b',
  assert: '#10b981',
  run: '#8b5cf6'
};

export default function Dashboard() {
  const router = useRouter();
  const [userName, setUserName] = React.useState('Loading...');
  const [initials, setInitials] = React.useState('');
  const [nextModule, setNextModule] = React.useState<any>(null);
  const { earnCredits } = useGamification();

  React.useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        const name = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Executive';
        setUserName(name);
        const nameParts = name.split(' ');
        if (nameParts.length > 1) {
          setInitials(nameParts[0][0] + nameParts[1][0]);
        } else {
          setInitials(name.substring(0, 2).toUpperCase());
        }
      }
    };
    fetchUser();
    
    // Fetch dynamic next module
    fetch('/data/all_modules.json')
      .then(res => res.json())
      .then(data => {
        if(data && data.length > 0) {
          setNextModule(data[0]); // Start with Module 1 by default
        }
      })
      .catch(e => console.error(e));
  }, [router]);

  return (
    <Layout>
      <Box sx={{ minHeight: '100vh', bgcolor: themeColors.bgLight, fontFamily: 'sans-serif', pb: 8, pt: 12 }}>
        
        <Box sx={{ 
          background: 'linear-gradient(135deg, #0b1730, #1e293b)', 
          color: themeColors.textMain,
          borderBottomLeftRadius: '32px',
          borderBottomRightRadius: '32px',
          px: 3, pt: 3, pb: 6,
          boxShadow: '0 20px 40px -15px rgba(11, 23, 48, 0.4)'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-0.5px' }}>
                {userName}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 'bold' }}>
                CEO WORKSPACE
              </Typography>
            </Box>
            <Avatar sx={{ bgcolor: themeColors.gold, color: themeColors.navyDark, width: 56, height: 56, fontWeight: 'bold', border: '2px solid #f8fafc' }}>
              {initials}
            </Avatar>
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', p: 2, borderRadius: '16px', backdropFilter: 'blur(10px)' }}>
                <Typography variant="h5" sx={{ fontWeight: 900, color: themeColors.gold }}>240</Typography>
                <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#cbd5e1' }}>MI CREDITS ✨</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', p: 2, borderRadius: '16px', backdropFilter: 'blur(10px)' }}>
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#10b981' }}>🔥 5 Days</Typography>
                <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#cbd5e1' }}>CURRENT STREAK 🚀</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Container sx={{ mt: -3, position: 'relative', zIndex: 10 }}>
          
          <Card sx={{ borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', mb: 4, overflow: 'hidden' }}>
            <Box sx={{ height: '6px', bgcolor: themeColors.gold }} />
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="overline" sx={{ color: themeColors.navyLight, fontWeight: 'bold', letterSpacing: '1px' }}>
                  Up Next • 2 Min Read
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: themeColors.navyDark, mb: 1, lineHeight: 1.2 }}>
                {nextModule ? `${nextModule.chapter}: ${nextModule.title}` : 'Loading...'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
                {nextModule ? nextModule.reflection_question : '...'}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant="contained" 
                  fullWidth 
                  onClick={() => router.push(`/module/${nextModule?.linear_id || 1}`)}
                  sx={{ 
                    bgcolor: themeColors.navyDark, color: 'white', borderRadius: '12px', 
                    textTransform: 'none', fontWeight: 'bold', py: 1.5,
                    '&:hover': { bgcolor: themeColors.navyLight }
                  }}
                >
                  Read Module
                </Button>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  onClick={() => router.push(`/module/${nextModule?.linear_id || 1}`)}
                  sx={{ 
                    borderColor: themeColors.navyDark, color: themeColors.navyDark, 
                    borderRadius: '12px', textTransform: 'none', fontWeight: 'bold', py: 1.5
                  }}
                >
                  🎧 Listen
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Masterclass Banner */}
          <Card sx={{ borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', mb: 4, overflow: 'hidden', background: '#0b1730', color: 'white' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="overline" sx={{ color: '#f59e0b', fontWeight: 'bold', letterSpacing: '1px' }}>
                  Live Masterclass
                </Typography>
                <Typography variant="caption" sx={{ bgcolor: 'rgba(255,255,255,0.1)', px: 1.5, py: 0.5, borderRadius: 2 }}>
                  Earn +15 Credits
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, lineHeight: 1.2 }}>
                The Generative Leader
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
                Join Manoj Onkar live to diagnose your organization's BUSYness and build a high-performance roadmap.
              </Typography>
              <Button 
                variant="contained" 
                fullWidth
                onClick={() => {
                  earnCredits(15, 'Registered for Masterclass', 'Run');
                  window.open('https://www.killbusyness.com/contact', '_blank');
                }}
                sx={{ bgcolor: '#f59e0b', color: '#0b1730', fontWeight: 'bold', borderRadius: 2, textTransform: 'none', py: 1.5, '&:hover': { bgcolor: '#d97706' } }}
              >
                Register Now
              </Button>
            </CardContent>
          </Card>

          {/* Gamified Invite Banner */}
          <Card sx={{ borderRadius: '24px', boxShadow: '0 10px 30px rgba(245, 158, 11, 0.2)', mb: 4, overflow: 'hidden', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#0b1730' }}>
            <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ flexShrink: 0, bgcolor: 'rgba(255,255,255,0.3)', borderRadius: '50%', width: 60, height: 60, display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2rem' }}>
                🎁
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1, mb: 0.5 }}>
                  Refer & Earn +50 MI Credits
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, opacity: 0.9, mb: 2 }}>
                  Invite a colleague and earn credits when they read their first module!
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={async () => {
                    const text = 'Check out KILL BUSYness - Move from Activities to Outcomes. Join me on the app!';
                    const url = 'https://app.killbusyness.com';
                    if (navigator.share) {
                      navigator.share({ title: 'KILL BUSYness', text, url }).catch(console.error);
                    } else {
                      navigator.clipboard.writeText(url);
                      alert('Link copied to clipboard!');
                    }
                  }}
                  sx={{ bgcolor: '#0b1730', color: 'white', fontWeight: 'bold', borderRadius: 2, textTransform: 'none', px: 3, '&:hover': { bgcolor: '#1e293b' } }}
                >
                  Share Now
                </Button>
              </Box>
            </CardContent>
          </Card>

          <Typography variant="h6" sx={{ fontWeight: 800, color: themeColors.navyDark, mb: 2, px: 1 }}>
            The ROAR Library
          </Typography>

          <Grid container spacing={2}>
            {/* Same Library cards, simplified for space here if needed, but keeping full implementation */}
            <Grid item xs={6}>
              <Card onClick={() => router.push('/library')} sx={{ borderRadius: '20px', bgcolor: '#eff6ff', border: '1px solid #bfdbfe', boxShadow: 'none', cursor: 'pointer' }}>
                <CardContent>
                  <Typography sx={{ fontSize: '2rem', mb: 1 }}>🪞</Typography>
                  <Typography sx={{ fontWeight: 'bold', color: themeColors.reflect, mb: 0.5 }}>Reflect</Typography>
                  <Typography variant="caption" sx={{ color: '#475569' }}>Chapters 1-4</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card onClick={() => router.push('/library')} sx={{ borderRadius: '20px', bgcolor: '#fef3c7', border: '1px solid #fde68a', boxShadow: 'none', cursor: 'pointer' }}>
                <CardContent>
                  <Typography sx={{ fontSize: '2rem', mb: 1 }}>👑</Typography>
                  <Typography sx={{ fontWeight: 'bold', color: themeColors.own, mb: 0.5 }}>Own</Typography>
                  <Typography variant="caption" sx={{ color: '#475569' }}>Chapters 5-6</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card onClick={() => router.push('/library')} sx={{ borderRadius: '20px', bgcolor: '#d1fae5', border: '1px solid #a7f3d0', boxShadow: 'none', cursor: 'pointer' }}>
                <CardContent>
                  <Typography sx={{ fontSize: '2rem', mb: 1 }}>🛡️</Typography>
                  <Typography sx={{ fontWeight: 'bold', color: themeColors.assert, mb: 0.5 }}>Assert</Typography>
                  <Typography variant="caption" sx={{ color: '#475569' }}>Chapters 7-8</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card onClick={() => router.push('/library')} sx={{ borderRadius: '20px', bgcolor: '#ede9fe', border: '1px solid #ddd6fe', boxShadow: 'none', cursor: 'pointer' }}>
                <CardContent>
                  <Typography sx={{ fontSize: '2rem', mb: 1 }}>🚀</Typography>
                  <Typography sx={{ fontWeight: 'bold', color: themeColors.run, mb: 0.5 }}>Run</Typography>
                  <Typography variant="caption" sx={{ color: '#475569' }}>Chapters 9-10</Typography>
                </CardContent>
              </Card>
            </Grid>
            
            {/* New Resources Link */}
            <Grid item xs={12}>
              <Card onClick={() => router.push('/resources')} sx={{ borderRadius: '20px', bgcolor: '#0b1730', color: 'white', boxShadow: '0 8px 20px rgba(0,0,0,0.15)', cursor: 'pointer' }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography sx={{ fontWeight: 'bold', color: '#0E9C74', mb: 0.5 }}>Executive Briefings</Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>20 Video Masterclasses</Typography>
                  </Box>
                  <Typography sx={{ fontSize: '2rem' }}>▶️</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {/* Buy Paperback Link using Credits */}
          <Card onClick={() => window.open('https://www.killbusyness.com/buy?format=paperback&appliedCredits=1', '_blank')} sx={{ mt: 4, borderRadius: '24px', bgcolor: '#ffffff', border: '2px solid #0b1730', cursor: 'pointer', '&:hover': { bgcolor: '#f8fafc' } }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <img src="/img/book-cover.webp" alt="Book" style={{ width: 60, borderRadius: 4, boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }} onError={(e) => { e.currentTarget.src = '/emblem-splash.jpg' }} />
              <Box>
                <Typography sx={{ fontWeight: 900, color: '#0b1730' }}>Order the Paperback</Typography>
                <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5 }}>For your team or library.</Typography>
                <Typography variant="caption" sx={{ bgcolor: '#dcfce7', color: '#166534', px: 1, py: 0.25, borderRadius: 1, fontWeight: 'bold' }}>
                  Use MI Credits for a Discount!
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </Layout>
  );
}