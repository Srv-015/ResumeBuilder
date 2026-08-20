CVÉRÉ — Full-Stack Resume Builder

A modern full-stack resume builder for creating, editing, saving, customizing, previewing, and sharing professional resumes.

CVÉRÉ is built with a separate Next.js frontend and Express.js backend, with MongoDB Atlas as the production database. The application includes authentication, resume management, auto-save, multiple templates, A4-oriented pagination, and public shareable resume links.

🌐 Live Application

Frontend: https://resume-builder-srv-coral.vercel.app/

Backend API: https://resumebuilder-api-back3nd.onrender.com/

GitHub: https://github.com/Srv-015/ResumeBuilder

📌 Table of Contents

Project Overview

Features

Tech Stack

Architecture

Project Structure

How It Works

Authentication

Resume Management

Auto Save

Templates

A4 Layout and Pagination

Resume Sharing

API Overview

Prerequisites

Installation

Environment Variables

MongoDB Atlas

Running Locally

Production Build

Deployment

CORS

Security

Troubleshooting

Development Workflow

Future Improvements

Contributing

License

Author

🚀 Project Overview

CVÉRÉ is a web-based resume builder designed to make professional resume creation simple while giving users control over the final document.

Users can:

Create an account.

Log in securely.

Create a resume.

Add personal information, education, experience, projects, skills, and additional information.

Select a resume template.

Preview the resume using an A4-oriented layout.

Save the resume manually or through auto-save.

Edit existing resumes.

Rename or duplicate resumes.

Generate a public shareable resume link.

View shared resumes without opening the private dashboard.

The project is divided into two applications:

Frontend
Next.js + React + TypeScript + Tailwind CSS

Backend
Node.js + Express.js + MongoDB/Mongoose

✨ Features

🔐 Authentication

User registration

User login

JWT-based authentication

Password hashing with bcryptjs

Protected resume operations

User-specific resume data

📝 Resume Builder

Create resumes

Edit resumes

Save resume drafts

Load existing resumes

Update resume information

Delete resumes

Rename resumes

Duplicate resumes

Select different templates

⚡ Auto Save

The resume editor supports automatic saving after changes.

The editor uses a delayed save mechanism so frequent typing does not create a request for every keystroke. This reduces unnecessary API traffic while keeping the user's work saved.

🎨 Resume Templates

Classic

A clean and traditional resume layout focused on readability, typography, spacing, and professional presentation.

Executive

A structured design with stronger visual hierarchy, suitable for experienced professionals and leadership-oriented resumes.

Editorial

A more expressive design inspired by editorial layouts, intended for creative and visually focused resumes.

📄 A4 Resume Layout

The editor is designed around an A4 document format and considers:

A4 page dimensions

Page margins

Content boundaries

Multi-page resumes

Section positioning

Page breaks

Resume preview

Print/PDF-friendly output

The pagination system is designed to reduce awkward section splitting across page boundaries.

🔗 Shareable Resumes

Users can generate a public shareable link for a resume.

Example:

/share/{shareToken}

The shared resume can be viewed without opening the user's private dashboard.

📱 Responsive Interface

The frontend is designed for:

Desktop

Laptop

Tablet

Mobile-sized screens

🗂️ Dashboard

The dashboard provides a central place to manage resumes:

View resumes

Create resumes

Open resumes

Rename resumes

Duplicate resumes

Delete resumes

Share resumes

🛠️ Tech Stack

Frontend

Technology

Purpose

Next.js 16

React framework

React

UI

TypeScript

Type-safe development

Tailwind CSS

Styling

Next.js App Router

Routing

Fetch API

Backend communication

Backend

Technology

Purpose

Node.js

Runtime

Express.js

REST API

Mongoose

MongoDB object modeling

MongoDB

Database

JWT

Authentication

bcryptjs

Password hashing

CORS

Cross-origin requests

dotenv

Environment configuration

Infrastructure

Service

Responsibility

GitHub

Source control

Vercel

Frontend hosting

Render

Backend hosting

MongoDB Atlas

Production database

🏗️ Architecture

                         ┌─────────────────────┐
                         │       GitHub        │
                         │   ResumeBuilder     │
                         └──────────┬──────────┘
                                    │
                       ┌────────────┴────────────┐
                       │                         │
                       ▼                         ▼
              ┌─────────────────┐       ┌─────────────────┐
              │     Vercel      │       │     Render      │
              │    Next.js      │       │   Express.js    │
              │    Frontend     │──────▶│     Backend     │
              └─────────────────┘  API  └────────┬────────┘
                                                  │
                                                  ▼
                                         ┌─────────────────┐
                                         │  MongoDB Atlas  │
                                         │    Database     │
                                         └─────────────────┘

