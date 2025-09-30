# MSAConnect

A web application to help Muslim students at UCSD connect with classmates in their courses.

## Features

- **User Registration & Authentication**
  - UCSD email validation (@ucsd.edu required)
  - Email confirmation system
  - Secure password hashing with bcrypt

- **Class Schedule Management**
  - Add/edit/remove classes with course ID and section codes
  - Automatic formatting and validation
  - Persistent storage of class information

- **Find Classmates**
  - Search for other MSA members in the same classes
  - View contact information (email, phone, major, year, gender)
  - One-click email and text messaging
  - Respectful interaction guidelines

- **User Profile**
  - Manage personal information
  - View and edit profile details
  - Class overview

## Tech Stack

- **Frontend:** React 18, React Router, Axios, Lucide React icons
- **Backend:** Node.js, Express, MongoDB with Mongoose
- **Authentication:** JWT tokens, bcrypt password hashing
- **Email:** Nodemailer for email confirmation
- **Styling:** Custom CSS with blue and gold theme

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Email service (Gmail recommended for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd msaconnect
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**
   
   Copy `server/config.example` to `server/.env` and fill in your values:
   ```env
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/msaconnect
   JWT_SECRET=your_jwt_secret_key_here
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   FRONTEND_URL=http://localhost:3000
   ```

5. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

6. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```

7. **Start the frontend development server**
   ```bash
   cd ../client
   npm start
   ```

The application will be available at `http://localhost:3000`

## Email Setup

For email confirmation to work, you need to set up an email service:

1. **Gmail Setup (Recommended for development):**
   - Enable 2-factor authentication on your Gmail account
   - Generate an App Password: Google Account → Security → App passwords
   - Use your Gmail address as `EMAIL_USER`
   - Use the generated App Password as `EMAIL_PASS`

2. **Other Email Services:**
   - Update `EMAIL_HOST` and `EMAIL_PORT` accordingly
   - Ensure SMTP credentials are correct

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/confirm-email/:token` - Confirm email
- `GET /api/auth/me` - Get current user

### Classes
- `GET /api/classes` - Get user's classes
- `PUT /api/classes` - Update user's classes
- `GET /api/classes/classmates/:courseId/:sectionCode` - Find classmates

## Project Structure

```
msaconnect/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context (auth)
│   │   ├── pages/          # Page components
│   │   ├── utils/          # API utilities
│   │   └── index.css       # Global styles
│   └── package.json
├── server/                 # Express backend
│   ├── middleware/         # Auth middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── utils/              # Utilities (email service)
│   ├── server.js           # Main server file
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is created for the UCSD Muslim Student Association. Please use responsibly and maintain the respectful community guidelines.

## Support

For technical issues or questions about the application, please contact the development team or create an issue in the repository.
