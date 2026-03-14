INSERT INTO users (user_name, email, phone,password_hash, role_id) VALUES
('John Admin', 'admin@eventify.com', 01718068346,'hash_secure_123', 1),
('Alice Smith', 'alice@gmail.com',01718068356, 'password_hash_abc', 2);

INSERT INTO categories (category_name) VALUES
('Music'),
('Workshop'),
('Tech Conference');

INSERT INTO venue (name, location, total_capacity) VALUES
('Grand Ballroom', '123 Main St, New York', 500),
('Tech Hub Plaza', '456 Innovation Way, San Francisco', 200);

INSERT INTO events (event_name, description, start_date_time, venue_id, category_id, user_id) VALUES
('Rock Concert 2026', 'A night of classic rock and roll.', '2026-05-20 19:00', 1, 1, 1);

INSERT INTO ticket (ticket_type, price, quantity, event_id) VALUES
('VIP', 150.00, 50, 1),
('Regular', 50.00, 450, 1);

INSERT INTO bookings (booking_date, user_id, ticket_id, payment_id) VALUES
('2026-03-05 10:30', 2, 2, 1);

INSERT INTO payment (pay_amount, payment_method, booking_id) VALUES
(50.00, 'Credit Card', 1);

INSERT INTO reviews (rating, comment, review_date, event_id, user_id) VALUES
(5, 'Amazing performance!', '2026-05-21', 1, 2);