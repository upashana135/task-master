# Task-Master - Team Task Management Platform

A comprehensive task tracking platform built with Next.js, React, and Tailwind CSS.

## Features

### Authentication & User Management
- ✅ User registration and login
- ✅ Secure logout functionality
- ✅ Profile management with editable information

### Task Management
- ✅ Create tasks with title, description, and due date
- ✅ View all assigned tasks with filtering and search
- ✅ Mark tasks as completed/open
- ✅ Assign tasks to team members
- ✅ Filter tasks by status (all, open, completed)
- ✅ Search tasks by title or description
- ✅ Delete tasks with confirmation
- ✅ Overdue task indicators

### Collaboration Features
- ✅ Add comments to tasks
- ✅ Team creation and management
- ✅ Project creation and management
- ✅ Invite team members via email

### User Interface
- ✅ Responsive design for all screen sizes
- ✅ Professional, clean interface
- ✅ Task statistics dashboard
- ✅ Loading states and error handling
- ✅ Confirmation dialogs for destructive actions

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm

### Installation

1. Clone the repository:
git clone <repository-url>
cd task-tracker-platform

2. Install dependencies:
npm install

3. Run the development server:
npm run dev

4. Open [http://localhost:3001](http://localhost:3001) in your browser.

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Frontend**: React 18, JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (useState, useEffect)
- **Icons**: Emoji and Unicode symbols

## Features in Detail

### Task Management
- Create tasks with detailed information (title, description, due date, project, team)
- Assign tasks to team members
- Add comments for collaboration
- Track task status and completion
- Search and filter capabilities

### Team Collaboration
- Create teams
- Invite members via email
- View team member
- Track pending invitations

### Team Collaboration
- Create projects
- Assign one or more teams to projects

### User Experience
- Responsive design for mobile and desktop
- Loading states for better UX
- Error handling and validation
- Confirmation dialogs for destructive actions

## Data Storage

- **Database**: PostgreSQL
- **Authentication**: custom JWT

### For server side implementation please check git repo: https://github.com/upashana135/task-master-backend
