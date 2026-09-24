import React, { useState } from 'react';
import Head from 'next/head';
import {
  Box,
  Typography,
  Paper,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Button,
  Container,
  Grid,
} from '@mui/material';

export default function Settings() {
  const [days, setDays] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false,
  });

  const [time, setTime] = useState('08:15');

  const handleDayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDays({
      ...days,
      [event.target.name]: event.target.checked,
    });
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTime(event.target.value);
  };

  const handleSave = () => {
    // In a real app, you'd save this to a backend or local storage here
    console.log('Settings saved:', { days, time });
    alert('Settings saved successfully!');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#0b1730', // Dark navy
        color: '#ffffff',
        py: 8,
      }}
    >
      <Head>
        <title>Settings - KILL BUSYness</title>
      </Head>

      <Container maxWidth="md">
        <Typography variant="h3" component="h1" gutterBottom sx={{ color: '#f59e0b', fontWeight: 'bold', mb: 4 }}>
          Settings
        </Typography>

        <Paper
          elevation={3}
          sx={{
            p: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            borderRadius: 2,
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ color: '#ffffff', mb: 3 }}>
            Notification Customizer
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 4 }}>
            Select the days and time you'd like to receive your polite daily 5-minute reminder.
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ color: '#f59e0b', mb: 2 }}>
                Days of the Week
              </Typography>
              <FormGroup>
                {Object.keys(days).map((day) => (
                  <FormControlLabel
                    key={day}
                    control={
                      <Checkbox
                        checked={days[day as keyof typeof days]}
                        onChange={handleDayChange}
                        name={day}
                        sx={{
                          color: 'rgba(255, 255, 255, 0.5)',
                          '&.Mui-checked': {
                            color: '#f59e0b',
                          },
                        }}
                      />
                    }
                    label={day.charAt(0).toUpperCase() + day.slice(1)}
                    sx={{ color: '#ffffff' }}
                  />
                ))}
              </FormGroup>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ color: '#f59e0b', mb: 2 }}>
                Time of Day
              </Typography>
              <TextField
                id="time"
                label="Reminder Time"
                type="time"
                value={time}
                onChange={handleTimeChange}
                InputLabelProps={{
                  shrink: true,
                  sx: { color: 'rgba(255, 255, 255, 0.7)' },
                }}
                inputProps={{
                  step: 300, // 5 min
                }}
                sx={{
                  width: '100%',
                  '& .MuiOutlinedInput-root': {
                    color: '#ffffff',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#f59e0b',
                    },
                  },
                  '& input[type="time"]::-webkit-calendar-picker-indicator': {
                    filter: 'invert(1)',
                    cursor: 'pointer',
                  },
                }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 6, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{
                backgroundColor: '#f59e0b',
                color: '#0b1730',
                fontWeight: 'bold',
                px: 4,
                py: 1.5,
                '&:hover': {
                  backgroundColor: '#d97706',
                },
              }}
            >
              Save Preferences
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
