const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  body: {
    type: String,
    required: [true, 'Please add content'],
    maxlength: [5000, 'Content cannot be more than 5000 characters']
  },
  tags: {
    type: [String],
    default: []
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true 
});


module.exports = mongoose.model('Note', NoteSchema);