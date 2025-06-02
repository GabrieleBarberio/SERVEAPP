import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CounterState {
    value: number;
    loading: boolean;
}
const initialState : CounterState = {
    value: 0,
    loading: false
};
export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment: (state: CounterState) => {
            state.value += 1;
        },
        decrement: (state: CounterState) => {
            state.value -= 1;
        },
        incrementByAmount: (state: CounterState, action: PayloadAction<number>) => {
            state.value += action.payload;
        },
        reset: (state: CounterState) =>{
                state.value = 0;
            },
        setLoading: (state:CounterState, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        }
    },
});
export const { increment, decrement, incrementByAmount, reset, setLoading } = counterSlice.actions;
export default counterSlice.reducer;