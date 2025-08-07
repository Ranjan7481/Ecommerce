import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  selectedProduct: null,
  searchResults: [],
  bestDeals: [],
  weeklyPopular: [],
  mostSelling: [],
  trending: [],
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    addProduct: (state, action) => {
      state.products.push(action.payload);
    },
    updateProduct: (state, action) => {
      const index = state.products.findIndex((p) => p._id === action.payload._id);
      if (index !== -1) {
        state.products[index] = { ...state.products[index], ...action.payload };
      }
    },
    deleteProduct: (state, action) => {
      state.products = state.products.filter((p) => p._id !== action.payload);
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },

    // NEW reducers for best-deal related APIs:
    setBestDeals: (state, action) => {
      state.bestDeals = action.payload;
    },
    setWeeklyPopular: (state, action) => {
      state.weeklyPopular = action.payload;
    },
    setMostSelling: (state, action) => {
      state.mostSelling = action.payload;
    },
    setTrending: (state, action) => {
      state.trending = action.payload;
    },
  },
});

export const {
  setProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  setSelectedProduct,
  setSearchResults,
  setBestDeals,
  setWeeklyPopular,
  setMostSelling,
  setTrending,
} = productSlice.actions;

export default productSlice.reducer;
