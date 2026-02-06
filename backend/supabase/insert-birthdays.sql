-- First, make user_id optional for public birthdays
ALTER TABLE birthdays ALTER COLUMN user_id DROP NOT NULL;

-- Now insert all birthdays (no user_id needed!)
INSERT INTO birthdays (name, birthday) VALUES
  -- January
  ('Alec', '2000-01-13'),
  ('Vivi', '2000-01-23'),
  ('Miku', '2000-01-28'),
  -- February
  ('Luenna Wu', '2000-02-09'),
  ('Jenny Wu', '2000-02-25'),
  -- April
  ('Eve Guo', '2000-04-03'),
  ('Carolyn Yu', '2000-04-16'),
  -- May
  ('Luke Yeh', '2000-05-01'),
  -- September
  ('Nicole Hsieh', '2000-09-05'),
  ('Joyce Lin', '2000-09-20'),
  -- October
  ('Ian Wu', '2000-10-22'),
  -- December
  ('Severus Lin', '2000-12-02'),
  ('Lynn Chang', '2000-12-05'),
  ('Catherine Chen', '2000-12-12'),
  ('Ethan Li', '2000-12-26');

-- Verify
SELECT name, TO_CHAR(birthday, 'Mon DD') as birthday
FROM birthdays
ORDER BY EXTRACT(MONTH FROM birthday), EXTRACT(DAY FROM birthday);
