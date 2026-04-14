const Note = require('../models/Note');
const Joi = require('joi');

// Define validation schema directly in the controller
const validateNote = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(1).max(100).required(),
    body: Joi.string().min(1).max(5000).required(),
    tags: Joi.array().items(Joi.string()).optional()
  });
  
  return schema.validate(data);
};

// @desc    Get all notes for logged in user
// @route   GET /api/notes
// @access  Private
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort('-createdAt');
    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get single note
// @route   GET /api/notes/:id
// @access  Private
const getNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Note not found'
      });
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this note'
      });
    }

    res.status(200).json({
      success: true,
      data: note
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Create new note
// @route   POST /api/notes
// @access  Private
const createNote = async (req, res) => {
  try {
    console.log("Creating note for user:", req.user.id);
    console.log("Request body:", req.body);
    
    // Validate input
    const { error } = validateNote(req.body);
    if (error) {
      console.log("Validation error:", error.details[0].message);
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const { title, body, tags } = req.body;
    
    // Create note using new + save() instead of create()
    const note = new Note({
      title,
      body,
      tags: tags || [],
      user: req.user.id
    });
    
    await note.save();
    
    console.log("Note created successfully:", note._id);
    
    res.status(201).json({
      success: true,
      data: note
    });
  } catch (error) {
    console.error("CREATE NOTE ERROR:", error.message);
    console.error("Full error:", error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message || 'Server error'
    });
  }
};

// @desc    Update note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = async (req, res) => {
  try {
    const schema = Joi.object({
      title: Joi.string().min(1).max(100).optional(),
      body: Joi.string().min(1).max(5000).optional(),
      tags: Joi.array().items(Joi.string()).optional()
    });
    
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    let note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Note not found'
      });
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this note'
      });
    }

    note = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: note
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Note not found'
      });
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this note'
      });
    }

    await note.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

module.exports = {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote
};