📁 Project Structure

ResumeBuilder/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── resumeRoutes.js
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── dashboard/
│   │       ├── login/
│   │       ├── register/
│   │       ├── resume/
│   │       ├── settings/
│   │       ├── share/
│   │       │   └── [shareToken]/
│   │       ├── templates/
│   │       ├── layout.tsx
│   │       └── page.tsx
│   ├── public/
│   ├── package.json
│   ├── next.config.js
│   ├── tsconfig.json
│   └── .env.local
│
├── .gitignore
└── README.md

The exact controller/model files may differ as the project evolves. The structure above describes the main application organization.

🔄 How It Works

Registration

User
 │
 ▼
Registration Form
 │
 ▼
Next.js Frontend
 │
 │ POST /api/auth/register
 ▼
Express Backend
 │
 ▼
Validate User
 │
 ▼
Hash Password
 │
 ▼
MongoDB Atlas
 │
 ▼
Create User

Login

User
 │
 ▼
Login Form
 │
 ▼
POST /api/auth/login
 │
 ▼
Express API
 │
 ▼
Find User
 │
 ▼
Compare Password
 │
 ▼
Generate JWT
 │
 ▼
Authenticated Frontend

Resume Creation

User
 │
 ▼
Dashboard
 │
 ▼
Create Resume
 │
 ▼
Resume Editor
 │
 ▼
Enter Information
 │
 ▼
Save / Auto Save
 │
 ▼
Express API
 │
 ▼
MongoDB

🔐 Authentication

The backend uses:

bcryptjs for password hashing

JSON Web Tokens for authentication

Protected API routes

MongoDB for user storage

Passwords are intended to be stored as hashes rather than plain text.

Simplified flow:

Register
   │
   ├── Validate input
   ├── Hash password
   └── Store user
          │
          ▼
Login
   │
   ├── Find user
   ├── Compare password
   └── Generate JWT

💾 Resume Data

A resume can contain:

Personal Information
├── Full Name
├── Email
├── Phone
├── Location
└── Website

Summary

Education
├── Degree
├── Institution
├── Location
├── Start Year
└── End Year

Experience
├── Position
├── Company
├── Location
├── Start Year
├── End Year
└── Description

Projects
├── Project Name
├── Technologies
├── Project Link
├── Start Year
├── End Year
└── Description

Skills

Additional Information

⚡ Auto Save

The auto-save system follows this general flow:

User changes resume
        │
        ▼
Resume state changes
        │
        ▼
Start save delay
        │
        ├── User continues editing
        │       │
        │       └── Reset delay
        │
        ▼
Save request
        │
        ▼
Backend API
        │
        ▼
MongoDB

The editor tracks saving state so overlapping saves can be avoided.

🎨 Templates

The template system separates resume data from its visual presentation.

                    Resume Data
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
       Classic       Executive     Editorial
          │             │             │
          └─────────────┼─────────────┘
                        ▼
                  Resume Preview

Changing a template does not require entering the resume data again.

📐 A4 Layout and Pagination

The editor uses an A4-oriented layout.

The pagination system considers:

Page dimensions

Top and bottom margins

Content height

Section boundaries

Available page space

Multi-page content

Conceptually:

┌─────────────────────────────┐
│        Top Margin           │
│                             │
│  Personal Information       │
│  Summary                    │
│  Experience                 │
│  Experience                 │
│                             │
│─────────────────────────────│
│       Bottom Margin         │
└─────────────────────────────┘

┌─────────────────────────────┐
│        Top Margin           │
│                             │
│  Projects                   │
│  Education                  │
│  Skills                     │
│                             │
│─────────────────────────────│
│       Bottom Margin         │
└─────────────────────────────┘

🔗 Resume Sharing

A user can generate a shareable link for a resume.

The backend associates a unique share token with the resume.

Example:

https://your-domain.com/share/SHARE_TOKEN

The frontend handles the dynamic route:

src/app/share/[shareToken]/page.tsx

The public page loads and renders the corresponding resume.

🔌 API Overview

Authentication

Register

