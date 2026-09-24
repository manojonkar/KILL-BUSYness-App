import React, { useState } from 'react';
import { Box, Paper, BottomNavigation, BottomNavigationAction, AppBar, Toolbar, Typography, IconButton, Snackbar } from '@mui/material';
import { useRouter } from 'next/router';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [value, setValue] = React.useState(router.pathname);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const isModulePage = router.pathname.startsWith('/module/');

  const handleShare = async () => {
    const shareData = {
      title: 'KILL BUSYness',
      text: 'Check out KILL BUSYness - Move from Activities to Outcomes. A bite-sized learning companion for Leaders.',
      url: 'https://app.killbusyness.com',
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        // Optionally award gamification credits here later
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback for desktop browsers without Web Share API
      try {
        await navigator.clipboard.writeText(shareData.url);
        setSnackbarOpen(true);
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  };

  return (
    <Box sx={{ bgcolor: '#0b1730', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ 
        width: '100%', 
        maxWidth: '480px', 
        bgcolor: '#f8fafc', 
        minHeight: '100vh', 
        position: 'relative',
        pb: isModulePage ? 0 : 7, 
        pt: 8,
        boxShadow: '0 0 40px rgba(0,0,0,0.5)',
        overflowX: 'hidden'
      }}>
        
        {/* Universal Top Branding Header */}
        <AppBar position="absolute" sx={{ 
          bgcolor: '#0b1730', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          top: 0,
          left: 0,
          right: 0
        }}>
          <Toolbar sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minHeight: '70px !important' }}>
            <Box 
              component="img" 
              src="/emblem.jpg" 
              alt="KILL BUSYness Lion Emblem" 
              sx={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid #f59e0b' }} 
            />
            <Box>
              <Typography sx={{ fontWeight: 900, color: '#f59e0b', lineHeight: 1.1, letterSpacing: '0.5px', fontSize: '1.1rem' }}>
                KILL BUSYness
              </Typography>
              <Typography sx={{ color: '#c9cbd3', letterSpacing: '0.2px', fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 600 }}>
                Build High Performance Organizations
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton onClick={handleShare} sx={{ color: 'white' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Box sx={{ height: '100%' }}>{children}</Box>

        {/* Bottom Navigation */}
        {!isModulePage && (
          <Paper sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1000 }} elevation={20}>
            <BottomNavigation
              showLabels
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
                router.push(newValue);
              }}
              sx={{
                '& .Mui-selected': { color: '#f59e0b' },
                bgcolor: '#0b1730',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                '& .MuiBottomNavigationAction-label': { color: '#c9cbd3' },
                '& .MuiBottomNavigationAction-root': { color: '#c9cbd3' },
              }}
            >
              <BottomNavigationAction label="Home" value="/" icon={<span style={{fontSize: '1.5rem'}}>🏠</span>} />
              <BottomNavigationAction label="Library" value="/library" icon={<span style={{fontSize: '1.5rem'}}>📚</span>} />
              <BottomNavigationAction label="Leaderboard" value="/leaderboard" icon={<span style={{fontSize: '1.5rem'}}>🏆</span>} />
              <BottomNavigationAction label="Teams" value="/teams" icon={<span style={{fontSize: '1.5rem'}}>👥</span>} />
              <BottomNavigationAction label="Profile" value="/profile" icon={<span style={{fontSize: '1.5rem'}}>👤</span>} />
            </BottomNavigation>
          </Paper>
        )}
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Link copied to clipboard!"
      />

      {/* Global AI Coach Button */}
      {router.pathname !== '/coach' && (
        <Box 
          onClick={() => router.push('/coach')}
          sx={{
            position: 'fixed',
            bottom: isModulePage ? 24 : 80,
            right: 24,
            bgcolor: '#f59e0b',
            color: '#0b1730',
            px: 3,
            py: 1.5,
            borderRadius: '50px',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            boxShadow: '0 10px 25px rgba(245, 158, 11, 0.4)',
            transition: 'transform 0.2s',
            zIndex: 2000,
            '&:hover': { transform: 'scale(1.05)' }
          }}
        >
          <Typography sx={{ fontSize: '1.2rem' }}>🤖</Typography>
          <Typography sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>ASK AI COACH</Typography>
        </Box>
      )}
    </Box>
  );
}
