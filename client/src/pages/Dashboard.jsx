import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotes, deleteNote, setCurrentNote } from '../redux/slices/noteSlice';
import { openModal, closeModal, showAlert } from '../redux/slices/uiSlice';
import Navbar from '../components/Navbar';
import NoteCard from "../components/NoteCard";
import NoteForm from "../components/NoteForm";


const Dashboard = () => {
  const dispatch = useDispatch();
  const { notes, loading } = useSelector((state) => state.notes);
  const { isModalOpen, modalType } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    dispatch(fetchNotes());
  }, [dispatch]);

  const handleCreateNote = () => {
    setEditingNote(null);
    dispatch(openModal('create'));
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    dispatch(setCurrentNote(note));
    dispatch(openModal('edit'));
  };

  const handleDeleteNote = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      const result = await dispatch(deleteNote(id));
      if (result.meta.requestStatus === 'fulfilled') {
        dispatch(showAlert({ type: 'success', message: 'Note deleted!' }));
        setTimeout(() => dispatch(showAlert({ type: '', message: '' })), 3000);
      }
    }
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
    setEditingNote(null);
  };

  if (loading && notes.length === 0) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="bg-white rounded-lg shadow-lg py-6 px-2 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <div className="lg:text-3xl  font-bold text-gray-800">My Notes</div>
              <p className="text-gray-600 mt-1">Welcome back, {user?.name}!</p>
            </div>
            <button
              onClick={handleCreateNote}
              className="bg-gradient-to-r from-purple-500 to-pink-500 whitespace-nowrap text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
            >
              + New Note
            </button>
          </div>
        </div>

        {notes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-600 text-lg">No notes yet. Create your first note!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onEdit={() => handleEditNote(note)}
                onDelete={() => handleDeleteNote(note._id)}
              />
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <NoteForm note={editingNote} onCancel={handleCloseModal} />
      )}
    </>
  );
};

export default Dashboard;