import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { pointerPosition, hexToRgb } from './features/functions';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import "./styles/App.scss"


const PictureCanvas = ({ getCanvas }) => {
    const dispatch = useDispatch();
    const pictureSelector = state => state.picture;
    const toolSelector = state => state.tools
    const selectPicture = createSelector(pictureSelector, pic => pic.picture);
    const picture = useSelector(selectPicture);
    const tools = useSelector(toolSelector);
    const scale = useSelector(state => state.picture.scale);
    const [lastPosition, setPosition] = useState({});
    const canvasRef = useRef(null);
    const canvasElt = useRef(null);

    const { width, height, pixels } = picture;
    const { tool, color } = tools

    useEffect(() => {
        if (canvasRef.current) {
          canvasElt.current = canvasRef.current.getContext('2d');
          let img_32 = new Uint32Array(width * height * scale * scale);
          let tempU8Arr = new Uint8ClampedArray(4);
          //const rgb = ['r', 'g', 'b', 'a'];
          for (let y = 0, j = 0; y < height * scale; y += scale, j++) {
            for (let x = 0, i = 0; x < width * scale; x += scale, i++) {
              const  pixelColor = hexToRgb(pixels[(j * width) + i]);
              tempU8Arr[0] = pixelColor.r
              tempU8Arr[1] = pixelColor.g
              tempU8Arr[2] = pixelColor.b
              tempU8Arr[3] = 255
              let tempU32Arr = new Uint32Array(tempU8Arr.buffer)
              for (let scaleY = 0; scaleY < scale; scaleY++) {
                for (let scaleX = 0; scaleX < scale; scaleX++) {
                    const index = calcIdx(x, y, scaleX, scaleY, scale, width)
                    img_32[index] = tempU32Arr[0]
                }
              }
            }
          }
                const img_data = new Uint8ClampedArray(img_32.buffer);
                const img = new ImageData(img_data, width * scale, height * scale)
                canvasElt.current.putImageData(img, 0, 0);
                getCanvas(canvasRef);
        }
      }, [picture, pixels, width, height, getCanvas, scale]);

      const calcIdx = (x, y, scaleX, scaleY, scale, width) => {
        let res = ((y * width * scale) + x) + ((scaleY * width * scale) + scaleX);
        return res;
      }
      

    const onMouseDown = (e) => {
        dispatch({ type: 'draw/startDrawing' });
        setPosition(pointerPosition(e, canvasRef.current));
    }

    const onTouchStart = (e) => {
      e.preventDefault();
      dispatch({ type: 'draw/startDrawing' });
      setPosition(pointerPosition(e.touches[0], canvasRef.current));
    }
    
      const onMouseMove = (e, lastPosition, tool) => {
        if (e.button === 0 && e.buttons === 1) {
          const pos = pointerPosition(e, canvasRef.current)
          if (tool !== 'fill')
          {
            dispatch({ type: `draw/${tool}`, payload: { pos: {x: pos.x, y: pos.y}, lastPosition: {x: lastPosition.x, y: lastPosition.y}, color: color}})
          }
        }
      }

      const onTouchMove = (e, lastPosition, tool) => {
        e.preventDefault();
        const pos = pointerPosition(e.touches[0], canvasRef.current);
        if (tool !== 'fill')
          {
            dispatch({ type: `draw/${tool}`, payload: { pos: {x: pos.x, y: pos.y}, lastPosition: {x: lastPosition.x, y: lastPosition.y}, color: color}})
          }   
      }

    const fillClick = (tool, color) => {
      if (tool === 'fill')
        dispatch({ type: 'draw/fill', payload: {color: color} });
    }
            
    
  return (
    <div>
        <canvas 
        width={width * scale}
        height={height * scale}
        onMouseMove={(e) => onMouseMove(e, lastPosition, tool)}
        onMouseDown={(e) => {onMouseDown(e)}}
        onTouchStart={(e) => {onTouchStart(e)}}
        onTouchMove={(e) => onTouchMove(e, lastPosition, tool)}
        onClick={() => fillClick(tool, color)}
        ref={canvasRef}
        className="canvas"
        />
    </div>
    
  )
}

export default PictureCanvas