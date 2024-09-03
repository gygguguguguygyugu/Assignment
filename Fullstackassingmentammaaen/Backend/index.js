const express = require('express');//Imports the Express framework to build the server and handle routing.
const mongoose = require('mongoose');//Imports Mongoose to interact with MongoDB databases.
const cors = require('cors');//Imports the CORS middleware to enable cross-origin requests.
require('dotenv').config();//Loads environment variables from a .env file into process.env for configuration.

const taskRoutes = require('./routes/taskRoute');
const authRoutes = require('./routes/authRoute'); // Ensure this file exists and is correct

const app = express();

// Enable CORS
app.use(cors());

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware to log all incoming requests
app.use((req, res, next) => {
  console.log(`Received ${req.method} request on ${req.url}`);
  next();
});

// Task routes
app.use('/api/tasks', taskRoutes);

// Auth routes
app.use('/api/auth', authRoutes); // Register auth routes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'An internal server error occurred.' });
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,//Ensures Mongoose uses the new MongoDB connection string parser.
  useUnifiedTopology: true,//Enables the new MongoDB driver’s topology engine for improved connection management
})
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`DB connected and server listening on port ${process.env.PORT}`);
    });
  })
  .catch((error) => console.log(`DB connection error: ${error.message}`));





  /* JWTs are commonly used for authentication and secure data exchange in web applications.*/