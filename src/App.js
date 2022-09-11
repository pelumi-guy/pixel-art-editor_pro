import Footer from './components/Footer';
import ToolPanel from './components/ToolPanel';
import "./components/styles/App.scss"
import { CirclePicker } from 'react-color';
import { useState } from 'react';
import PictureCanvas from './components/PictureCanvas';
import { useDispatch, useSelector } from 'react-redux/es/exports';
import { createSelector } from '@reduxjs/toolkit';
import InitOptions from './components/InitOptions';

function App() {
  const dispatch = useDispatch();
  const [selectedColor, setColor] = useState("#f44336");
  const [hideOptions, setHideOptions] = useState(false);
  const [hideDrawingPanel, setHideDrawingPanel] = useState(true);
  const color = useSelector(state => state.picture.color);
  const [canvas, setCanvas] = useState();
  const [init, setInit] = useState({width: 60, height: 30});
  const pictureSelector = state => state.picture;
  const selectPicture = createSelector(pictureSelector, pic => pic.picture);
  const picture = useSelector(selectPicture);
  const { width, height } = picture;

  function initializeDrawingPanel() {
    setHideOptions(!hideOptions);
    setHideDrawingPanel(!hideDrawingPanel);
    dispatch({ type: "draw/init", payload: init});
  }
  
  function changeColor(color) {
    setColor(color.hex);
    dispatch({type: 'tool/colorChanged', payload: color.hex})
  }

  const getCanvas = (canvas) => {
    setCanvas(canvas);
  }

  const colorChangeHandler = (e) => {dispatch({type: 'tool/colorChanged', payload: e.target.value})}

  return (
    <div>
      <h1 className='banner display-1'><b>PIXEL ART EDITOR - PRO</b></h1>

      <div className="App">
        <div className='leftPanel' disabled={hideDrawingPanel}><ToolPanel hideOptions={hideOptions}/></div> 
        
        <div className='midPanel'>
            <InitOptions hideDrawingPanel={hideDrawingPanel} init={init} setInit={setInit}/>
            {hideDrawingPanel && <button onClick={initializeDrawingPanel} className="button">
              Start Drawing
            </button>}
            {hideOptions && (<div>
              <PictureCanvas getCanvas={getCanvas} />
              <Footer canvas={canvas} height={height} width={width}/>
            </div>)}
          </div>
        
        <div className='rightPanel show-margin' disabled={hideDrawingPanel}>
            <label htmlFor="color-input"><h2 className='lead'>Color:</h2></label>
            <input type="color" 
              className="color-input pointer-hover"
              value={color}
              onChange={(e) => {colorChangeHandler(e)}} 
            /> <br />
            <h2 className='lead'>Swatches:</h2>
          <div className="colorPicker">
            <CirclePicker direction="vertical" color={selectedColor} onChangeComplete={changeColor} />
          </div>
          
        </div>
        
    </div>
    </div>
  );
}

export default App;
