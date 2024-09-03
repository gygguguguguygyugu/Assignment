const mongoose = require('mongoose');
const Task = require('../models/TaskModel'); // Import Task model

// Create a Task - POST  adds a new task to the database and sends a response.
const createTask = async (req, res) => {
  try {
    const { name, price, image, quantity } = req.body;

    const newTask = new Task({ name, price, image, quantity });
    await newTask.save();

    res.status(201).json({ message: 'Task created successfully', data: newTask });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get All Tasks - GET
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.status(200).json({ message: 'Tasks fetched successfully', data: tasks });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a Single Task - GET
const getSingleTask = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Invalid Task ID' });
  }

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: 'Task Not Found' });
    }
    res.status(200).json({ message: 'Task fetched successfully', data: task });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a Task - PATCH
const updateTask = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Invalid Task ID' });
  }

  try {
    const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ error: 'Task Not Found' });
    }
    res.status(200).json({ message: 'Task updated successfully', data: updatedTask });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a Task - DELETE
const deleteTask = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Invalid Task ID' });
  }

  try {
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ error: 'Task Not Found' });
    }
    res.status(200).json({ message: 'Task deleted successfully', data: deletedTask });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  getSingleTask,
  updateTask,
  deleteTask,
};
