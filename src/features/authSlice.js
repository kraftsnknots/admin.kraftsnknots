import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { doc, getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../config/firebase";

const initialState = {
  user: null,
  isLoggedIn: false,
  loading: false,
  error: null,
};

/* ============================================================
   🔥 MAIN ADMIN LOGIN — FIXED
   This ensures Firebase Auth logs in so Storage rules can work.
============================================================ */
export const adminLogin = createAsyncThunk(
  "auth/adminLogin",
  async ({ email, password }, { rejectWithValue, dispatch }) => {
    try {
      dispatch(loginStart());

      // ✅ Step 1: Login with Firebase Auth
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;

      // ✅ Step 2: Load Firestore user profile
      const snap = await getDoc(doc(db, "users", uid));
      const profile = snap.exists() ? snap.data() : {};

      const mergedUser = {
        uid,
        email: cred.user.email,
        photoURL: cred.user.photoURL || null,
        ...profile, // contains "name", "admin":1, etc.
      };

      dispatch(loginSuccess(mergedUser));
      return mergedUser;
    } catch (err) {
      dispatch(loginFailure(err.message));
      return rejectWithValue(err.message);
    }
  }
);

/* ============================================================
   Load profile if needed (kept as original)
============================================================ */
export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (uid, { rejectWithValue }) => {
    try {
      const snap = await getDoc(doc(db, "users", uid));
      return snap.exists() ? snap.data() : null;
    } catch (err) {
      console.error("Error fetching profile:", err);
      return rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    loginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.isLoggedIn = false;
      state.user = null;
    },
    logout(state) {
      state.user = null;
      state.isLoggedIn = false;
      state.error = null;
    },
    updateUserProfile(state, action) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        if (action.payload && state.user) {
          state.user = { ...state.user, ...action.payload };
        }
      });
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUserProfile,
} = authSlice.actions;

/* ============================================================
   🔥 LOGOUT — unchanged but now also logs out Firebase Auth
============================================================ */
export const performLogout = () => async (dispatch) => {
  try {
    await signOut(auth); // <-- THIS IS REQUIRED
    dispatch(logout());
  } catch (err) {
    console.error("Logout error:", err);
  }
};

export default authSlice.reducer;
