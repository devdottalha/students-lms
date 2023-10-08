// userSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { logout, signInWithEmailPassword } from './firebaseHelper';

export const signin = createAsyncThunk('user/signin', async ({ email, password, callback }) => {
  try {
    const user = await signInWithEmailPassword(email, password);
    if (!user) {
      return null;
    }

    if (callback) {
      callback();
    }
    return user;
  } catch (error) {
    alert('invalid creds');
    console.log(error);
    return null;
  }
});

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logout();
});

// Slice
const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    loading: false,
    error: null,
    isLoggedIn: false,
  },
  reducers: {
    setUserDetails: (state, action) => {
      state.user = action.payload.user;
      state.loading = false;
      state.error = null;
      state.isLoggedIn = action.payload.isLoggedIn;
    },
    setLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
  },
  // Any other synchronous reducers can be added here if needed
  extraReducers: (builder) => {
    builder
      .addCase(signin.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear any previous error
        state.isLoggedIn = false;
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(signin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.isLoggedIn = false;
      });
  },
});

export const { setUserDetails, setLoggedIn } = userSlice.actions;

// Reducer
export default userSlice.reducer;
