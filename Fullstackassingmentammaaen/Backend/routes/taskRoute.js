const express = require('express');//loads Express library to build web servers.
const router = express.Router();
const {
  createTask,
  getTasks,
  getSingleTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');//Loads task controller functions for managing tasks in an application.

// Route to get all tasks
router.get('/', getTasks);

// Route to get a single task by ID
router.get('/:id', getSingleTask);

// Route to create a new task
router.post('/', createTask);

// Route to update a task by ID
router.patch('/:id', updateTask);

// Route to delete a task by ID
router.delete('/:id', deleteTask);

module.exports = router;
