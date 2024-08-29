const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false // Description is optional
  },
  column: {
    type: String,
    required: true
  }
}, {
  timestamps: { createdAt: true, updatedAt: false } // Automatically handles `createdAt`
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
