import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createNote, updateNote } from '../redux/slices/noteSlice';
import { closeModal, showAlert } from '../redux/slices/uiSlice';

const NoteForm = ({ note, onCancel }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.notes);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setBody(note.body);
    }
  }, [note]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!body.trim()) {
      setError('Note content is required');
      return;
    }
    
    setError('');
    
    let result;
    if (note) {
      result = await dispatch(updateNote({ id: note._id, noteData: { title, body } }));
    } else {
      result = await dispatch(createNote({ title, body }));
    }
    
    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(showAlert({
        type: 'success',
        message: note ? 'Note updated!' : 'Note created!'
      }));
      dispatch(closeModal());
      onCancel();
      setTimeout(() => dispatch(showAlert({ type: '', message: '' })), 3000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {note ? 'Edit Note' : 'Create New Note'}
          </h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Note Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div className="mb-6">
              <textarea
                placeholder="Write your note here..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows="8"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : (note ? 'Update' : 'Create')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NoteForm;