import React, { useEffect } from 'react'
import { useState, useMemo } from 'react';

const InitOptions = ({hideDrawingPanel, init, setInit}) => {
  
    return (
    <div>
        {hideDrawingPanel && <h2>Enter Panel Dimensions</h2>}
        {hideDrawingPanel && (
        <div id="options">
          <div className="option">
            <input
              type="number"
              min={1}
              max={100}
              className="panelInput"
              defaultValue={60}
              onChange={(e) => {
                setInit({width: e.target.value, height: init.height});
              }}
                />
            <span>Width</span>
          </div>
          <div className="option">
            <input
              type="number"
              min={1}
              max={100}
              className="panelInput"
              defaultValue={30}
              onChange={(e) => {
                setInit({width: init.width, height: e.target.value});
              }}
            />
            <span>Height</span>
          </div>
        </div>
      )}
    </div>
  )
}


export default InitOptions