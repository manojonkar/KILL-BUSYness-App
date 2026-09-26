import React, { useState } from 'react';
import { Box, Paper, BottomNavigation, BottomNavigationAction, AppBar, Toolbar, Typography, IconButton, Snackbar, useMediaQuery, useTheme, Button } from '@mui/material';
import { useRouter } from 'next/router';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [value, setValue] = React.useState(router.pathname);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const isModulePage = router.pathname.startsWith('/module/');

  const navItems = [
    { label: 'Home', value: '/', icon: '🏠' },
    { label: 'Library', value: '/library', icon: '📚' },
    { label: 'Leaderboard', value: '/leaderboard', icon: '🏆' },
    { label: 'Teams', value: '/teams', icon: '👥' },
    { label: 'Profile', value: '/profile', icon: '👤' }
  ];

  const handleShare = async () => {
    const shareData = {
      title: 'KILL BUSYness',
      text: 'Check out KILL BUSYness - Move from Activities to Outcomes.',
      url: 'https://app.killbusyness.com',
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
        setSnackbarOpen(true);
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  };

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ 
        width: '100%', 
        bgcolor: '#f8fafc', 
        minHeight: '100vh', 
        position: 'relative',
        pb: (!isDesktop && !isModulePage) ? 7 : 0, 
        pt: 8,
        overflowX: 'hidden'
      }}>
        
        {/* Universal Top Branding Header */}
        <AppBar position="fixed" sx={{ 
          bgcolor: '#0b1730', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100
        }}>
          <Toolbar sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minHeight: '70px !important' }}>
            <Box 
              component="img" 
              src="/emblem.jpg" 
              alt="KILL BUSYness Lion Emblem" 
              sx={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid #f59e0b', cursor: 'pointer' }}
              onClick={() => router.push('/')}
            />
            <Box sx={{ cursor: 'pointer' }} onClick={() => router.push('/')}>
              <Typography sx={{ fontWeight: 900, color: '#f59e0b', lineHeight: 1.1, letterSpacing: '0.5px', fontSize: '1.1rem' }}>
                KILL BUSYness
              </Typography>
              <Typography sx={{ color: '#c9cbd3', letterSpacing: '0.2px', fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 600 }}>
                Build High Performance Organizations
              </Typography>
            </Box>
            
            <Box sx={{ flexGrow: 1 }} />
            
            {/* Desktop Navigation Links */}
            {isDesktop && !isModulePage && (
              <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.value}
                    onClick={() => {
                      setValue(item.value);
                      router.push(item.value);
                    }}
                    sx={{
                      color: value === item.value ? '#f59e0b' : '#c9cbd3',
                      textTransform: 'none',
                      fontWeight: value === item.value ? 'bold' : 'normal',
                      '&:hover': { color: '#f59e0b', bgcolor: 'rgba(245, 158, 11, 0.1)' }
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}

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
        <Container maxWidth="md" disableGutters sx={{ height: '100%', px: { xs: 0, sm: 2, md: 3 } }}>
          {children}
        </Container>

        {/* Mobile Bottom Navigation */}
        {!isDesktop && !isModulePage && (
          <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }} elevation={20}>
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
              {navItems.map((item) => (
                <BottomNavigationAction key={item.value} label={item.label} value={item.value} icon={<span style={{fontSize: '1.5rem'}}>{item.icon}</span>} />
              ))}
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
            bottom: isDesktop ? 24 : (isModulePage ? 24 : 80),
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
