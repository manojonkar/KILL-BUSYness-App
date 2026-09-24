CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  credits INTEGER DEFAULT 0 NOT NULL,
  current_streak INTEGER DEFAULT 0 NOT NULL,
  last_access_date DATE
);

CREATE TABLE IF NOT EXISTS public.credit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  credits_awarded INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create a function to award credits and handle streaks atomically
CREATE OR REPLACE FUNCTION award_credits(
  p_user_id UUID,
  p_action TEXT
) RETURNS JSON AS $$
DECLARE
  v_credits_to_award INTEGER := 0;
  v_profile public.profiles;
  v_streak_bonus BOOLEAN := false;
  v_today DATE := CURRENT_DATE;
  v_result JSON;
BEGIN
  -- Lock the profile for update
  SELECT * INTO v_profile FROM public.profiles WHERE id = p_user_id FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profile not found';
  END IF;

  IF p_action = 'daily_access' THEN
    -- Check if already accessed today
    IF v_profile.last_access_date = v_today THEN
      RETURN json_build_object('success', false, 'message', 'Daily access already claimed today.');
    END IF;

    v_credits_to_award := 1;
    
    -- Streak logic
    IF v_profile.last_access_date = v_today - INTERVAL '1 day' THEN
      v_profile.current_streak := v_profile.current_streak + 1;
    ELSE
      v_profile.current_streak := 1;
    END IF;

    v_profile.last_access_date := v_today;

    -- Check for streak bonus
    IF v_profile.current_streak % 7 = 0 THEN
      v_streak_bonus := true;
      v_credits_to_award := v_credits_to_award + 5;
    END IF;
    
  ELSIF p_action = 'module_completion' THEN
    v_credits_to_award := 5;
  ELSIF p_action = 'sharing' THEN
    v_credits_to_award := 5;
  ELSE
    RAISE EXCEPTION 'Invalid action type';
  END IF;

  -- Update profile
  UPDATE public.profiles
  SET 
    credits = credits + v_credits_to_award,
    current_streak = v_profile.current_streak,
    last_access_date = v_profile.last_access_date
  WHERE id = p_user_id;

  -- Log action
  INSERT INTO public.credit_logs (user_id, action_type, credits_awarded)
  VALUES (p_user_id, p_action, v_credits_to_award);
  
  IF v_streak_bonus THEN
    INSERT INTO public.credit_logs (user_id, action_type, credits_awarded)
    VALUES (p_user_id, 'streak_bonus', 5);
  END IF;

  RETURN json_build_object(
    'success', true,
    'awarded', v_credits_to_award,
    'streak_bonus', v_streak_bonus,
    'current_streak', v_profile.current_streak,
    'total_credits', v_profile.credits + v_credits_to_award
  );
END;
$$ LANGUAGE plpgsql;
