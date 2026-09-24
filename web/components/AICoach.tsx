import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Fab,
  useTheme,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const AICoach: React.FC = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your KILL BUSYness AI Coach. How can I help you focus today?",
      sender: 'ai',
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (open) {
      scrollToBottom();
    }
  }, [messages, open]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm a simulated coach. In the full version, I will analyze your tasks and provide actionable advice based on the ROAR framework.",
        sender: 'ai',
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="chat"
        onClick={handleOpen}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          backgroundColor: '#f59e0b', // Gold
          '&:hover': {
            backgroundColor: '#d97706',
          },
        }}
      >
        <ChatIcon />
      </Fab>

      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        keepMounted
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            position: 'fixed',
            bottom: 24,
            right: { xs: 0, sm: 24 },
            m: { xs: 2, sm: 0 },
            height: { xs: '80vh', sm: '600px' },
            width: { xs: 'auto', sm: '400px' },
            borderRadius: 3,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#0b1730', // Navy
            color: 'white',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            p: 2,
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <SmartToyIcon sx={{ color: '#f59e0b' }} />
            <Typography variant="h6" fontWeight="bold">
              AI Coach
            </Typography>
          </Box>
          <IconButton onClick={handleClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            flexGrow: 1,
            p: 2,
            backgroundColor: '#f8fafc',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <Box
                key={msg.id}
                sx={{
                  display: 'flex',
                  justifyContent: isUser ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-end',
                  gap: 1,
                }}
              >
                {!isUser && (
                  <Avatar sx={{ bgcolor: '#0b1730', width: 32, height: 32 }}>
                    <SmartToyIcon fontSize="small" sx={{ color: '#f59e0b' }} />
                  </Avatar>
                )}
                <Paper
                  elevation={1}
                  sx={{
                    p: 1.5,
                    maxWidth: '75%',
                    backgroundColor: isUser ? '#0b1730' : 'white',
                    color: isUser ? 'white' : 'text.primary',
                    borderRadius: 2,
                    borderBottomRightRadius: isUser ? 4 : 16,
                    borderBottomLeftRadius: !isUser ? 4 : 16,
                  }}
                >
                  <Typography variant="body2">{msg.text}</Typography>
                </Paper>
                {isUser && (
                  <Avatar sx={{ bgcolor: '#f59e0b', width: 32, height: 32 }}>
                    <PersonIcon fontSize="small" />
                  </Avatar>
                )}
              </Box>
            );
          })}
          <div ref={messagesEndRef} />
        </DialogContent>

        <Box
          sx={{
            p: 2,
            backgroundColor: 'white',
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Ask the Coach..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <IconButton
              color="primary"
              onClick={handleSend}
              disabled={!input.trim()}
              sx={{
                backgroundColor: '#0b1730',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#1a365d',
                },
                '&.Mui-disabled': {
                  backgroundColor: 'rgba(0, 0, 0, 0.12)',
                },
                borderRadius: 2,
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};
export default AICoach;
