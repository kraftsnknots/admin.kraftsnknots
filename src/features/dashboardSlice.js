import { createSlice } from "@reduxjs/toolkit";

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    totalUsers: 0,
    adminUsers: 0,
    totalProducts: 0,
    successOrders: 0,
    failedOrders: 0,
    discountCodes: 0,
    mobileQueries: 0,
    loading: true,
  },
  reducers: {
    setTotalUsers: (state, action) => {
      state.totalUsers = action.payload;
      state.loading = false;
    },
    setAdminUsers: (state, action) => {
      state.adminUsers = action.payload;
      state.loading = false;
    },
    setTotalProducts: (state, action) => {
      state.totalProducts = action.payload;
      state.loading = false;
    },
    setSuccessOrders: (state, action) => {
      state.successOrders = action.payload;
      state.loading = false;
    },
    setFailedOrders: (state, action) => {
      state.failedOrders = action.payload;
      state.loading = false;
    },
    setDiscountCodes: (state, action) => {
      state.discountCodes = action.payload;
      state.loading = false;
    },
    setMobileQueries: (state, action) => {
      state.mobileQueries = action.payload;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    resetDashboard: (state) => {
      state.totalUsers = 0;
      state.adminUsers = 0;
      state.totalProducts = 0;
      state.successOrders = 0;
      state.failedOrders = 0;
      state.discountCodes = 0;
      state.mobileQueries = 0;
      state.loading = true;
    },
  },
});

export const {
  setTotalUsers,
  setAdminUsers,
  setTotalProducts,
  setSuccessOrders,
  setFailedOrders,
  setDiscountCodes,
  setMobileQueries,
  setLoading,
  resetDashboard,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
