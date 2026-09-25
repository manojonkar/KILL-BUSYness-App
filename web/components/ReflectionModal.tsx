import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  Box,
  TextField,
  IconButton,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  useMediaQuery,
  Paper,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import CloseIcon from '@mui/icons-material/Close';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import ShareIcon from '@mui/icons-material/Share';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { useGamification } from './GamificationOverlay';

interface ReflectionModalProps {
  open: boolean;
  onClose: () => void;
  moduleId?: string | number;
}

const ReflectionModal: React.FC<ReflectionModalProps> = ({ open, onClose, moduleId }) => {
  const [tab, setTab] = useState(0);
  const [textValue, setTextValue] = useState('');
  const [shareOption, setShareOption] = useState('private');
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const { earnCredits } = useGamification();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  // Reset state when opened/closed
  React.useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setShowSuccessCard(false);
        setTextValue('');
        setTab(0);
        setShareOption('private');
      }, 300);
    }
  }, [open]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleSaveReflection = () => {
    earnCredits(
      15, // Increased points for reflecting
      `Reflection on Module ${moduleId || '1'} Saved`,
      'Reflect'
    );
    // Transition to the Social Share Success Card
    setShowSuccessCard(true);
  };

  const handleShareToLinkedIn = () => {
    const shareText = `"${textValue || 'Reflecting on how to move from Activity to Outcomes.'}"\n\n- My latest reflection from the KILL BUSYness app. Join the movement at app.killbusyness.com`;
    
    if (navigator.share) {
      navigator.share({
        title: 'KILL BUSYness Reflection',
        text: shareText,
        url: 'https://app.killbusyness.com'
      }).catch(console.error);
    } else {
      // Fallback for desktop: Open LinkedIn share URL
      const linkedInUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(shareText)}`;
      window.open(linkedInUrl, '_blank');
    }
    
    // Give bonus points for sharing
    earnCredits(25, 'Shared Reflection to Social Media', 'Assert');
    onClose();
  };

  return (
    <Dialog 
      fullScreen={fullScreen} 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: '#0b1730', // Dark navy
          color: '#ffffff',
          borderRadius: fullScreen ? 0 : 4,
          minWidth: { sm: 500 },
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 800 }}>
          {showSuccessCard ? 'Brilliant Insight! 🎯' : 'Reflect'}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: showSuccessCard ? 3 : 0 }}>
        
        {showSuccessCard ? (
          // --- SUCCESS & SOCIAL SHARE VIEW ---
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
              Your reflection has been saved. Inspire your network by sharing this insight!
            </Typography>
            
            {/* The Visual "Quote Card" */}
            <Paper sx={{ 
              p: 4, 
              mb: 4, 
              width: '100%',
              borderRadius: 3, 
              background: 'linear-gradient(135deg, #1e293b, #0b1730)',
              border: '2px solid #f59e0b',
              position: 'relative',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}>
              <FormatQuoteIcon sx={{ color: '#f59e0b', fontSize: 40, opacity: 0.5, position: 'absolute', top: 16, left: 16 }} />
              <Typography variant="h6" sx={{ color: 'white', fontStyle: 'italic', fontWeight: 600, mt: 3, mb: 3, lineHeight: 1.4 }}>
                "{textValue || 'I am committing to moving my team from mere activity to true outcomes.'}"
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <Box component="img" src="/emblem.jpg" sx={{ width: 24, height: 24, borderRadius: '50%' }} />
                <Typography variant="caption" sx={{ color: '#f59e0b', fontWeight: 'bold', letterSpacing: 1, textTransform: 'uppercase' }}>
                  KILL BUSYness Leader
                </Typography>
              </Box>
            </Paper>

            <Button 
              variant="contained" 
              fullWidth
              onClick={handleShareToLinkedIn}
              startIcon={<LinkedInIcon />}
              sx={{ 
                backgroundColor: '#0a66c2', // LinkedIn Blue
                color: 'white', 
                fontWeight: 'bold',
                py: 1.5,
                borderRadius: 2,
                mb: 2,
                '&:hover': { backgroundColor: '#084e96' }
              }}
            >
              Share to LinkedIn
            </Button>
            <Button 
              variant="outlined" 
              fullWidth
              onClick={handleShareToLinkedIn}
              startIcon={<ShareIcon />}
              sx={{ 
                borderColor: 'rgba(255,255,255,0.3)', 
                color: 'white', 
                fontWeight: 'bold',
                py: 1.5,
                borderRadius: 2,
                '&:hover': { borderColor: 'white' }
              }}
            >
              Share via...
            </Button>
          </Box>
        ) : (
          // --- STANDARD EDIT VIEW ---
          <>
            <Box sx={{ borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
              <Tabs 
                value={tab} 
                onChange={handleTabChange} 
                variant="fullWidth"
                TabIndicatorProps={{ style: { backgroundColor: '#3b82f6' } }}
              >
                <Tab label="Text" sx={{ color: 'rgba(255,255,255,0.7)', '&.Mui-selected': { color: '#ffffff', fontWeight: 'bold' } }} />
                <Tab label="Voice Recording" sx={{ color: 'rgba(255,255,255,0.7)', '&.Mui-selected': { color: '#ffffff', fontWeight: 'bold' } }} />
              </Tabs>
            </Box>
            
            <Box sx={{ p: 3, minHeight: 250, display: 'flex', flexDirection: 'column' }}>
              {tab === 0 && (
                <TextField
                  multiline
                  rows={6}
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  placeholder="What is your biggest takeaway from this module?"
                  variant="outlined"
                  fullWidth
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 1,
                    '& .MuiOutlinedInput-root': {
                      color: '#ffffff',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                      '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                    },
                  }}
                />
              )}

              {tab === 1 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
                  <IconButton 
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      backgroundColor: 'rgba(59, 130, 246, 0.1)', 
                      color: '#3b82f6',
                      mb: 2,
                      '&:hover': { backgroundColor: 'rgba(59, 130, 246, 0.2)' }
                    }}
                  >
                    <MicIcon sx={{ fontSize: 40 }} />
                  </IconButton>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Tap to start recording
                  </Typography>
                </Box>
              )}

              <FormControl fullWidth sx={{ mt: 'auto', pt: 3 }}>
                <InputLabel id="share-select-label" sx={{ color: 'rgba(255,255,255,0.7)', '&.Mui-focused': { color: '#3b82f6' } }}>
                  Visibility
                </InputLabel>
                <Select
                  labelId="share-select-label"
                  value={shareOption}
                  label="Visibility"
                  onChange={(e) => setShareOption(e.target.value)}
                  sx={{
                    color: '#ffffff',
                    '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6' },
                    '.MuiSvgIcon-root': { color: 'rgba(255,255,255,0.7)' }
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: '#0b1730',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        '& .MuiMenuItem-root': {
                          color: '#ffffff',
                          '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
                          '&.Mui-selected': { bgcolor: 'rgba(59, 130, 246, 0.2)', '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.3)' } }
                        }
                      }
                    }
                  }}
                >
                  <MenuItem value="private">Keep Private</MenuItem>
                  <MenuItem value="team">Share with Team</MenuItem>
                  <MenuItem value="company">Share with Company</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </>
        )}
      </DialogContent>
      
      {!showSuccessCard && (
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={onClose} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Cancel
          </Button>
          <Button 
            variant="contained"
            onClick={handleSaveReflection}
            sx={{ 
              backgroundColor: '#f59e0b',
              color: '#0b1730',
              fontWeight: 'bold',
              '&:hover': { backgroundColor: '#d97706' }
            }}
          >
            Save Reflection
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ReflectionModal;
