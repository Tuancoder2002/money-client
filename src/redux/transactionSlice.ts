import { createSlice } from "@reduxjs/toolkit";

interface TransactionState {
  categories: any[];
}

const initialState: TransactionState = {
  categories: [],
};

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    setCategories(state, action) {
      state.categories = action.payload;
    },
  },
});

export const { setCategories } = transactionSlice.actions;

export default transactionSlice.reducer;