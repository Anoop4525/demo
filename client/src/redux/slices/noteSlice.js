import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

// Async thunks
export const fetchNotes = createAsyncThunk(
  'notes/fetchNotes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/notes');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createNote = createAsyncThunk(
  'notes/createNote',
  async (noteData, { rejectWithValue }) => {
    try {
      const response = await api.post('/notes', noteData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateNote = createAsyncThunk(
  'notes/updateNote',
  async ({ id, noteData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/notes/${id}`, noteData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteNote = createAsyncThunk(
  'notes/deleteNote',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/notes/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  notes: [],
  currentNote: null,
  loading: false,
  error: null,
  totalCount: 0
};

const noteSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    setCurrentNote: (state, action) => {
      state.currentNote = action.payload;
    },
    clearCurrentNote: (state) => {
      state.currentNote = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Notes
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload.data;
        state.totalCount = action.payload.count;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch notes';
      })
      // Create Note
      .addCase(createNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = [action.payload.data, ...state.notes];
        state.totalCount += 1;
      })
      .addCase(createNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to create note';
      })
      // Update Note
      .addCase(updateNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = state.notes.map(note =>
          note._id === action.payload.data._id ? action.payload.data : note
        );
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to update note';
      })
      // Delete Note
      .addCase(deleteNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = state.notes.filter(note => note._id !== action.payload);
        state.totalCount -= 1;
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to delete note';
      });
  }
});

export const { setCurrentNote, clearCurrentNote, clearError } = noteSlice.actions;
export default noteSlice.reducer;