import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isModalOpen: false,
  modalType: null, // 'create', 'edit'
  isLoading: false,
  alert: {
    show: false,
    type: 'success', // 'success', 'error', 'info', 'warning'
    message: ''
  }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.isModalOpen = true;
      state.modalType = action.payload;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.modalType = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    showAlert: (state, action) => {
      state.alert = {
        show: true,
        type: action.payload.type,
        message: action.payload.message
      };
    },
    hideAlert: (state) => {
      state.alert.show = false;
      state.alert.message = '';
    },
    clearAlert: (state) => {
      state.alert = initialState.alert;
    }
  }
});

export const {
  openModal,
  closeModal,
  setLoading,
  showAlert,
  hideAlert,
  clearAlert
} = uiSlice.actions;

export default uiSlice.reducer;