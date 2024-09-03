const express = require('express'); //Imports the Express library to build  applications.
const router = express.Router();//Creates a new router instance to handle routes.
const authController = require('../controllers/authController');//Imports the authentication controller for route handling.

// Registration route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);

router.get('/view', authController.view); // Defines a route to view user information via GET requests.

module.exports = router;// Exports the router to be used in other parts of the application.








