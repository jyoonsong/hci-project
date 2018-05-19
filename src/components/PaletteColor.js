import React from 'react';
import './PaletteColor.css'

const PaletteColor = ({color, changeColor}) => {

  console.log("PaletteColor rendered");

  return (
    <div className="color" style={{background: color}}
		 		 onClick={() => changeColor(color)} ></div>
  )
}

export default PaletteColor;
