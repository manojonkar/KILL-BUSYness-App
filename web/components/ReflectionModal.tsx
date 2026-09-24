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
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import CloseIcon from '@mui/icons-material/Close';
import { useGamification } from './GamificationOverlay';

interface ReflectionModalProps {
  open: boolean;
  onClose: () => void;
  moduleId?: string | number;
}

const ReflectionModal: React.FC<ReflectionModalProps> = ({ open, onClose, moduleId }) => {
  const [tab, setTab] = useState(0);
  const [shareOption, setShareOption] = useState('private');
  const { earnCredits } = useGamification();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleSaveReflection = () => {
    earnCredits(
      5,
      `Reflection on Module ${moduleId || '1'} Saved & Shared (${shareOption})`,
      'Reflect'
    );
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
          borderRadius: fullScreen ? 0 : 2,
          minWidth: { sm: 500 },
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600 }}>
          Reflect
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <Tabs 
            value={tab} 
            onChange={handleTabChange} 
            variant="fullWidth"
            TabIndicatorProps={{
              style: { backgroundColor: '#3b82f6' } // Reflect phase color (Blue)
            }}
          >
            <Tab 
              label="Text" 
              sx={{ 
                color: 'rgba(255,255,255,0.7)', 
                '&.Mui-selected': { color: '#ffffff' } 
              }} 
            />
            <Tab 
              label="Voice Recording" 
              sx={{ 
                color: 'rgba(255,255,255,0.7)', 
                '&.Mui-selected': { color: '#ffffff' } 
              }} 
            />
          </Tabs>
        </Box>
        
        <Box sx={{ p: 3, minHeight: 250, display: 'flex', flexDirection: 'column' }}>
          {tab === 0 && (
            <TextField
              multiline
              rows={6}
              placeholder="What are you reflecting on today?"
              variant="outlined"
              fullWidth
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                  color: '#ffffff',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#3b82f6', // Reflect phase color
                  },
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
                  '&:hover': {
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                  }
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
              Sharing Options
            </InputLabel>
            <Select
              labelId="share-select-label"
              value={shareOption}
              label="Sharing Options"
              onChange={(e) => setShareOption(e.target.value)}
              sx={{
                color: '#ffffff',
                '.MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.2)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.3)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#3b82f6',
                },
                '.MuiSvgIcon-root': {
                  color: 'rgba(255,255,255,0.7)',
                }
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: '#0b1730',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    '& .MuiMenuItem-root': {
                      color: '#ffffff',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.05)',
                      },
                      '&.Mui-selected': {
                        bgcolor: 'rgba(59, 130, 246, 0.2)',
                        '&:hover': {
                          bgcolor: 'rgba(59, 130, 246, 0.3)',
                        }
                      }
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
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button 
          onClick={onClose} 
          sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
        >
          Cancel
        </Button>
        <Button 
          variant="contained"
          onClick={handleSaveReflection}
          sx={{ 
            backgroundColor: '#f59e0b', // Gold for primary action
            color: '#0b1730',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#d97706',
            }
          }}
        >
          Save Reflection
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReflectionModal;
