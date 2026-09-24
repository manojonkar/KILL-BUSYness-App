import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Portal,
  Slide,
  Dialog,
  Fade,
} from '@mui/material';

// ==========================================
// TYPES & CONSTANTS
// ==========================================

export type ROARPhase = 'Reflect' | 'Own' | 'Assert' | 'Run' | 'General';

export interface BadgeReward {
  name: string;
  icon?: string;
  description?: string;
}

export interface RewardPayload {
  id?: string;
  amount: number;
  title?: string;
  subtitle?: string;
  phase?: ROARPhase;
  streak?: number;
  streakBonus?: boolean;
  badge?: BadgeReward;
  mode?: 'toast' | 'modal';
  duration?: number; // ms (default 4500)
  actionLabel?: string;
  onAction?: () => void;
  playSound?: boolean;
}

interface GamificationContextType {
  isInsideProvider?: boolean;
  triggerReward: (payload: RewardPayload) => void;
  earnCredits: (amount: number, reason?: string, phase?: ROARPhase) => void;
  celebrateBadge: (name: string, description?: string, icon?: string) => void;
  celebrateStreak: (streakDays: number, bonusCredits?: number) => void;
  dismissCurrent: () => void;
}

const PHASE_THEMES: Record<
  ROARPhase,
  {
    primary: string;
    light: string;
    glow: string;
    tag: string;
    bgGradient: string;
  }
> = {
  Reflect: {
    primary: '#3b82f6', // Light Blue
    light: '#93c5fd',
    glow: 'rgba(59, 130, 246, 0.45)',
    tag: '🔍 REFLECT PHASE',
    bgGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.22) 0%, rgba(11, 23, 48, 0.98) 100%)',
  },
  Own: {
    primary: '#f59e0b', // Gold
    light: '#fde68a',
    glow: 'rgba(245, 158, 11, 0.45)',
    tag: '👑 OWN PHASE',
    bgGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.22) 0%, rgba(11, 23, 48, 0.98) 100%)',
  },
  Assert: {
    primary: '#10b981', // Green
    light: '#a7f3d0',
    glow: 'rgba(16, 185, 129, 0.45)',
    tag: '⚔️ ASSERT PHASE',
    bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.22) 0%, rgba(11, 23, 48, 0.98) 100%)',
  },
  Run: {
    primary: '#8b5cf6', // Lavender
    light: '#ddd6fe',
    glow: 'rgba(139, 92, 246, 0.45)',
    tag: '🚀 RUN PHASE',
    bgGradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.22) 0%, rgba(11, 23, 48, 0.98) 100%)',
  },
  General: {
    primary: '#f59e0b', // Gold
    light: '#fde68a',
    glow: 'rgba(245, 158, 11, 0.45)',
    tag: '✨ MI CREDITS',
    bgGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.22) 0%, rgba(11, 23, 48, 0.98) 100%)',
  },
};

const GLOBAL_EVENT_NAME = 'killbusyness:reward';

// ==========================================
// AUDIO SYNTHESIZER (EXECUTIVE CHIME)
// ==========================================

const playExecutiveChime = () => {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    // Play an uplifting luxury 4-note ascending chord (C5, E5, G5, C6)
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const startTime = ctx.currentTime + idx * 0.07;
      const duration = 0.55;

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.14, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  } catch {
    // Graceful fallback if audio is blocked or restricted
  }
};

// Haptic trigger helper
const triggerHaptics = () => {
  if (typeof window !== 'undefined' && 'navigator' in window && window.navigator.vibrate) {
    try {
      window.navigator.vibrate([25, 40, 30]);
    } catch {
      // Ignored
    }
  }
};

// ==========================================
// VECTOR ICONS (SELF-CONTAINED)
// ==========================================

