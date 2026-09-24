import React, { useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, CardActionArea, Tabs, Tab, Chip, Paper } from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

const phases = [
  { id: 'reflect', label: 'Reflect', color: '#3b82f6', count: 25 },
  { id: 'own', label: 'Own', color: '#f59e0b', count: 20 },
  { id: 'assert', label: 'Assert', color: '#10b981', count: 15 },
  { id: 'run', label: 'Run', color: '#8b5cf6', count: 20 },
];

export default function Library() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const activePhase = phases[activeTab].id;
  const activeColor = phases[activeTab].color;
  
  // Create an array of 80 modules mapped roughly to phases
  let currentId = 1;
  const modules = phases.flatMap(p => {
    const phaseModules = [];
    for(let i=1; i<=p.count; i++) {
      phaseModules.push({
        id: currentId++,
        title: `Module ${currentId-1}`,
        description: `Deep dive into the ${p.label} methodology.`,
        phase: p.id
      });
    }
    return phaseModules;
  });

  const filteredModules = modules.filter((m) => m.phase === activePhase);

  return (
    <Layout>
      <Head>
        <title>KILL BUSYness | Content Library</title>
      </Head>
      <Box sx={{ minHeight: '100vh', pb: 8, pt: 12, bgcolor: '#f8fafc' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: '#0b1730', fontWeight: 900 }}>
              The Library
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              All 80 masterclass modules.
            </Typography>
          </Box>

          <Paper sx={{ mb: 4, backgroundColor: 'transparent', borderBottom: 1, borderColor: 'divider' }} elevation={0}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                '& .MuiTabs-indicator': { backgroundColor: activeColor, height: 3 },
                '& .Mui-selected': { color: `${activeColor} !important`, fontWeight: 'bold' }
              }}
            >
              {phases.map((phase) => (
                <Tab key={phase.id} label={phase.label} sx={{ color: '#64748b' }} />
              ))}
            </Tabs>
          </Paper>

          <Grid container spacing={2}>
            {filteredModules.map((module) => (
              <Grid item xs={12} sm={6} key={module.id}>
                <Card sx={{ 
                  borderRadius: 3, 
                  border: '1px solid #e2e8f0', 
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-2px)', borderColor: activeColor }
                }}>
                  <CardActionArea onClick={() => router.push(`/module/${module.id}`)} sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Chip label={phases[activeTab].label} size="small" sx={{ bgcolor: `${activeColor}22`, color: activeColor, fontWeight: 'bold' }} />
                      <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#94a3b8' }}>2 MIN</Typography>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#0b1730', mb: 1 }}>
                      {module.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      {module.description}
                    </Typography>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Layout>
  );
}
