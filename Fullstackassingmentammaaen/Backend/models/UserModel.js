const mongoose = require('mongoose');// Imports Mongoose to interact with MongoDB
const bcrypt = require('bcrypt');//Imports Bcrypt for hashing passwords securely.

// Define User schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Password hashing before saving the user model
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Password comparison method  Compares a candidate password with the stored hashed password to verify credentials.
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);// Creates a Mongoose model named `User` using `userSchema` for database operations.

module.exports = User;// Exports the User model so it can be used in other files.