const MICoinIcon = ({ size = 44 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <defs>
      <linearGradient id="coinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="45%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
      <linearGradient id="coinInner" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#d97706" />
        <stop offset="100%" stopColor="#78350f" />
      </linearGradient>
      <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    {/* Outer glow ring */}
    <circle cx="50" cy="50" r="46" stroke="url(#coinGrad)" strokeWidth="3" filter="url(#goldGlow)" opacity="0.8" />
    {/* Coin Body */}
    <circle cx="50" cy="50" r="42" fill="url(#coinGrad)" />
    {/* Inner Rim */}
    <circle cx="50" cy="50" r="35" fill="url(#coinInner)" stroke="#fef08a" strokeWidth="1.5" />
    {/* MI Insignia */}
    <text
      x="50"
      y="58"
      textAnchor="middle"
      fill="#fef3c7"
      fontWeight="900"
      fontSize="24"
      fontFamily="sans-serif"
      letterSpacing="1"
    >
      MI
    </text>
  </svg>
);

const SparkleIcon = ({ size = 20, color = '#f59e0b' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const TrophyIcon = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.45 1-1 1H8c-.55 0-1 .45-1 1v1h10v-1c0-.55-.45-1-1-1h-1c-.55 0-1-.45-1-1v-2.34" />
    <path d="M6 4h12v6a6 6 0 0 1-12 0V4Z" fill="rgba(245, 158, 11, 0.25)" />
  </svg>
);

// ==========================================
// CONFETTI PARTICLES COMPONENT
// ==========================================

const PARTICLE_COLORS = ['#f59e0b', '#fbbf24', '#3b82f6', '#10b981', '#8b5cf6', '#ffffff', '#ec4899'];

const ConfettiBurst = ({ active }: { active: boolean }) => {
  if (!active) return null;

  // Generate 26 burst particles with radial trajectory
  const particles = Array.from({ length: 26 }, (_, i) => {
    const angle = (i / 26) * 360;
    const distance = 60 + Math.floor(Math.random() * 80);
    const rad = (angle * Math.PI) / 180;
    const tx = Math.cos(rad) * distance;
    const ty = Math.sin(rad) * distance - 20; // slight upward drift
    const color = PARTICLE_COLORS[i % PARTICLE_COLORS.length];
    const delay = Math.random() * 0.15;
    const size = 5 + (i % 4) * 2;
    const isStar = i % 3 === 0;

    return { id: i, tx, ty, color, delay, size, isStar };
  });

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 0,
        height: 0,
        pointerEvents: 'none',
        zIndex: 50,
      }}
    >
      {particles.map((p) => (
        <Box
          key={p.id}
          sx={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            borderRadius: p.isStar ? '1px' : '50%',
            backgroundColor: p.color,
            boxShadow: `0 0 8px ${p.color}`,
            transform: 'translate(-50%, -50%)',
            animation: `burstOut 1.1s cubic-bezier(0.12, 0.8, 0.32, 1) forwards`,
            animationDelay: `${p.delay}s`,
            opacity: 0,
            '@keyframes burstOut': {
              '0%': {
                transform: 'translate(-50%, -50%) scale(0.3) rotate(0deg)',
                opacity: 1,
              },
              '70%': {
                opacity: 1,
              },
              '100%': {
                transform: `translate(calc(-50% + ${p.tx}px), calc(-50% + ${p.ty}px)) scale(0) rotate(${p.tx * 3}deg)`,
                opacity: 0,
              },
            },
          }}
        />
      ))}
    </Box>
  );
};

// ==========================================
// CONTEXT & EVENT BUS
// ==========================================

export const GamificationContext = createContext<GamificationContextType>({
  isInsideProvider: false,
  triggerReward: () => {},
  earnCredits: () => {},
  celebrateBadge: () => {},
  celebrateStreak: () => {},
  dismissCurrent: () => {},
});

export const useGamification = () => useContext(GamificationContext);

/**
 * Imperative trigger for use anywhere (even outside React component tree).
 */
export const triggerGamificationReward = (payload: RewardPayload) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(GLOBAL_EVENT_NAME, { detail: payload })
    );
  }
};

// ==========================================
// PROVIDER COMPONENT
// ==========================================

