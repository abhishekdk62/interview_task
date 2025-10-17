import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllProfiles, createProfile, updateProfileTimezone } from '../../services/profileServices';

export const fetchAllProfiles = createAsyncThunk(
  'profiles/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllProfiles();
      
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profiles');
    }
  }
);

export const createNewProfile = createAsyncThunk(
  'profiles/create',
  async (name, { rejectWithValue }) => {
    try {
      const response = await createProfile(name);
      console.log(response.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create profile');
    }
  }
);

export const updateTimezone = createAsyncThunk(
  'profiles/updateTimezone',
  async ({ profileId, timezone }, { rejectWithValue }) => {
    try {
      const response = await updateProfileTimezone(profileId, timezone);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update timezone');
    }
  }
);

const profileSlice = createSlice({
  name: 'profiles',
  initialState: {
    profiles: [],
    selectedProfile: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedProfile: (state, action) => {
      state.selectedProfile = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProfiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProfiles.fulfilled, (state, action) => {
        state.loading = false;
        state.profiles = action.payload;
      })
      .addCase(fetchAllProfiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createNewProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profiles.push(action.payload);
      })
      .addCase(createNewProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTimezone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTimezone.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.profiles.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.profiles[index] = action.payload;
        }
        if (state.selectedProfile?._id === action.payload._id) {
          state.selectedProfile = action.payload;
        }
      })
      .addCase(updateTimezone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedProfile, clearError } = profileSlice.actions;
export default profileSlice.reducer;
