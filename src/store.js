import { configureStore } from "@reduxjs/toolkit";
import { pictureReducer } from "./components/features/pictureSlice";
import toolsReducer  from "./components/features/toolsSlice";

const store = configureStore ({
    reducer: {
        picture: pictureReducer,
        tools: toolsReducer
    } 
})

export default store