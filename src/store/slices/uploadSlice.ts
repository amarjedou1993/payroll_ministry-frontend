import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UploadState {
  isUploading: boolean;
  progress: number;
  files: Array<{
    id: string;
    progress: number;
    error?: string;
    paused?: boolean;
  }>;
  showProgress: boolean;
  allUploadsComplete: boolean;
}

const initialState: UploadState = {
  isUploading: false,
  progress: 0,
  files: [],
  showProgress: false,
  allUploadsComplete: false,
};

const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    startUpload: (state, action: PayloadAction<Array<{ id: string }>>) => {
      state.isUploading = true;
      state.showProgress = true;
      state.allUploadsComplete = false;
      state.files = action.payload.map((file) => ({
        id: file.id,
        progress: 0,
        error: undefined,
        paused: false,
      }));
    },
    updateProgress: (
      state,
      action: PayloadAction<{ id: string; progress: number }>
    ) => {
      const file = state.files.find((f) => f.id === action.payload.id);
      if (file) {
        file.progress = action.payload.progress;
      }
      state.progress = Math.round(
        state.files.reduce((acc, file) => acc + file.progress, 0) /
          state.files.length
      );
    },
    setUploadError: (
      state,
      action: PayloadAction<{ id: string; error: string }>
    ) => {
      const file = state.files.find((f) => f.id === action.payload.id);
      if (file) {
        file.error = action.payload.error;
      }
    },
    pauseUpload: (state, action: PayloadAction<string>) => {
      const file = state.files.find((f) => f.id === action.payload);
      if (file) {
        file.paused = true;
      }
    },
    resumeUpload: (state, action: PayloadAction<string>) => {
      const file = state.files.find((f) => f.id === action.payload);
      if (file) {
        file.paused = false;
      }
    },
    completeUpload: (state) => {
      state.isUploading = false;
      state.allUploadsComplete = state.files.every(
        (file) => file.progress === 100 || file.error
      );
    },
    resetUpload: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  startUpload,
  updateProgress,
  setUploadError,
  pauseUpload,
  resumeUpload,
  completeUpload,
  resetUpload,
} = uploadSlice.actions;

export default uploadSlice.reducer;
