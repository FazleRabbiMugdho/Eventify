CREATE DATABASE IF NOT EXISTS `event_management` DEFAULT CHARACTER SET latin1 COLLATE latin1_danish_ci;


CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  user_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role_id INT NOT NULL
);

CREATE TABLE categories (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  category_name VARCHAR(50) NOT NULL
);

CREATE TABLE venue (
  venue_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  total_capacity INT NOT NULL
);

CREATE TABLE events (
  event_id INT AUTO_INCREMENT PRIMARY KEY,
  event_name VARCHAR(100) NOT NULL,
  description VARCHAR(100),
  start_date_time VARCHAR(50),
  venue_id INT,
  category_id INT,
  user_id INT,
  FOREIGN KEY (venue_id) REFERENCES venue(venue_id),
  FOREIGN KEY (category_id) REFERENCES categories(category_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE ticket (
  ticket_id INT AUTO_INCREMENT PRIMARY KEY,
  ticket_type VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL,
  event_id INT,
  FOREIGN KEY (event_id) REFERENCES events(event_id)
);

CREATE TABLE bookings (
  booking_id INT AUTO_INCREMENT PRIMARY KEY,
  booking_date VARCHAR(50),
  user_id INT,
  ticket_id INT,
  payment_id INT,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (ticket_id) REFERENCES ticket(ticket_id)
);

CREATE TABLE payment (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  pay_amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  booking_id INT,
  FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
);

CREATE TABLE reviews (
  review_id INT AUTO_INCREMENT PRIMARY KEY,
  rating INT,
  comment VARCHAR(100),
  review_date VARCHAR(50),
  event_id INT,
  user_id INT,
  FOREIGN KEY (event_id) REFERENCES events(event_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);