POST /api/auth/register

Example:

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password"
}

Login

POST /api/auth/login

Example:

{
  "email": "john@example.com",
  "password": "password"
}

Resumes

GET    /api/resumes
POST   /api/resumes
GET    /api/resumes/:id
PUT    /api/resumes/:id
DELETE /api/resumes/:id

Share

POST /api/resumes/:id/share

Exact request and response fields depend on the current backend implementation.

📋 Prerequisites

Install:

Node.js 18+

npm

Git

MongoDB Atlas account

VS Code or another code editor

Check installations:

node -v
npm -v
git --version

📥 Installation

1. Clone the repository

git clone https://github.com/Srv-015/ResumeBuilder.git

cd ResumeBuilder

The repository contains separate frontend and backend applications.

⚙️ Backend Setup

Go to the backend:

cd backend

Install dependencies:

npm install

Create:

.env

Add:

PORT=5050
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000

Start development mode:

npm run dev

Or:

npm start

The local API runs at:

http://localhost:5050

Health check:

http://localhost:5050/

Expected:

{
  "message": "Resume Builder API is running"
}

🖥️ Frontend Setup

Open another terminal:

cd frontend

Install dependencies:

npm install

Create:

.env.local

Add:

NEXT_PUBLIC_API_URL=http://localhost:5050

Start Next.js:

npm run dev

Open:

http://localhost:3000

🔑 Environment Variables

Frontend — Local

NEXT_PUBLIC_API_URL=http://localhost:5050

Frontend — Production

NEXT_PUBLIC_API_URL=https://resumebuilder-api-back3nd.onrender.com

Backend — Local

PORT=5050
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000

Backend — Production

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=https://resume-builder-srv-coral.vercel.app

Security rule

Never commit:

.env
.env.local

or any secret values to GitHub.

🗄️ MongoDB Atlas

The production application uses MongoDB Atlas.

Setup

Create a MongoDB Atlas account.

Create a cluster.

Create a database user.

Configure network access.

Copy the MongoDB connection string.

Add it to the backend environment as MONGODB_URI.

Conceptual connection string:

mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE

Never publish your actual credentials.

▶️ Running Locally

Two terminals are recommended.

Terminal 1 — Backend

cd backend
npm run dev

Expected:

MongoDB connected successfully
Server running on port 5050

Terminal 2 — Frontend

cd frontend
npm run dev

Open:

http://localhost:3000

🧪 Production Build

Before deploying:

cd frontend
npm run build

A successful build should complete TypeScript checking, page generation, and optimization.

Expected routes include:

○ /
○ /dashboard
○ /login
○ /register
○ /resume
○ /settings
○ /templates
ƒ /share/[shareToken]

You can also run:

npm start

after a successful build.

☁️ Deployment

Frontend — Vercel

Production frontend:

https://resume-builder-srv-coral.vercel.app/

Vercel configuration:

Framework Preset: Next.js
Root Directory: frontend
Build Command: npm run build
Output Directory: Next.js default

Production environment variable:

NEXT_PUBLIC_API_URL=https://resumebuilder-api-back3nd.onrender.com

After changing a NEXT_PUBLIC_* variable, redeploy Vercel so the new value is included in the browser bundle.

Backend — Render

Production API:

https://resumebuilder-api-back3nd.onrender.com/

Render configuration:

Runtime: Node
Root Directory: backend
Build Command: npm install
Start Command: npm start

Backend production variables:

MONGODB_URI
JWT_SECRET
FRONTEND_URL

Render provides the production PORT.

🌍 CORS

The backend is configured to allow the local and production frontend origins.

Example:

