import { createSlice } from "@reduxjs/toolkit";

interface IBuyDag {
  usdValue: number;
  dagValue: number;
  cardName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

const initialState: IBuyDag = {
  usdValue: 0,
  dagValue: 0,
  cardNumber: "",
  cardName: "",
  expiryDate: "",
  cvv: "",
};

const buyDagSlice = createSlice({
  name: "buy-dag",
  initialState,
  reducers: {
    setState(state, { payload }) {
      console.log("usd,dag", state.usdValue, state.dagValue);
      return {
        ...state,
        ...payload,
      };
    },
  },
});

export const { setState } = buyDagSlice.actions;

export default buyDagSlice.reducer;
