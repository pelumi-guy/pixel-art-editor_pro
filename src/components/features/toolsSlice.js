import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tool: "draw",
    color: "#000000"
}

const toolsSlice = createSlice({
    name: 'tool',
    initialState,
    reducers: {
        toolChanged(state, action) {
            state.tool = action.payload;
           },
        colorChanged(state, action) {
            state.color = action.payload
        }
    }
})

export const {
    toolChanged,
    colorChanged
  } = toolsSlice.actions

const toolsReducer = toolsSlice.reducer;

export default toolsReducer;