export const GamificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [queue, setQueue] = useState<RewardPayload[]>([]);
  const [currentReward, setCurrentReward] = useState<RewardPayload | null>(null);

  // Trigger reward function
  const triggerReward = useCallback((payload: RewardPayload) => {
    const enrichedPayload: RewardPayload = {
      ...payload,
      id: payload.id || `reward-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: payload.title || `+${payload.amount} MI Credits Earned!`,
      phase: payload.phase || 'General',
      duration: payload.duration ?? (payload.mode === 'modal' ? 7000 : 4500),
      playSound: payload.playSound !== false,
    };

    setQueue((prev) => [...prev, enrichedPayload]);
  }, []);

  // Convenience helpers
  const earnCredits = useCallback(
    (amount: number, reason?: string, phase: ROARPhase = 'General') => {
      triggerReward({
        amount,
        title: `+${amount} MI Credits Earned!`,
        subtitle: reason || 'Deep Work Habit Progression',
        phase,
        mode: 'toast',
      });
    },
    [triggerReward]
  );

  const celebrateBadge = useCallback(
    (name: string, description?: string, icon?: string) => {
      triggerReward({
        amount: 15,
        title: 'Achievement Unlocked!',
        subtitle: description || `You mastered "${name}"`,
        badge: { name, description, icon: icon || '🏆' },
        mode: 'modal',
      });
    },
    [triggerReward]
  );

  const celebrateStreak = useCallback(
    (streakDays: number, bonusCredits: number = 5) => {
      triggerReward({
        amount: bonusCredits,
        title: `🔥 ${streakDays}-Day Momentum Streak!`,
        subtitle: `Bonus +${bonusCredits} MI Credits for consistent leadership focus`,
        streak: streakDays,
        streakBonus: true,
        mode: 'modal',
      });
    },
    [triggerReward]
  );

  const dismissCurrent = useCallback(() => {
    setCurrentReward(null);
  }, []);

  // Listen to window custom events
  useEffect(() => {
    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent<RewardPayload>;
      if (customEvent.detail) {
        triggerReward(customEvent.detail);
      }
    };

    window.addEventListener(GLOBAL_EVENT_NAME, handleCustomEvent);
    return () => {
      window.removeEventListener(GLOBAL_EVENT_NAME, handleCustomEvent);
    };
  }, [triggerReward]);

  // Queue runner
  useEffect(() => {
    if (!currentReward && queue.length > 0) {
      const [nextReward, ...remaining] = queue;
      setCurrentReward(nextReward);
      setQueue(remaining);

      // Play audio & haptics
      if (nextReward.playSound) {
        playExecutiveChime();
        triggerHaptics();
      }
    }
  }, [currentReward, queue]);

  return (
    <GamificationContext.Provider
      value={{
        isInsideProvider: true,
        triggerReward,
        earnCredits,
        celebrateBadge,
        celebrateStreak,
        dismissCurrent,
      }}
    >
      {children}
      <GamificationRenderer
        reward={currentReward}
        onClose={dismissCurrent}
      />
    </GamificationContext.Provider>
  );
};

// ==========================================
// OVERLAY RENDERER (TOAST + MODAL)
// ==========================================

interface GamificationRendererProps {
  reward: RewardPayload | null;
  onClose: () => void;
}

const GamificationRenderer = ({ reward, onClose }: GamificationRendererProps) => {
  const [displayedAmount, setDisplayedAmount] = useState<number>(0);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle counter roll-up & auto-dismiss
  useEffect(() => {
    if (!reward) {
      setDisplayedAmount(0);
      setShowConfetti(false);
      return;
    }

    setShowConfetti(true);

    // Number counting roll-up animation
    const target = reward.amount;
    const duration = 600;
    const steps = Math.min(Math.max(target, 8), 20);
    const stepDuration = duration / steps;
    let currentStep = 0;

    const counterInterval = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setDisplayedAmount(target);
        clearInterval(counterInterval);
      } else {
        setDisplayedAmount(Math.round((currentStep / steps) * target));
      }
    }, stepDuration);

    // Auto dismiss for toast
    const autoCloseDuration = reward.duration || 4500;
    timerRef.current = setTimeout(() => {
      onClose();
    }, autoCloseDuration);

    return () => {
      clearInterval(counterInterval);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [reward, onClose]);

  if (!reward) return null;

  const phase = reward.phase || 'General';
  const theme = PHASE_THEMES[phase] || PHASE_THEMES.General;
  const isModal = reward.mode === 'modal';

  return (
    <Portal>
      {/* Keyframe Styles for Executive Luxury Feel */}
      <style>{`
        @keyframes coinBounce {
          0% { transform: scale(0) rotateY(180deg); }
          60% { transform: scale(1.18) rotateY(-15deg); }
          80% { transform: scale(0.95) rotateY(5deg); }
          100% { transform: scale(1) rotateY(0deg); }
        }
        @keyframes goldGlowPulse {
          0%, 100% { box-shadow: 0 12px 35px -8px ${theme.glow}, 0 0 20px -2px rgba(245, 158, 11, 0.3); }
          50% { box-shadow: 0 16px 45px -4px ${theme.glow}, 0 0 32px 4px rgba(245, 158, 11, 0.55); }
        }
        @keyframes shimmerText {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes sunburstSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* ==================================================== */}
      {/* 1. MODAL CELEBRATION MODE (FOR MILESTONES & BADGES) */}
      {/* ==================================================== */}
      {isModal ? (
        <Dialog
          open={Boolean(reward)}
          onClose={onClose}
          TransitionComponent={Fade}
          PaperProps={{
            sx: {
              bgcolor: 'transparent',
              boxShadow: 'none',
              overflow: 'visible',
              maxWidth: 420,
              width: '92%',
              m: 2,
            },
          }}
          BackdropProps={{
            sx: {
              bgcolor: 'rgba(11, 23, 48, 0.88)',
              backdropFilter: 'blur(10px)',
            },
          }}
        >
          <Box
            sx={{
              position: 'relative',
              borderRadius: '28px',
              background: `radial-gradient(circle at 50% 20%, rgba(30, 58, 110, 0.9) 0%, #0b1730 85%)`,
              border: `1.5px solid ${theme.primary}`,
              p: { xs: 3.5, sm: 4.5 },
              textAlign: 'center',
              color: '#ffffff',
              boxShadow: `0 25px 60px -15px rgba(0,0,0,0.8), 0 0 35px ${theme.glow}`,
              animation: 'goldGlowPulse 3s infinite ease-in-out',
              overflow: 'hidden',
            }}
          >
            {/* Rotating Sunburst background glow */}
            <Box
              sx={{
                position: 'absolute',
                top: '-40%',
                left: '-40%',
                width: '180%',
                height: '180%',
                opacity: 0.12,
                pointerEvents: 'none',
                background: `repeating-conic-gradient(from 0deg at 50% 50%, ${theme.primary} 0deg 15deg, transparent 15deg 30deg)`,
                animation: 'sunburstSpin 35s linear infinite',
              }}
            />

            {/* Confetti Spawner */}
            <ConfettiBurst active={showConfetti} />

            {/* Close Icon */}
            <IconButton
              onClick={onClose}
              sx={{
                position: 'absolute',
                top: 14,
                right: 14,
                color: 'rgba(255, 255, 255, 0.6)',
                bgcolor: 'rgba(255, 255, 255, 0.08)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)', color: '#ffffff' },
                zIndex: 2,
              }}
            >
              <CloseIcon />
            </IconButton>

            {/* Emblem / Badge Hero Icon */}
            <Box sx={{ position: 'relative', display: 'inline-block', mb: 2.5, mt: 1 }}>
              <Box
                sx={{
                  width: 90,
                  height: 90,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(245, 158, 11, 0.15)',
                  border: `2px solid ${theme.primary}`,
                  boxShadow: `0 0 30px ${theme.glow}`,
                  animation: 'coinBounce 0.8s cubic-bezier(0.17, 0.89, 0.32, 1.25) forwards',
                  fontSize: reward.badge?.icon ? '2.8rem' : undefined,
                }}
              >
                {reward.badge?.icon ? (
                  reward.badge.icon
                ) : reward.streakBonus ? (
                  <Typography sx={{ fontSize: '3rem' }}>🔥</Typography>
                ) : (
                  <MICoinIcon size={64} />
                )}
              </Box>
            </Box>

            {/* Phase / Achievement Tag */}
            <Box sx={{ mb: 1 }}>
              <Box
                component="span"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.8,
                  px: 1.8,
                  py: 0.5,
                  borderRadius: '999px',
                  bgcolor: 'rgba(245, 158, 11, 0.15)',
                  border: `1px solid ${theme.primary}`,
                  color: theme.primary,
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                }}
              >
                <SparkleIcon size={14} color={theme.primary} />
                {reward.badge ? 'Badge Unlocked' : reward.streak ? 'Momentum Milestone' : theme.tag}
              </Box>
            </Box>

            {/* Big Award Title */}
            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
                letterSpacing: '-0.5px',
                mb: 1,
                background: 'linear-gradient(135deg, #ffffff 30%, #fde68a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {reward.title}
            </Typography>

            {/* Subtitle / Context description */}
            {reward.subtitle && (
              <Typography
                variant="body2"
                sx={{
                  color: '#c9cbd3',
                  maxWidth: '300px',
                  mx: 'auto',
                  mb: 3,
                  lineHeight: 1.5,
                }}
              >
                {reward.subtitle}
              </Typography>
            )}

            {/* Credit Points Value Box */}
            <Box
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.06)',
                borderRadius: '16px',
                p: 2,
                mb: 3,
                border: '1px solid rgba(255, 255, 255, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.5,
              }}
            >
              <MICoinIcon size={34} />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 900,
                  color: '#f59e0b',
                  letterSpacing: '-0.5px',
                  textShadow: '0 2px 10px rgba(245, 158, 11, 0.4)',
                }}
              >
                +{displayedAmount} Credits
              </Typography>
            </Box>

            {/* Action CTA Button */}
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                if (reward.onAction) reward.onAction();
                onClose();
              }}
              sx={{
                bgcolor: '#f59e0b',
                color: '#0b1730',
                py: 1.5,
                borderRadius: '14px',
                fontWeight: 800,
                fontSize: '1rem',
                textTransform: 'none',
                boxShadow: '0 6px 20px rgba(245, 158, 11, 0.45)',
                '&:hover': {
                  bgcolor: '#fbbf24',
                  boxShadow: '0 8px 25px rgba(245, 158, 11, 0.65)',
                },
              }}
            >
              {reward.actionLabel || 'Claim & Keep Momentum 🚀'}
            </Button>
          </Box>
        </Dialog>
      ) : (
        /* ==================================================== */
        /* 2. TOAST / SNACKBAR MODE (SLEEK FLOATING EXECUTIVE PILL) */
        /* ==================================================== */
        <Slide direction="down" in={Boolean(reward)} mountOnEnter unmountOnExit>
          <Box
            sx={{
              position: 'fixed',
              top: { xs: 16, sm: 24 },
              left: 0,
              right: 0,
              zIndex: 9999,
              display: 'flex',
              justifyContent: 'center',
              pointerEvents: 'none',
              px: 2,
            }}
          >
            <Box
              sx={{
                pointerEvents: 'auto',
                width: '100%',
                maxWidth: { xs: '380px', sm: '440px' },
                borderRadius: '20px',
                background: theme.bgGradient,
                border: `1.5px solid ${theme.primary}`,
                backdropFilter: 'blur(20px)',
                boxShadow: `0 20px 40px -10px rgba(0,0,0,0.65), 0 0 25px ${theme.glow}`,
                p: 2,
                position: 'relative',
                overflow: 'hidden',
                animation: 'goldGlowPulse 2.8s infinite ease-in-out',
                display: 'flex',
                alignItems: 'center',
                gap: 1.8,
              }}
            >
              {/* Confetti Particles on entry */}
              <ConfettiBurst active={showConfetti} />

              {/* Animated Coin Badge on the left */}
              <Box
                sx={{
                  position: 'relative',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'coinBounce 0.7s cubic-bezier(0.17, 0.89, 0.32, 1.25) forwards',
                }}
              >
                <MICoinIcon size={46} />
              </Box>

              {/* Main Content Info */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                {/* Phase & Streak Badge Row */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.3 }}>
                  <Typography
                    sx={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      color: theme.light,
                      letterSpacing: '0.8px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {theme.tag}
                  </Typography>

                  {reward.streak && (
                    <Box
                      sx={{
                        px: 0.8,
                        py: 0.1,
                        borderRadius: '6px',
                        bgcolor: 'rgba(239, 68, 68, 0.2)',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        color: '#f87171',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                      }}
                    >
                      🔥 {reward.streak}d Streak
                    </Box>
                  )}
                </Box>

                {/* Point Headline with Shimmer Effect */}
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: '1.05rem', sm: '1.15rem' },
                    lineHeight: 1.2,
                    background: 'linear-gradient(90deg, #ffffff 0%, #fde68a 40%, #ffffff 80%)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: 'shimmerText 3s linear infinite',
                  }}
                >
                  +{displayedAmount} MI Credits Earned!
                </Typography>

                {/* Subtitle / Trigger Context */}
                {reward.subtitle && (
                  <Typography
                    noWrap
                    sx={{
                      fontSize: '0.78rem',
                      color: '#cbd5e1',
                      mt: 0.3,
                      fontWeight: 500,
                    }}
                  >
                    {reward.subtitle}
                  </Typography>
                )}
              </Box>

              {/* Action Button (if provided) */}
              {reward.actionLabel && (
                <Button
                  size="small"
                  onClick={() => {
                    if (reward.onAction) reward.onAction();
                    onClose();
                  }}
                  sx={{
                    flexShrink: 0,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    textTransform: 'none',
                    borderRadius: '10px',
                    px: 1.2,
                    py: 0.5,
                    border: '1px solid rgba(255,255,255,0.2)',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.2)',
                    },
                  }}
                >
                  {reward.actionLabel}
                </Button>
              )}

              {/* Dismiss Button */}
              <IconButton
                size="small"
                onClick={onClose}
                sx={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  p: 0.5,
                  '&:hover': { color: '#ffffff', bgcolor: 'rgba(255, 255, 255, 0.1)' },
                  flexShrink: 0,
                }}
              >
                <CloseIcon />
              </IconButton>

              {/* Countdown Progress Bar at Bottom of Pill */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    height: '100%',
                    bgcolor: theme.primary,
                    width: '100%',
                    animation: `countdown ${reward.duration || 4500}ms linear forwards`,
                    '@keyframes countdown': {
                      from: { width: '100%' },
                      to: { width: '0%' },
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Slide>
      )}
    </Portal>
  );
};

