-- Delete existing data
DELETE FROM book;
ALTER TABLE book AUTO_INCREMENT = 1001;

DELETE FROM category;
ALTER TABLE category AUTO_INCREMENT = 1001;

-- Insert categories
INSERT INTO `category` (`name`) VALUES
                                    ('Romance'),
                                    ('Fantasy'),
                                    ('Thriller'),
                                    ('Horror');

-- Insert books for the Romance category (category_id = 1001)
INSERT INTO `book` (title, author, description, price, rating, is_public, is_featured, category_id) VALUES
                                                                                                        ('Twisted Love', 'Ana Huang', 'A steamy romance about love and betrayal.', 24.00, 5, TRUE, FALSE, 1001),
                                                                                                        ('The Friend Zone', 'Kristen Callihan', 'A heartwarming romantic comedy.', 24.00, 5, TRUE, FALSE, 1001),
                                                                                                        ('Reminders of Him', 'Colleen Hoover', 'A moving story of redemption.', 24.00, 5, FALSE, TRUE, 1001),
                                                                                                        ('November 9', 'Colleen Hoover', 'A romance set on a single day each year.', 24.00, 5, TRUE, FALSE, 1001),
                                                                                                        ('King of Wrath', 'Ana Huang', 'A billionaire romance novel.', 24.00, 5, FALSE, TRUE, 1001),
                                                                                                        ('Twisted Lies', 'Ana Huang', 'A story of deception and love.', 24.00, 5, TRUE, FALSE, 1001),
                                                                                                        ('Your Fault', 'Ana Huang', 'A second-chance romance.', 24.00, 5, FALSE, TRUE, 1001),
                                                                                                        ('Finding Perfect', 'Colleen Hoover', 'A novella about love and sacrifice.', 24.00, 5, TRUE, FALSE, 1001);

-- Insert books for the Fantasy category (category_id = 1002)
INSERT INTO `book` (title, author, description, price, rating, is_public, is_featured, category_id) VALUES
                                                                                                        ('The Name of the Wind', 'Patrick Rothfuss', 'A legendary fantasy epic.', 14.00, 5, TRUE, FALSE, 1002),
                                                                                                        ('The Priory of the Orange Tree', 'Samantha Shannon', 'A feminist fantasy novel.', 19.00, 5, FALSE, TRUE, 1002),
                                                                                                        ('Shadow and Bone', 'Leigh Bardugo', 'A fantasy adventure in the Grishaverse.', 12.00, 5, TRUE, FALSE, 1002),
                                                                                                        ('The Way of Kings', 'Brandon Sanderson', 'An epic fantasy saga.', 22.00, 5, TRUE, FALSE, 1002),
                                                                                                        ('A Court of Thorns and Roses', 'Sarah J. Maas', 'A mix of fantasy and romance.', 18.00, 5, FALSE, TRUE, 1002);

-- Insert books for the Thriller category (category_id = 1003)
INSERT INTO `book` (title, author, description, price, rating, is_public, is_featured, category_id) VALUES
                                                                                                        ('The Silent Patient', 'Alex Michaelides', 'A psychological thriller.', 13.00, 5, TRUE, FALSE, 1003),
                                                                                                        ('The Girl with the Dragon Tattoo', 'Stieg Larsson', 'A crime thriller with a dark edge.', 9.00, 5, FALSE, TRUE, 1003),
                                                                                                        ('Before I Go to Sleep', 'S.J. Watson', 'A psychological mystery thriller.', 8.00, 5, TRUE, FALSE, 1003),
                                                                                                        ('The Woman in the Window', 'A.J. Finn', 'A suspenseful thriller.', 10.00, 5, FALSE, TRUE, 1003),
                                                                                                        ('The Chain', 'Adrian McKinty', 'A novel about a horrifying ransom chain.', 15.00, 5, TRUE, FALSE, 1003);

-- Insert books for the Horror category (category_id = 1004)
INSERT INTO `book` (title, author, description, price, rating, is_public, is_featured, category_id) VALUES
                                                                                                        ('The Shining', 'Stephen King', 'A classic horror novel.', 11.00, 5, TRUE, FALSE, 1004),
                                                                                                        ('House of Leaves', 'Mark Z. Danielewski', 'A mind-bending horror story.', 16.00, 5, FALSE, TRUE, 1004),
                                                                                                        ('Bird Box', 'Josh Malerman', 'A post-apocalyptic horror thriller.', 10.00, 5, TRUE, FALSE, 1004),
                                                                                                        ('The Exorcist', 'William Peter Blatty', 'A terrifying horror masterpiece.', 13.00, 5, FALSE, TRUE, 1004),
                                                                                                        ('Mexican Gothic', 'Silvia Moreno-Garcia', 'A gothic horror novel.', 14.00, 5, TRUE, FALSE, 1004);
