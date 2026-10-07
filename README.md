# Instagram-Style Blog App

A full-stack social blogging application inspired by Instagram, where users can create accounts, share posts, interact with other users, and manage their profiles.

The application provides a modern social-media experience with features such as posts, likes, comments, user profiles, and authentication.

## Features

### Authentication

* User registration and login
* Secure authentication
* Logout functionality
* Protected routes
* Access token / session handling

### Posts

* Create posts
* Upload post images
* View posts in a social-media style feed
* Edit posts
* Delete posts
* View individual posts

### Social Features

* Like and unlike posts
* Add comments
* View comments
* User profiles
* Follow/unfollow users
* Followers and following system

### User Profile

* Profile information
* Profile picture
* User's posts
* Followers count
* Following count
* Edit profile

### UI

* Instagram-inspired interface
* Responsive design
* Mobile-friendly layout
* Modern and clean components
* Reusable React components

## Tech Stack

### Frontend

* React.js
* Vite
* JavaScript
* HTML5
* CSS3
* Axios
* React Router

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### Authentication & Security

* JWT Authentication
* Protected API routes
* Password hashing
* Secure API communication

## Project Structure

```text
src/
├── components/
├── pages/
├── layouts/
├── services/
├── context/
├── hooks/
├── assets/
├── utils/
├── App.jsx
└── main.jsx
```

## Installation

Clone the repository:

```bash
git clone <your-repository-url>
```

Go to the project directory:

```bash
cd <project-folder>
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application will run locally using the Vite development server.

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=your_backend_api_url
```

For the backend, configure the required environment variables such as:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## Main Functionalities

```text
User
 │
 ├── Register / Login
 │
 ├── Create Profile
 │
 ├── Create Post
 │      ├── Image
 │      ├── Caption
 │      └── Comments
 │
 ├── Like Post
 │
 ├── Comment on Post
 │
 ├── Follow Users
 │
 └── View Feed
```

## Future Improvements

* Stories
* Direct messaging
* Notifications
* Search users and posts
* Hashtags
* Explore page
* Image optimization
* Cloud image storage
* Real-time notifications
* Dark mode

## Author

**Zifra Firdous**

Full Stack / MERN Stack Developer

Built with React, Node.js, Express.js and MongoDB.
