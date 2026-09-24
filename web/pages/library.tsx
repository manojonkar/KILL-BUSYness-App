import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Tabs,
  Tab,
  Chip,
  Paper,
} from '@mui/material';
import Head from 'next/head';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0b1730', // Dark navy
      paper: '#132345',
    },
    primary: {
      main: '#f59e0b', // Gold
    },
    text: {
      primary: '#ffffff',
      secondary: '#a3a3a3',
    },
  },
  typography: {
    fontFamily: '"Cinzel", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            borderColor: '#f59e0b',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '1rem',
          textTransform: 'none',
        },
      },
    },
  },
});

const phases = [
  { id: 'reflect', label: 'Reflect', color: '#3b82f6' }, // Blue
  { id: 'own', label: 'Own', color: '#f59e0b' }, // Gold
  { id: 'assert', label: 'Assert', color: '#10b981' }, // Green
  { id: 'run', label: 'Run', color: '#a78bfa' }, // Lavender
];

interface ModuleItem {
  id: number;
  title: string;
  description: string;
  phase: string;
  duration: string;
}

// Generate 100 mock modules (25 per phase)
const generateModules = (): ModuleItem[] => {
  const modules: ModuleItem[] = [];
  let id = 1;
  phases.forEach((phase) => {
    for (let i = 1; i <= 25; i++) {
      modules.push({
        id: id++,
        title: `${phase.label} Module ${i}`,
        description: `Explore the core concepts of the ${phase.label} phase to elevate your leadership and reclaim your time.`,
        phase: phase.id,
        duration: `${Math.floor(Math.random() * 10 + 5)} min`,
      });
    }
  });
  return modules;
};

const modules = generateModules();

export default function Library() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const activePhase = phases[activeTab].id;
  const filteredModules = modules.filter((m) => m.phase === activePhase);
  const activeColor = phases[activeTab].color;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Head>
        <title>KILL BUSYness | Content Library</title>
      </Head>
      <Box sx={{ minHeight: '100vh', pb: 8, pt: 10 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h2" component="h1" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              The Library
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              Dive into our exclusive collection of 100 premium modules. Master the ROAR methodology and transform your busy life into productive harmony.
            </Typography>
          </Box>

          <Paper sx={{ mb: 6, backgroundColor: 'transparent', borderBottom: 1, borderColor: 'divider' }} elevation={0}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              textColor="primary"
              indicatorColor="primary"
              sx={{
                '& .MuiTabs-indicator': {
                  backgroundColor: activeColor,
                  height: 3,
                },
                '& .Mui-selected': {
                  color: `${activeColor} !important`,
                }
              }}
            >
              {phases.map((phase) => (
                <Tab key={phase.id} label={phase.label} />
              ))}
            </Tabs>
          </Paper>

          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                width: 12,
                height: 40,
                backgroundColor: activeColor,
                mr: 2,
                borderRadius: 1,
              }}
            />
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {phases[activeTab].label} Phase
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {filteredModules.map((module) => (
              <Grid item xs={12} sm={6} md={4} key={module.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardActionArea sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', height: '100%' }}>
                    <CardContent sx={{ flexGrow: 1, width: '100%' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Chip
                          label={phases[activeTab].label}
                          size="small"
                          sx={{
                            backgroundColor: `${activeColor}22`,
                            color: activeColor,
                            fontWeight: 'bold',
                            border: `1px solid ${activeColor}55`,
                          }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                          {module.duration}
                        </Typography>
                      </Box>
                      <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                        {module.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {module.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
