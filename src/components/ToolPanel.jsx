import React, { useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/tools.scss'
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import { useEffect } from 'react';


const ToolPanel = ({hideOptions}) => {
    const dispatch = useDispatch();
    const canUndoSelector = createSelector(state => state.picture.past, past => past.length > 0)
    const canUndo = useSelector(canUndoSelector)
    const canRedoSelector = createSelector(state => state.picture.future, future => future.length > 0)
    const canRedo = useSelector(canRedoSelector)
    const drawButton = useRef(null);
    const [prevButton, setPrevButton] = useState();
    const [firstTIme, setFirstTime] = useState(true);
     
    useEffect(() => {
        if (firstTIme === true && hideOptions === true)
        {
            if (drawButton.current) {
                drawButton.current.style.backgroundColor = "dimgray";
                drawButton.current.style.color = "#e8e8e8"
            } 
        } else {
            drawButton.current.style.backgroundColor = null;
            drawButton.current.style.color = null;
        }
    })


    const clickHandler = (e) => {
        setFirstTime(false);
        if (prevButton !== undefined) {
            prevButton.style.backgroundColor = null;
            prevButton.style.color = null; }
        let button = e.target;
        button.style.backgroundColor = "dimgray";
        button.style.color = "#e8e8e8";
        dispatch({type: 'tool/toolChanged', payload: e.target.id})
        setPrevButton(button);
    }

    const stopProp = (e) => {
        e.preventDefault();
        let button = e.target;
        button.style.backgroundColor = "dimgray";
    } 

  return (
    <div>
        <table className='palette'>
            <thead>
                <tr>
                    <td><button className="tool" id='draw' ref={drawButton}
                        // onClick={() => dispatch({type: 'tool/toolChanged', payload: "draw"})}
                        onClick={(e) => clickHandler(e)}
                    ><i className="bi bi-pencil-fill toolIcon"></i></button></td>
                    <td><button className="tool" id='fill'
                        onClick={(e) => clickHandler(e)}
                    ><i className="bi bi-paint-bucket toolIcon"></i></button></td>
                </tr>
                <tr>
                    <td><button className="tool" id='line'
                        onClick={(e) => clickHandler(e)}
                    ><i className="bi bi-slash-lg toolIcon"></i></button></td>
                    <td><button className='tool' id='orthLine'
                        onClick={(e) => clickHandler(e)}
                    ><i className="bi bi-dash-lg toolIcon" onClick={(e) => {stopProp(e)}}></i></button></td>
                </tr>
                <tr>
                    <td><button className='tool' id='rectangle'
                        onClick={(e) => clickHandler(e)}
                    ><i className="bi bi-file-fill toolIcon" onClick={(e) => {stopProp(e)}}></i></button></td>
                    <td><button className='tool' id='circle'
                        onClick={(e) => clickHandler(e)}
                    ><i className="bi bi-circle-fill toolIcon" onClick={(e) => {stopProp(e)}}></i></button></td>
                </tr>
                <tr>
                    <td><button className='tool' id='undo'
                        onClick={() => dispatch({type: 'draw/undo' })}
                        disabled={!canUndo}
                    ><i className="bi bi-arrow-counterclockwise"></i></button></td>
                    <td><button className='tool' id='redo'
                        onClick={() => dispatch({type: 'draw/redo' })}
                        disabled={!canRedo}
                    ><i className="bi bi-arrow-clockwise"></i></button></td>
                </tr>
                
            </thead>
        </table>
    </div>
  )
}

export default ToolPanel