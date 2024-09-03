const mongoose = require('mongoose');
const Schema = mongoose.Schema;//Defines document structure in MongoDB with field types and validation.

const TaskSchema = new Schema({
  image: {
    type: String,  // Assuming image is stored as a URL or path string
  },
  name: {
    type: String,
    required: true,  // Name is required
  },
  price: {
    type: Number,
    required: true,  // Price is required
  },
  quantity: {
    type: Number,
    default: 1,  // Default quantity to 1 if not provided
    min: 1,  // Ensure quantity is at least 1
  },
},

{ timestamps: true });  // Automatically add createdAt and updatedAt fields

module.exports = mongoose.model('Task', TaskSchema);//Exports the `Task` model based on `TaskSchema` for use in other files.
