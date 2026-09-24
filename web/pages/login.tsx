import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Card, CardContent } from '@mui/material';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } }
      });
      if (error) setMessage(error.message);
      else {
        setMessage('Registration successful! Logging you in...');
        setTimeout(() => router.push('/'), 1500);
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
      else router.push('/');
    }
    setLoading(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f8fafc', p: 2 }}>
      <Card sx={{ maxWidth: 400, width: '100%', borderRadius: 4, boxShadow: '0 10px 40px rgba(11,23,48,0.1)' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box component="img" src="/emblem.jpg" alt="Logo" sx={{ width: 60, height: 60, borderRadius: '50%', mb: 2, border: '2px solid #f59e0b' }} />
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#0b1730' }}>
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              KILL BUSYness Executive Platform
            </Typography>
          </Box>

          <form onSubmit={handleAuth}>
            {isSignUp && (
              <TextField
                fullWidth
                label="Full Name"
                variant="outlined"
                margin="normal"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            {message && (
              <Typography sx={{ color: message.includes('success') ? 'green' : 'red', mt: 2, fontSize: '0.85rem', textAlign: 'center' }}>
                {message}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5, bgcolor: '#0b1730', borderRadius: 2, '&:hover': { bgcolor: '#1e293b' } }}
            >
              {loading ? 'Processing...' : isSignUp ? 'Register & Begin' : 'Log In'}
            </Button>
          </form>

          <Button fullWidth onClick={() => setIsSignUp(!isSignUp)} sx={{ textTransform: 'none', color: '#64748b' }}>
            {isSignUp ? 'Already have an account? Log in' : "Don't have an account? Register"}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
