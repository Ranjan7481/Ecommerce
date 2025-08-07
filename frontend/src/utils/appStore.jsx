import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./UserSlice";
import productReducer from "./productSlice";
import orderReducer from "./orderSlice";
import cartReducer from "./cartSlice";


export const appStore = configureStore({
  reducer: {
    user: userReducer,
    product: productReducer,
    order:orderReducer,
    cart:cartReducer,
  },
});

export default  appStore;