// ==========================================
// DEFAULT STANDALONE EXPORT
// ==========================================

/**
 * Global component that can be placed in Layout or _app.tsx.
 * If used inside a <GamificationProvider>, the provider automatically handles rendering.
 * If used standalone without a provider, it creates its own local event listener.
 */
export default function GamificationOverlay() {
  const context = useContext(GamificationContext);

  // If already wrapped in GamificationProvider, the provider manages the overlay renderer.
  // In that case, this component acts as a no-op marker to prevent double rendering.
  if (context?.isInsideProvider) {
    return null;
  }

  // Standalone mode: attach window event listener directly
  return <StandaloneGamificationOverlay />;
}

const StandaloneGamificationOverlay = () => {
  const [currentReward, setCurrentReward] = useState<RewardPayload | null>(null);

  useEffect(() => {
    const handleEvent = (e: Event) => {
      const customEvent = e as CustomEvent<RewardPayload>;
      if (customEvent.detail) {
        const enriched = {
          ...customEvent.detail,
          title: customEvent.detail.title || `+${customEvent.detail.amount} MI Credits Earned!`,
          duration: customEvent.detail.duration || 4500,
        };
        setCurrentReward(enriched);
        if (enriched.playSound !== false) {
          playExecutiveChime();
          triggerHaptics();
        }
      }
    };

    window.addEventListener(GLOBAL_EVENT_NAME, handleEvent);
    return () => {
      window.removeEventListener(GLOBAL_EVENT_NAME, handleEvent);
    };
  }, []);

  return (
    <GamificationRenderer
      reward={currentReward}
      onClose={() => setCurrentReward(null)}
    />
  );
};