const allowedOrigins = [
  'http://localhost:3000',
  'https://resume-builder-srv-coral.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

Production frontend:

https://resume-builder-srv-coral.vercel.app

Production backend:

https://resumebuilder-api-back3nd.onrender.com

If the Vercel production domain changes, update FRONTEND_URL on Render and the allowed production origin in the backend.

🔒 Security

The project uses:

bcryptjs password hashing

JWT authentication

Environment variables

CORS restrictions

MongoDB authentication

Protected API operations

Never commit:

MONGODB_URI
JWT_SECRET
.env
.env.local

to the repository.

🐛 Troubleshooting

Frontend cannot connect to backend

Verify:

NEXT_PUBLIC_API_URL=https://resumebuilder-api-back3nd.onrender.com

Then redeploy Vercel.

Do not add /api to the environment variable if the frontend already appends /api/....

Correct:

https://resumebuilder-api-back3nd.onrender.com

Incorrect:

https://resumebuilder-api-back3nd.onrender.com/api

CORS Error

Check Render:

FRONTEND_URL=https://resume-builder-srv-coral.vercel.app

Make sure it exactly matches the Vercel production domain.

Render 502

Check Render logs for:

MongoDB connected successfully
Server running on port 10000

If MongoDB connection fails, verify:

MONGODB_URI

Atlas network access

Database username/password

Database permissions

Vercel 404

Verify:

Root Directory = frontend
Framework = Next.js

Also verify the deployment is using the expected production domain.

Local development uses localhost

This is expected when:

NEXT_PUBLIC_API_URL=http://localhost:5050

is present in frontend/.env.local.

Production Vercel uses its own environment variable.

🔄 Development Workflow

Recommended workflow:

1. Create a feature
       ↓
2. Develop locally
       ↓
3. Run frontend
       ↓
4. Run backend
       ↓
5. Test MongoDB operations
       ↓
6. Run npm run build
       ↓
7. Check git status
       ↓
8. Commit
       ↓
9. Push to GitHub
       ↓
10. Vercel / Render deploy
       ↓
11. Test production

Useful commands:

git status

git add .

git commit -m "Describe your change"

git push origin main

📦 Package Scripts

Frontend

npm run dev

Start the Next.js development server.

npm run build

Create the production build.

npm start

Start the production Next.js server after building.

Backend

npm run dev

Start the backend using nodemon.

npm start

Start the backend using Node.js.

📊 Production Status

Component

Service

Status

Frontend

Vercel

Live

Backend

Render

Live

Database

MongoDB Atlas

Production

Source Code

GitHub

Active

🚧 Future Improvements

Potential future features:

Forgot password

Password reset through email

Google authentication

More resume templates

Profile photo support

Advanced PDF export

Resume analytics

Drag-and-drop section ordering

More typography controls

Custom color themes

Custom fonts

Resume import

Resume version history

Improved mobile editing

AI-assisted resume writing

Custom share URLs

Advanced privacy controls

🤝 Contributing

Contributions and suggestions are welcome.

Fork

Fork the repository on GitHub.

Clone

git clone https://github.com/YOUR_USERNAME/ResumeBuilder.git

Create a branch

git checkout -b feature/my-feature

Make changes

Test the application locally.

Commit

git add .
git commit -m "Add my feature"

Push

git push origin feature/my-feature

Then open a Pull Request.

📄 License

This project is currently intended for personal, educational, and portfolio purposes.

If you plan to distribute or use the project commercially, add an appropriate open-source or commercial license.

👨‍💻 Author

Sourav

Computer Engineering / Computer Applications student and full-stack development enthusiast.

GitHub

https://github.com/Srv-015

⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.

📸 Project Highlights

This project demonstrates practical experience with:

Full-stack web application development

Next.js App Router

React

TypeScript

Tailwind CSS

REST API development

Express.js

Node.js

MongoDB

Mongoose

JWT authentication

Password hashing

CORS configuration

Environment variables

Git and GitHub

Vercel deployment

Render deployment

MongoDB Atlas

Responsive UI development

A4 document layout

Multi-page document pagination

Public shareable content

Auto-save systems

Production debugging and deployment

🏁 Production Architecture

                    ┌─────────────────────────┐
                    │         GitHub          │
                    │   Srv-015/ResumeBuilder │
                    └────────────┬────────────┘
                                 │
                  ┌──────────────┴──────────────┐
                  │                             │
                  ▼                             ▼
       ┌────────────────────┐        ┌────────────────────┐
       │       Vercel       │        │       Render       │
       │                    │        │                    │
       │     Next.js        │        │     Express.js     │
       │    TypeScript      │───────▶│     Node.js        │
       │   Tailwind CSS     │  REST  │                    │
       │                    │   API  │                    │
       └────────────────────┘        └──────────┬─────────┘
                                                 │
                                                 │ Mongoose
                                                 ▼
                                      ┌────────────────────┐
                                      │    MongoDB Atlas   │
                                      │                    │
                                      │ Users + Resumes    │
                                      └────────────────────┘

Built with Next.js, Express.js, MongoDB, TypeScript, and Tailwind CSS.

⭐ If you like the project, consider starring the repository.
