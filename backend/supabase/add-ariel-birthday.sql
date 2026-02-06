-- Add Ariel Chen's birthday
INSERT INTO birthdays (name, date) VALUES ('Ariel Chen', '2000-03-04');

-- Verify
SELECT name, date FROM birthdays WHERE name = 'Ariel Chen';
