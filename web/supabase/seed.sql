-- Seed Data for Modules based on KILL BUSYness ROAR framework
-- Phase: Reflect (Chapters 1-4)
-- Phase: Own (Chapters 5-6)
-- Phase: Assert (Chapters 7-8)
-- Phase: Run (Chapters 9-10)

INSERT INTO public.modules (chapter, title, content, audio_url, phase)
VALUES
    (1, 'The BUSYness Mirror', 'Confront the illusion of activity vs productivity. Learn how unexamined busyness disguises lack of strategic clarity.', 'https://audio.killbusyness.com/ch01_mirror.mp3', 'Reflect'),
    (2, 'Purpose', 'Clarify organizational and personal purpose to establish the baseline of what truly matters.', 'https://audio.killbusyness.com/ch02_purpose.mp3', 'Reflect'),
    (3, 'Strategy', 'Focus on essential high-leverage priorities and discard tactical noise that drains team momentum.', 'https://audio.killbusyness.com/ch03_strategy.mp3', 'Reflect'),
    (4, 'The Competency Chain', 'Evaluate individual and team competencies needed to execute without constant managerial friction.', 'https://audio.killbusyness.com/ch04_competency.mp3', 'Reflect'),
    (5, 'Reflection', 'Institutionalize deliberate reflection loops to turn daily experience into actionable insight.', 'https://audio.killbusyness.com/ch05_reflection.mp3', 'Own'),
    (6, 'Ownership', 'Transition from passive compliance to proactive extreme ownership across every tier of management.', 'https://audio.killbusyness.com/ch06_ownership.mp3', 'Own'),
    (7, 'Leadership Creates', 'Understand how leaders actively create the operating culture and environment for their teams.', 'https://audio.killbusyness.com/ch07_leadership.mp3', 'Assert'),
    (8, 'Assert the Standard', 'Define clear, uncompromising standards of excellence and hold team members accountable without apology.', 'https://audio.killbusyness.com/ch08_standards.mp3', 'Assert'),
    (9, 'Build', 'Systematize processes, architectures, and cadence so high performance runs predictably and sustainably.', 'https://audio.killbusyness.com/ch09_build.mp3', 'Run'),
    (10, 'Sustaining Greatness', 'Prevent backsliding into busyness and build enduring cultural resilience over time.', 'https://audio.killbusyness.com/ch10_sustaining.mp3', 'Run')
ON CONFLICT DO NOTHING;
