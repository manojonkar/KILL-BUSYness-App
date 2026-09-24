import React from 'react';
import { Box, Typography, Container, Grid, Paper, Avatar } from '@mui/material';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import LockIcon from '@mui/icons-material/Lock';

const ProfilePage = () => {
  const miCredits = 1250;
  const streak = 4;
  const totalDays = 7;
  
  const badges = [
    { id: 1, name: 'First Step', description: 'Complete your first module', unlocked: true, icon: '🌟' },
    { id: 2, name: 'Consistency', description: '3-day streak', unlocked: true, icon: '🔥' },
    { id: 3, name: 'Deep Thinker', description: 'Complete Reflect Phase', unlocked: false, icon: '🧠' },
    { id: 4, name: 'Action Taker', description: 'Complete Run Phase', unlocked: false, icon: '🏃‍♂️' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0b1730', color: '#ffffff', py: 8 }}>
      <Container maxWidth="md">
        <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#f59e0b' }}>
          Your Profile
        </Typography>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          {/* MI Credits */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 4, border: '1px solid #f59e0b' }}>
              <Typography variant="h6" color="#f59e0b" gutterBottom>
                Total MI Credits
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
                {miCredits}
              </Typography>
            </Paper>
          </Grid>

          {/* Streak */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 4, border: '1px solid #f59e0b' }}>
              <Typography variant="h6" color="#f59e0b" gutterBottom>
                Current Streak
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mt: 2 }}>
                {[...Array(totalDays)].map((_, index) => (
                  <LocalFireDepartmentIcon 
                    key={index} 
                    sx={{ 
                      fontSize: 40, 
                      color: index < streak ? '#f59e0b' : 'rgba(255,255,255,0.2)' 
                    }} 
                  />
                ))}
              </Box>
              <Typography variant="body1" sx={{ mt: 2, color: 'rgba(255,255,255,0.7)' }}>
                {streak} / {totalDays} Days
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Badges Grid */}
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4, color: '#f59e0b' }}>
          Badges & Achievements
        </Typography>
        
        <Grid container spacing={3}>
          {badges.map((badge) => (
            <Grid item xs={12} sm={6} md={3} key={badge.id}>
              <Paper 
                sx={{ 
                  p: 3, 
                  textAlign: 'center', 
                  bgcolor: badge.unlocked ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.3)', 
                  borderRadius: 3,
                  border: badge.unlocked ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid rgba(255,255,255,0.1)',
                  position: 'relative',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  opacity: badge.unlocked ? 1 : 0.6
                }}
              >
                {!badge.unlocked && (
                  <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                    <LockIcon sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 20 }} />
                  </Box>
                )}
                
                <Avatar 
                  sx={{ 
                    width: 60, 
                    height: 60, 
                    mb: 2, 
                    bgcolor: badge.unlocked ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.05)',
                    fontSize: '2rem'
                  }}
                >
                  {badge.icon}
                </Avatar>
                
                <Typography variant="h6" sx={{ color: badge.unlocked ? '#ffffff' : 'rgba(255,255,255,0.5)', mb: 1, fontSize: '1.1rem' }}>
                  {badge.name}
                </Typography>
                
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                  {badge.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

      </Container>
    </Box>
  );
};

export default ProfilePage;
