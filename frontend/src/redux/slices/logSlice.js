import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getEventLogs } from '../../services/eventServices';

export const fetchEventLogs = createAsyncThunk(
  'logs/fetchByEvent',
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await getEventLogs(eventId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch logs');
    }
  }
);

const logSlice = createSlice({
  name: 'logs',
  initialState: {
    logs: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearLogs: (state) => {
      state.logs = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload;
      })
      .addCase(fetchEventLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearLogs, clearError } = logSlice.actions;
export default logSlice.reducer;
