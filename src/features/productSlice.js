// src/redux/productSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "../config/firebase";

const db = getFirestore(app);
const storage = getStorage(app);

// Async thunk to upload product and images
export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const imageUrls = [];

      for (let i = 0; i < productData.images.length; i++) {
        const file = productData.images[i];
        const storageRef = ref(storage, `products/${Date.now()}_${i}_${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        imageUrls.push(downloadURL);
      }

      const docRef = await addDoc(collection(db, "products"), {
        ...productData,
        images: imageUrls,
        deleted: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        date: new Date().toLocaleString(),
      });

      return { id: docRef.id, ...productData, images: imageUrls };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: { loading: false, success: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(addProduct.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
