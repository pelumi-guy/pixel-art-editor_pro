import { createSlice } from '@reduxjs/toolkit'
import { Picture } from './classDeclarations';
import { drawLine, drawStraightLine, drawRectangle, drawCircle } from './functions';

const initialWidth = 1;
const initialHeight = 1;
const initialColor = "#f0f0f0";
const initialPicture = Picture.empty(initialWidth, initialHeight, initialColor);
const initialState = { past: [], picture: {...initialPicture}, future: [], drawingPicture: {}, scale: 10 };

const pictureSlice = createSlice({
  name: 'draw',
  initialState,
  reducers: {
    init(state, action) {
      let tempPicture = Picture.empty(action.payload.width, action.payload.height, initialColor);
      state.picture = {...tempPicture};
    },
    draw(state, action) {
      let { x, y } = action.payload.pos
      let drawn = { x, y, color: action.payload.color };
      let tempPicture = new Picture(state.picture.width, state.picture.height, state.picture.pixels);
      tempPicture = tempPicture.draw([drawn]);
      state.picture = {...tempPicture};
    },
    line(state, action) {   
      let line = drawLine(action.payload.lastPosition, action.payload.pos, action.payload.color)
      let tempPicture = new Picture(state.drawingPicture.width, state.drawingPicture.height, state.drawingPicture.pixels)
      tempPicture = tempPicture.draw(line);
      state.picture = {...tempPicture};
    },
    startDrawing(state, action) {
      state.drawingPicture = state.picture;
      state.past = [state.picture, ...state.past];
      state.past.length = Math.min(state.past.length, 20);
      state.future = [];
    },
    orthLine(state, action) {      
      let line = drawStraightLine(action.payload.lastPosition, action.payload.pos, action.payload.color);
      let tempPicture = new Picture(state.drawingPicture.width, state.drawingPicture.height, state.drawingPicture.pixels)
      tempPicture = tempPicture.draw(line);
      state.picture = {...tempPicture};
    },
    rectangle(state, action) {    
      let rectangle = drawRectangle(action.payload.lastPosition, action.payload.pos, action.payload.color);
      let tempPicture = new Picture(state.drawingPicture.width, state.drawingPicture.height, state.drawingPicture.pixels);
      tempPicture = tempPicture.draw(rectangle);
      state.picture = {...tempPicture};           
    },           
    circle(state, action) {
      let circle = drawCircle(action.payload.lastPosition, action.payload.pos, state.picture, action.payload.color);
      let tempPicture = new Picture(state.drawingPicture.width, state.drawingPicture.height, state.drawingPicture.pixels);
      tempPicture = tempPicture.draw(circle);
      state.picture = {...tempPicture};           
    },
    fill(state, action) {
      let tempPicture = Picture.empty(state.picture.width, state.picture.height, action.payload.color)
      state.picture = {...tempPicture}
    },
    fromImage(state, action) {
      state.past = [state.picture, ...state.past];
      state.past.length = Math.min(state.past.length, 20);
      state.picture = action.payload;
    },
    resetScale(state, action) {
      state.scale = 10;
    },
    undo(state, action){
      state.future = [state.picture, ...state.future];
      state.picture = state.past[0];
      state.past = state.past.slice(1);
      state.past.length = Math.min(state.past.length, 20);
      state.future.length = Math.min(state.future.length, 20)
    },
    redo(state, action) {
      state.past = [state.picture, ...state.past];
      state.picture = state.future[0];
      state.future = state.future.slice(1);
      state.past.length = Math.min(state.past.length, 20);
      state.future.length = Math.min(state.future.length, 20)
    }
  }
})

  export const {
    draw,
    startDrawing,
    line,
    circle,
    rectangle, 
    fill
  } = pictureSlice.actions
  
export  const pictureReducer = pictureSlice.reducer;