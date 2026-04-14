import React from 'react';
import { FiEdit2, FiTrash2, FiCalendar, FiTag } from 'react-icons/fi';

const NoteCard = ({ note, onEdit, onDelete, viewMode = 'grid' }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
              {note.title}
            </h3>
            <p className="text-gray-600 line-clamp-2 mb-3">{note.body}</p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <FiCalendar size={14} />
                {formatDate(note.createdAt)}
              </span>
              {note.tags && note.tags.length > 0 && (
                <span className="flex items-center gap-1">
                  <FiTag size={14} />
                  {note.tags[0]}
                  {note.tags.length > 1 && ` +${note.tags.length - 1}`}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2 ml-4">
            <button
              onClick={onEdit}
              className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
            >
              <FiEdit2 size={18} />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-1">
      <div className="relative h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex-1 mr-4 line-clamp-2 group-hover:text-purple-600 transition-colors">
            {note.title}
          </h3>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={onEdit}
              className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
              title="Edit note"
            >
              <FiEdit2 size={18} />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
              title="Delete note"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {note.body}
        </p>
        
        <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <FiCalendar size={14} />
            <span>{formatDate(note.createdAt)}</span>
          </div>
          {note.tags && note.tags.length > 0 && (
            <div className="flex gap-1">
              {note.tags.slice(0, 2).map(tag => (
                <span key={tag} className="text-xs px-2 py-1 bg-purple-50 text-purple-600 rounded-full">
                  #{tag}
                </span>
              ))}
              {note.tags.length > 2 && (
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                  +{note.tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteCard;