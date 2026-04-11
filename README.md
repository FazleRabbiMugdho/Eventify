# Eventify
A Scalable REST-Driven Event Marketplace
## Team Members
| Name | Student ID | Role | Email |
|------|------------|------|-------|
| Fazle Rabbi Mugdho | 20230104002 | Project Lead | fazle.rabbi.mugdho@gmail.com |
| Auniruddho Halder | 20230104006 | Frontend Developer | auniruddhohalder284@gmail.com |
| Mahim Abdullah Rianto | 20230104015 | Frontend Developer | mahim.cse.20230104015@aust.edu |
| Partha Saha | 20230104017 | Backend Developer | parthapartha509@gmail.com |


## Objective

The primary goal is to build a high-concurrency, full-stack web application that serves as a real-time event marketplace. It focuses on decoupling the backend (Laravel REST API) from the frontend (React UI) to ensure high performance, scalability, and a seamless user experience. Key technical objectives include implementing dynamic event discovery with pagination, a secure transaction engine for ticket booking, and background processing for automated notifications

## Target Audience

 - Technical Recruiters
 - Event Organizers
 - End Users


## Tech Stack
 - **Frontend:** React Client-Side UI
 - **Backend:** Laravel REST API Server
 - **Rendering method:** Client-Side Rendering (modern approach used by standard React applications)



## Key Features
**1. Exclusive & Advanced Features**

- AI-Powered Event Recommendations
- Automated E-Ticket Generator
- Real-Time Analytics for Organizers
- Background Notification System

**2. User Authentication & Security**
- JWT-Based Authentication
- Role-Based Access Control (RBAC)
- Secure API Middleware
  
**3. Core CRUD Operations**
- Events Management
- Booking System
- Category Management

## API Endpoints
| Method | Endpoint |	Description |
|--------|----------|-------------|
| GET | /api/events | Fetch all events (supports query params for search/filter and pagination) |
| POST | /api/register | User registration for new customers/organizers |
| POST |	/api/login | Secure login to receive a JWT Bearer Token |
| POST |	/api/bookings | (Protected) The "Transaction Engine" endpoint to process a ticket purchase |
| GET |	/api/user/profile |	(Protected) Fetch the authenticated user's details and booking history |
| PUT |	/api/organizer/events/{id} | (Protected) Allow organizers to update their specific event data |
| DELETE |	/api/admin/users/{id} | (Protected) Admin capability to ban or remove users |

## Project Milestones
**Phase 1: Foundation & Authentication**

 - Laravel + React Integration
 - Log In, Register Page Addition 
 - Event Management System (CRUD)
 - CI/CD Pipeline Setup
 - User Profiles & Role Logic

**Phase 2: Core Logic & Transactions**

- Authentication System & User Management
- Database Design & Migrations
- Event System Foundation
- Payment Method Integration
- Responsive Design (Mobile & Tablet)
- UI Enhancements (Login/Register, Light-Dark Mode) & Skeleton Loading
- AI Chatbot Integration
- Docker & Infrastructure Setup

**Phase 3: Advanced Features & Optimization**

- QR Code Generation
- Admin Command Center
- Automated E-Ticket Generation
