import React from 'react';
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Paper,
  Divider,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

// Mock Data
const employees = [
  { id: 1, name: 'Alice Johnson', credits: 1250, department: 'Engineering' },
  { id: 2, name: 'Bob Smith', credits: 1100, department: 'Marketing' },
  { id: 3, name: 'Charlie Brown', credits: 950, department: 'Sales' },
  { id: 4, name: 'Diana Prince', credits: 800, department: 'HR' },
  { id: 5, name: 'Evan Wright', credits: 750, department: 'Engineering' },
  { id: 6, name: 'Fiona Gallagher', credits: 600, department: 'Sales' },
];

const getMedalColor = (index: number) => {
  switch (index) {
    case 0:
      return '#FFD700'; // Gold
    case 1:
      return '#C0C0C0'; // Silver
    case 2:
      return '#CD7F32'; // Bronze
    default:
      return 'transparent';
  }
};

export default function Leaderboard() {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0b1730', py: 8 }}>
      <Container maxWidth="md">
        <Typography variant="h3" component="h1" gutterBottom sx={{ color: '#f59e0b', fontWeight: 'bold', textAlign: 'center', mb: 6 }}>
          Company Leaderboard
        </Typography>

        <Paper elevation={3} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 2, overflow: 'hidden' }}>
          <List disablePadding>
            {employees.map((employee, index) => (
              <React.Fragment key={employee.id}>
                <ListItem
                  sx={{
                    py: 3,
                    px: 4,
                    transition: 'background-color 0.2s',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  <Box sx={{ width: 40, display: 'flex', justifyContent: 'center', mr: 2 }}>
                    {index < 3 ? (
                      <EmojiEventsIcon sx={{ color: getMedalColor(index), fontSize: 32 }} />
                    ) : (
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                        #{index + 1}
                      </Typography>
                    )}
                  </Box>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: index < 3 ? getMedalColor(index) : '#f59e0b', color: index < 3 ? '#0b1730' : 'white', width: 48, height: 48, mr: 2, fontWeight: 'bold' }}>
                      {employee.name.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>{employee.name}</Typography>}
                    secondary={<Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>{employee.department}</Typography>}
                  />
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h5" sx={{ color: '#f59e0b', fontWeight: 'bold' }}>
                      {employee.credits}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1 }}>
                      MI Credits
                    </Typography>
                  </Box>
                </ListItem>
                {index < employees.length - 1 && <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Container>
    </Box>
  );
}
