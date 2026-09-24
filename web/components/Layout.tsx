import React from 'react';
import { Box, Paper, BottomNavigation, BottomNavigationAction, AppBar, Toolbar, Typography } from '@mui/material';
import { useRouter } from 'next/router';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [value, setValue] = React.useState(router.pathname);

  // Hide bottom navigation on module reading page to keep focus, but keep the top header!
  const isModulePage = router.pathname.startsWith('/module/');

  return (
    <Box sx={{ pb: isModulePage ? 0 : 7, pt: 8, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* Universal Top Branding Header */}
      <AppBar position="fixed" sx={{ bgcolor: '#0b1730', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
        <Toolbar sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minHeight: '70px !important' }}>
          <Box 
            component="img" 
            src="/emblem.jpg" 
            alt="KILL BUSYness Lion Emblem" 
            sx={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid #f59e0b' }} 
          />
          <Box>
            <Typography sx={{ fontWeight: 900, color: '#f59e0b', lineHeight: 1.1, letterSpacing: '0.5px', fontSize: '1.1rem' }}>
              KILL BUSYness.
            </Typography>
            <Typography sx={{ color: '#c9cbd3', letterSpacing: '0.2px', fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 600 }}>
              Build High Performance Organizations
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box>{children}</Box>

      {/* Bottom Navigation */}
      {!isModulePage && (
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
            <BottomNavigationAction label="Home" value="/" icon={<span style={{fontSize: '1.5rem'}}>🏠</span>} />
            <BottomNavigationAction label="Library" value="/library" icon={<span style={{fontSize: '1.5rem'}}>📚</span>} />
            <BottomNavigationAction label="Leaderboard" value="/leaderboard" icon={<span style={{fontSize: '1.5rem'}}>🏆</span>} />
            <BottomNavigationAction label="Profile" value="/profile" icon={<span style={{fontSize: '1.5rem'}}>👤</span>} />
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  );
}
