import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Paper, Button, TextField, Divider, Avatar, List, ListItem, ListItemAvatar, ListItemText, Snackbar, IconButton, Grid } from '@mui/material';
import Layout from '../components/Layout';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ShareIcon from '@mui/icons-material/Share';

interface Teammate {
  id: number;
  name: string;
  credits: number;
  streak: number;
}

export default function TeamsPage() {
  const [teamName, setTeamName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [currentTeam, setCurrentTeam] = useState<{name: string, code: string} | null>(null);
  const [leaderboard, setLeaderboard] = useState<Teammate[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    // Load team from local storage
    const savedTeam = localStorage.getItem('kill_busyness_team');
    if (savedTeam) {
      const parsed = JSON.parse(savedTeam);
      setCurrentTeam(parsed);
      generateMockLeaderboard();
    }
  }, []);

  const generateMockLeaderboard = () => {
    // Simulate a thriving team leaderboard for the viral loop demo
    const mockData = [
      { id: 1, name: 'Sarah Jenkins', credits: 2450, streak: 12 },
      { id: 2, name: 'You', credits: 1250, streak: 4 }, // The user's mock stats from profile
      { id: 3, name: 'David Chen', credits: 980, streak: 3 },
      { id: 4, name: 'Maria Garcia', credits: 450, streak: 1 },
      { id: 5, name: 'James Wilson', credits: 120, streak: 0 },
    ];
    setLeaderboard(mockData.sort((a, b) => b.credits - a.credits));
  };

  const handleCreateTeam = () => {
    if (!teamName) return;
    const code = teamName.substring(0, 4).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000);
    const newTeam = { name: teamName, code };
    localStorage.setItem('kill_busyness_team', JSON.stringify(newTeam));
    setCurrentTeam(newTeam);
    generateMockLeaderboard();
  };

  const handleJoinTeam = () => {
    if (!joinCode) return;
    // In a real app, we'd fetch the team name from Supabase using the code.
    // For now, we simulate joining.
    const newTeam = { name: 'Corporate Workspace', code: joinCode.toUpperCase() };
    localStorage.setItem('kill_busyness_team', JSON.stringify(newTeam));
    setCurrentTeam(newTeam);
    generateMockLeaderboard();
  };

  const handleLeaveTeam = () => {
    localStorage.removeItem('kill_busyness_team');
    setCurrentTeam(null);
  };

  const copyInviteLink = () => {
    const text = `Join my private KILL BUSYness workspace! Use code: ${currentTeam?.code} at app.killbusyness.com/teams`;
    if (navigator.share) {
      navigator.share({
        title: 'Join my Workspace',
        text: text,
        url: 'https://app.killbusyness.com/teams'
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(text);
      setSnackbarMessage('Invite text copied to clipboard!');
      setSnackbarOpen(true);
    }
  };

  if (currentTeam) {
    return (
      <Layout>
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', pt: 12, pb: 16 }}>
          <Container maxWidth="sm">
            <Typography variant="overline" sx={{ color: '#f59e0b', fontWeight: 900, letterSpacing: 2 }}>
              YOUR WORKSPACE
            </Typography>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 900, color: '#0b1730', mb: 3 }}>
              {currentTeam.name}
            </Typography>

            {/* Invite Banner (Viral Loop 1) */}
            <Paper sx={{ p: 3, mb: 5, borderRadius: 4, bgcolor: '#0b1730', color: 'white', boxShadow: '0 10px 25px -5px rgba(11,23,48,0.2)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <GroupAddIcon sx={{ color: '#f59e0b', fontSize: 32, mr: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Grow Your Team</Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
                Earn <b>+50 MI Credits</b> for every colleague who joins and completes their first module!
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', bgcolor: 'rgba(255,255,255,0.1)', p: 1.5, borderRadius: 2 }}>
                <Typography sx={{ flexGrow: 1, fontFamily: 'monospace', fontSize: '1.2rem', letterSpacing: 2, textAlign: 'center', color: '#f59e0b', fontWeight: 'bold' }}>
                  {currentTeam.code}
                </Typography>
                <Button variant="contained" onClick={copyInviteLink} sx={{ bgcolor: '#f59e0b', color: '#0b1730', '&:hover': { bgcolor: '#d97706' }, borderRadius: 2, fontWeight: 'bold' }} startIcon={<ShareIcon />}>
                  Invite
                </Button>
              </Box>
            </Paper>

            {/* Private Leaderboard */}
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0b1730', mb: 2, display: 'flex', alignItems: 'center' }}>
              <EmojiEventsIcon sx={{ color: '#f59e0b', mr: 1 }} /> Team Leaderboard
            </Typography>
            <Paper sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
              <List disablePadding>
                {leaderboard.map((user, index) => (
                  <React.Fragment key={user.id}>
                    <ListItem sx={{ py: 2, bgcolor: user.name === 'You' ? '#fffbeb' : 'white' }}>
                      <Typography sx={{ width: 30, fontWeight: 'bold', color: index < 3 ? '#f59e0b' : '#94a3b8' }}>
                        #{index + 1}
                      </Typography>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: user.name === 'You' ? '#f59e0b' : '#cbd5e1', color: user.name === 'You' ? '#0b1730' : 'white' }}>
                          {user.name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={<Typography sx={{ fontWeight: user.name === 'You' ? 800 : 600, color: '#0b1730' }}>{user.name}</Typography>} 
                        secondary={`${user.streak} day streak`} 
                      />
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography sx={{ fontWeight: 'bold', color: '#f59e0b' }}>{user.credits}</Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>credits</Typography>
                      </Box>
                    </ListItem>
                    {index < leaderboard.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>

            <Box sx={{ mt: 6, textAlign: 'center' }}>
              <Button onClick={handleLeaveTeam} sx={{ color: '#94a3b8' }}>Leave Workspace</Button>
            </Box>
          </Container>
        </Box>
        <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)} message={snackbarMessage} />
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ minHeight: '100vh', bgcolor: '#0b1730', color: 'white', pt: 12, pb: 16 }}>
        <Container maxWidth="sm">
          <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#f59e0b', mb: 6 }}>
            Corporate Workspaces
          </Typography>

          <Grid container spacing={4}>
            {/* Create Team */}
            <Grid item xs={12}>
              <Paper sx={{ p: 4, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 4, border: '1px solid #f59e0b', textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: 'white' }}>
                  Create a Workspace
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
                  Start a private leaderboard for your company or team. Track alignment, monitor engagement, and drive high performance.
                </Typography>
                <TextField 
                  fullWidth 
                  variant="outlined" 
                  placeholder="e.g., Jaipur Rugs Leadership" 
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  sx={{ mb: 2, input: { color: 'white', bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 2 } }}
                />
                <Button 
                  fullWidth 
                  variant="contained" 
                  size="large" 
                  onClick={handleCreateTeam}
                  disabled={!teamName}
                  sx={{ bgcolor: '#f59e0b', color: '#0b1730', fontWeight: 'bold', py: 1.5, borderRadius: 2, '&:hover': { bgcolor: '#d97706' } }}
                >
                  Create Team
                </Button>
              </Paper>
            </Grid>

            {/* Join Team */}
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', my: 2 }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 'bold' }}>OR</Typography>
              </Box>
              <Paper sx={{ p: 4, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.2)', textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: 'white' }}>
                  Join an Existing Team
                </Typography>
                <TextField 
                  fullWidth 
                  variant="outlined" 
                  placeholder="Enter 8-digit Join Code" 
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  sx={{ mb: 2, input: { color: 'white', bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 2, textAlign: 'center', letterSpacing: 2 } }}
                />
                <Button 
                  fullWidth 
                  variant="outlined" 
                  size="large" 
                  onClick={handleJoinTeam}
                  disabled={!joinCode}
                  sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)', fontWeight: 'bold', py: 1.5, borderRadius: 2, '&:hover': { borderColor: 'white' } }}
                >
                  Join Team
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Layout>
  );
}

