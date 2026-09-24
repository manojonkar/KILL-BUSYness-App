import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';

export default function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandAlone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    setIsStandalone(isStandAlone);
    
    if (isStandAlone) return; // Don't show if already installed

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    if (isIOSDevice) {
      // iOS doesn't support beforeinstallprompt, so we just show the banner automatically
      setIsVisible(true);
    }

    // Capture the install prompt on Android/Chrome
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    });
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
    } else if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    }
  };

  if (!isVisible || isStandalone) return null;

  return (
    <>
      <Box sx={{ 
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 2000, 
        bgcolor: '#3b82f6', color: 'white', p: 2, 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 -4px 10px rgba(0,0,0,0.1)'
      }}>
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">Install KILL BUSYness</Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>Add to your home screen for the best experience.</Typography>
        </Box>
        <Button 
          variant="contained" 
          onClick={handleInstallClick}
          sx={{ bgcolor: 'white', color: '#3b82f6', fontWeight: 'bold', '&:hover': { bgcolor: '#f1f5f9' } }}
        >
          Install
        </Button>
      </Box>

      {/* iOS Instructions Modal */}
      <Dialog open={showIOSInstructions} onClose={() => setShowIOSInstructions(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center' }}>Install on iPhone</DialogTitle>
        <DialogContent sx={{ textAlign: 'center', pb: 4 }}>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Apple does not allow automatic installations. To install the app:
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            1. Tap the <b>Share</b> button at the bottom of Safari <br/>
            (it looks like a square with an arrow pointing up).
          </Typography>
          <Typography variant="body1">
            2. Scroll down and tap <br/><b>"Add to Home Screen"</b>.
          </Typography>
          <Button variant="outlined" onClick={() => setShowIOSInstructions(false)} sx={{ mt: 4 }}>
            Got it
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
