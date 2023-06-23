import React, { Component, useState } from 'react'
import "./styles/dev.scss"
import './styles/tools.scss'
import { useDispatch } from 'react-redux';
import { download, loadImage } from './features/functions'

const Footer = ({canvas, width, height }) => {
  const dispatch = useDispatch();
  const [selectedColor, setColor] = useState("#f44336");
  const [colorPickerOpen, setColorPickerOpen] = useState(false);

  function changeColor(color) {
    setColor(color.hex);
    setColorPickerOpen(!colorPickerOpen);
  }

  const showColorPicker = () => {
    setColorPickerOpen(!colorPickerOpen);
  }

  return (
      <div className='show-margin footer'>
            <button type="button" className="button"
              onClick={() => {download(canvas)}}
            >
              <i className="bi bi-download"></i> &nbsp;
              DOWNLOAD
            </button> &nbsp;
            <button type="button" className="button"
              onClick={() => {loadImage(dispatch, width, height)}}
              onBlur={() => {dispatch({ type: 'draw/resetScale' })}}
            >
              <i className="bi bi-upload"></i> &nbsp;
              UPLOAD
              </button>
          </div>
  )
}

export default Footer