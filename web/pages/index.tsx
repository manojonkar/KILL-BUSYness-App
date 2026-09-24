import React from 'react';
import { useRouter } from 'next/router';
import { Box, Typography, Card, CardContent, Container, Grid, Button, IconButton, LinearProgress, Avatar } from '@mui/material';
import Layout from '../components/Layout';
import { useGamification } from '../components/GamificationOverlay';

// Premium Color Palette from the Book/Website
const themeColors = {
  navyDark: '#0b1730',
  navyLight: '#132a52',
  gold: '#f59e0b',
  textMain: '#ffffff',
  textSub: '#c9cbd3',
  bgLight: '#f8fafc',
  // ROAR Phase Colors
  reflect: '#3b82f6', // Light Blue
  own: '#f59e0b',     // Gold
  assert: '#10b981',  // Green
  run: '#8b5cf6',     // Lavender
};

export default function MobileDashboard() {
  const router = useRouter();
  const { earnCredits, celebrateStreak } = useGamification();

  return (
    <Layout>
      <Box sx={{ minHeight: '100vh', bgcolor: themeColors.bgLight, fontFamily: 'sans-serif', pb: 8, pt: 12 }}>
        
        {/* Premium Header Profile Section */}
        <Box sx={{ 
          background: `linear-gradient(135deg, ${themeColors.navyDark}, ${themeColors.navyLight})`, 
          color: themeColors.textMain,
          borderBottomLeftRadius: '32px',
          borderBottomRightRadius: '32px',
          px: 3, pt: 8, pb: 6,
          boxShadow: '0 20px 40px -15px rgba(11, 23, 48, 0.4)'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
                Rajesh Shah
              </Typography>
              <Typography variant="body2" sx={{ color: themeColors.textSub, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.75rem', mt: 0.5 }}>
                CEO Workspace
              </Typography>
            </Box>
            <Avatar 
              onClick={() => router.push('/profile')}
              sx={{ bgcolor: themeColors.gold, color: themeColors.navyDark, width: 48, height: 48, fontWeight: 'bold', cursor: 'pointer' }}
            >
              RS
            </Avatar>
          </Box>

          {/* MI Credits & Streak Box (Interactive Triggers) */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box 
              onClick={() => earnCredits(5, 'Daily Habit Check-in Completed', 'Own')}
              sx={{ 
                flex: 1, 
                bgcolor: 'rgba(255,255,255,0.1)', 
                borderRadius: '16px', 
                p: 2, 
                backdropFilter: 'blur(10px)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  bgcolor: 'rgba(245, 158, 11, 0.15)',
                  transform: 'translateY(-2px)',
                  borderColor: themeColors.gold,
                },
                '&:active': {
                  transform: 'scale(0.98)',
                }
              }}
            >
              <Typography sx={{ color: themeColors.gold, fontWeight: 'bold', fontSize: '1.2rem' }}>240</Typography>
              <Typography sx={{ color: themeColors.textSub, fontSize: '0.75rem', textTransform: 'uppercase' }}>MI Credits ✨</Typography>
            </Box>
            <Box 
              onClick={() => celebrateStreak(5, 5)}
              sx={{ 
                flex: 1, 
                bgcolor: 'rgba(255,255,255,0.1)', 
                borderRadius: '16px', 
                p: 2, 
                backdropFilter: 'blur(10px)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  bgcolor: 'rgba(16, 185, 129, 0.15)',
                  transform: 'translateY(-2px)',
                  borderColor: '#10b981',
                },
                '&:active': {
                  transform: 'scale(0.98)',
                }
              }}
            >
              <Typography sx={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.2rem' }}>🔥 5 Days</Typography>
              <Typography sx={{ color: themeColors.textSub, fontSize: '0.75rem', textTransform: 'uppercase' }}>Current Streak 🚀</Typography>
            </Box>
          </Box>
        </Box>

        <Container maxWidth="sm" sx={{ mt: -3 }}>
          
          {/* Up Next - Guided Journey Card */}
          <Card sx={{ borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', mb: 4, overflow: 'hidden' }}>
            <Box sx={{ height: '6px', bgcolor: themeColors.gold }} />
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="overline" sx={{ color: themeColors.navyLight, fontWeight: 'bold', letterSpacing: '1px' }}>
                  Up Next • 2 Min Read
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: themeColors.navyDark, mb: 1, lineHeight: 1.2 }}>
                Module 4: Meetings Run on Visibility, Not Decisions
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
                Stop managing egos and start driving outcomes. Learn why the illusion of productivity is killing your strategy.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant="contained" 
                  fullWidth 
                  onClick={() => router.push('/module/1')}
                  sx={{ 
                    bgcolor: themeColors.navyDark, 
                    color: 'white', 
                    borderRadius: '12px', 
                    textTransform: 'none',
                    fontWeight: 'bold',
                    py: 1.5,
                    '&:hover': { bgcolor: themeColors.navyLight }
                  }}
                >
                  Read Module
                </Button>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  onClick={() => router.push('/module/4')}
                  sx={{ 
                    borderColor: themeColors.navyDark, 
                    color: themeColors.navyDark, 
                    borderRadius: '12px', 
                    textTransform: 'none',
                    fontWeight: 'bold',
                    py: 1.5
                  }}
                >
                  🎧 Listen (1:20)
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Open Library - The 4 ROAR Phases */}
          <Typography variant="h6" sx={{ fontWeight: 800, color: themeColors.navyDark, mb: 2, px: 1 }}>
            The ROAR Library
          </Typography>

          <Grid container spacing={2}>
            {/* Reflect Card */}
            <Grid item xs={6}>
              <Card 
                onClick={() => router.push('/module/1')}
                sx={{ 
                  borderRadius: '20px', 
                  bgcolor: '#eff6ff', 
                  border: '1px solid #bfdbfe', 
                  boxShadow: 'none',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-3px)' }
                }}
              >
                <CardContent>
                  <Typography sx={{ fontSize: '2rem', mb: 1 }}>🔍</Typography>
                  <Typography sx={{ fontWeight: 'bold', color: themeColors.reflect, mb: 0.5 }}>Reflect</Typography>
                  <Typography variant="caption" sx={{ color: '#475569' }}>Chapters 1-4</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 1 }}>
                    <LinearProgress variant="determinate" value={80} sx={{ flex: 1, height: 6, borderRadius: 3, bgcolor: '#dbeafe', '& .MuiLinearProgress-bar': { bgcolor: themeColors.reflect } }} />
                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: themeColors.reflect }}>80%</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Own Card */}
            <Grid item xs={6}>
              <Card 
                onClick={() => router.push('/module/5')}
                sx={{ 
                  borderRadius: '20px', 
                  bgcolor: '#fef3c7', 
                  border: '1px solid #fde68a', 
                  boxShadow: 'none',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-3px)' }
                }}
              >
                <CardContent>
                  <Typography sx={{ fontSize: '2rem', mb: 1 }}>👑</Typography>
                  <Typography sx={{ fontWeight: 'bold', color: themeColors.own, mb: 0.5 }}>Own</Typography>
                  <Typography variant="caption" sx={{ color: '#475569' }}>Chapters 5-6</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 1 }}>
                    <LinearProgress variant="determinate" value={10} sx={{ flex: 1, height: 6, borderRadius: 3, bgcolor: '#fef3c7', '& .MuiLinearProgress-bar': { bgcolor: themeColors.own } }} />
                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: themeColors.own }}>10%</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Assert Card */}
            <Grid item xs={6}>
              <Card 
                onClick={() => router.push('/module/7')}
                sx={{ 
                  borderRadius: '20px', 
                  bgcolor: '#d1fae5', 
                  border: '1px solid #a7f3d0', 
                  boxShadow: 'none',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-3px)' }
                }}
              >
                <CardContent>
                  <Typography sx={{ fontSize: '2rem', mb: 1 }}>⚔️</Typography>
                  <Typography sx={{ fontWeight: 'bold', color: themeColors.assert, mb: 0.5 }}>Assert</Typography>
                  <Typography variant="caption" sx={{ color: '#475569' }}>Chapters 7-8</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 1 }}>
                    <LinearProgress variant="determinate" value={0} sx={{ flex: 1, height: 6, borderRadius: 3, bgcolor: '#d1fae5', '& .MuiLinearProgress-bar': { bgcolor: themeColors.assert } }} />
                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: themeColors.assert }}>0%</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Run Card */}
            <Grid item xs={6}>
              <Card 
                onClick={() => router.push('/module/9')}
                sx={{ 
                  borderRadius: '20px', 
                  bgcolor: '#ede9fe', 
                  border: '1px solid #ddd6fe', 
                  boxShadow: 'none',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-3px)' }
                }}
              >
                <CardContent>
                  <Typography sx={{ fontSize: '2rem', mb: 1 }}>🚀</Typography>
                  <Typography sx={{ fontWeight: 'bold', color: themeColors.run, mb: 0.5 }}>Run</Typography>
                  <Typography variant="caption" sx={{ color: '#475569' }}>Chapters 9-10</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 1 }}>
                    <LinearProgress variant="determinate" value={0} sx={{ flex: 1, height: 6, borderRadius: 3, bgcolor: '#ede9fe', '& .MuiLinearProgress-bar': { bgcolor: themeColors.run } }} />
                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: themeColors.run }}>0%</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

        </Container>
      </Box>
    </Layout>
  );
}

