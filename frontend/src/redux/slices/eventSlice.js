import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createEvent,
  getEventsByProfile,
  updateEvent,
} from "../../services/eventServices";

export const createNewEvent = createAsyncThunk(
  "events/create",
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await createEvent(eventData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create event"
      );
    }
  }
);

export const fetchEventsByProfile = createAsyncThunk(
  "events/fetchByProfile",
  async (profileId, { rejectWithValue }) => {
    try {
      const response = await getEventsByProfile(profileId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch events"
      );
    }
  }
);

export const updateExistingEvent = createAsyncThunk(
  "events/update",
  async ({ eventId, eventData }, { rejectWithValue }) => {
    try {
      const response = await updateEvent(eventId, eventData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update event"
      );
    }
  }
);

const eventSlice = createSlice({
  name: "events",
  initialState: {
    events: [],
    currentEvent: null,
    createLoading: false,
    updateLoading: false,
    error: null,
  },
  reducers: {
    setCurrentEvent: (state, action) => {
      state.currentEvent = action.payload;
    },
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewEvent.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createNewEvent.fulfilled, (state, action) => {
        state.createLoading = false;
      })
      .addCase(createNewEvent.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchEventsByProfile.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(fetchEventsByProfile.fulfilled, (state, action) => {
        state.createLoading = false;
        state.events = action.payload;
      })
      .addCase(fetchEventsByProfile.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      })
      .addCase(updateExistingEvent.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateExistingEvent.fulfilled, (state, action) => {
        state.updateLoading = false;
        const index = state.events.findIndex(
          (e) => e._id === action.payload._id
        );
        if (index !== -1) {
          state.events[index] = action.payload;
        }
      })
      .addCase(updateExistingEvent.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentEvent, clearCurrentEvent, clearError } =
  eventSlice.actions;
export default eventSlice.reducer;
