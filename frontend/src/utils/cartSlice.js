import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // [{ _id, name, price, image, quantity }]
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload; // {_id, name, price, image}
      const existing = state.items.find((i) => i._id === item._id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((i) => i._id !== id);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const it = state.items.find((i) => i._id === id);
      if (it) it.quantity = Math.max(1, Number(quantity) || 1);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, it) => sum + it.quantity, 0);

export const selectCartItems = (state) => state.cart.items;

export default cartSlice.reducer;
