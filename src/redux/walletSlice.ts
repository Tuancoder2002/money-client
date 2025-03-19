import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Wallet {
  id: number;
  name: string;
  balance: number;
  userId: number;
}

interface WalletState {
  wallets: Wallet[];
  selectedWallet: Wallet | null;
}

const initialState: WalletState = {
  wallets: [],
  selectedWallet: null,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setWallets: (state, action: PayloadAction<Wallet[]>) => {
      state.wallets = action.payload; // Đảm bảo action.payload là một mảng ví
    },
    selectWallet: (state, action: PayloadAction<Wallet>) => {
      state.selectedWallet = action.payload;
    },
    clearWallet: (state) => {
      state.selectedWallet = null;
    },
    addWallet(state, action: PayloadAction<Wallet>) {
      state.wallets.push(action.payload);
    },
  },
});

export const { setWallets, selectWallet, clearWallet, addWallet } = walletSlice.actions;
export default walletSlice.reducer;