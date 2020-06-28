import React, { useState, ChangeEvent, SyntheticEvent } from 'react';
import Slider from 'react-input-slider';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css';

function App() {
  const [chooseColor, setChooseColor] = useState('#7159c1');
  const [newColor, setNewColor] = useState('#7159c1');
  const [newColorRGB, setNewColorRGB] = useState('rgb(113, 89, 193)');
  const [slider, setSlider] = useState({ x: 0 });
  const [disabled, setDisabled] = useState(false);

  function handleChooseColor(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;

    setChooseColor(value);
  }

  function handleOnBlur(event: SyntheticEvent<HTMLInputElement>) {
    const hexadecimal = chooseColor.replace(/[^0-9a-f]/gi, '');

    const isValidHex = hexadecimal.length === 6 || hexadecimal.length === 3;
    
    if (!isValidHex) {
      toast.error("Hexadecimal must be 3 or 6 characters long.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
      });

      setDisabled(true);
      setNewColor('');
      setNewColorRGB('');
    } else {
      setDisabled(false);
      lumiance(chooseColor);
    }

    setSlider({ x: 0 });
  }

  function lumiance(hexadecimal: string, luminosity = 0): void {
    hexadecimal = hexadecimal.replace(/[^0-9a-f]/gi, '');

    if (hexadecimal.length === 3) {
      hexadecimal = hexadecimal[0] + hexadecimal[0] + hexadecimal[1] + hexadecimal[1] + hexadecimal[2] + hexadecimal[2];
    }

    const black = 0;
    const white = 255;

    const twoDigitGroup = hexadecimal.match(/([0-9a-f]){2}/gi);

    let newHexadecimal = "#";
    let newRGB: number[] = [];

    twoDigitGroup?.map(twoDigit => {
      const numberFromHexadecimal = parseInt(twoDigit, 16);
      const calculate = numberFromHexadecimal + ( luminosity * 255 );

      const blackOrLuminosity = Math.max(black, calculate);
      const partialColor = Math.min(white, blackOrLuminosity);

      const newColor = Math.round(partialColor);

      newRGB.push(newColor);

      const numberTwoHexadecimal = newColor.toString(16);
      const finalHexadecimal = `0${numberTwoHexadecimal}`.slice(-2);

      newHexadecimal = newHexadecimal + finalHexadecimal;
    });

    const colorRGB = "rgb(" + newRGB.join(', ') + ")";
      
    setSlider({ x: luminosity }); 
    setNewColor(newHexadecimal);
    setNewColorRGB(colorRGB);
  }

  return (
    <>
      <div className="box">
        <h1>Luminosity</h1>
        <div className="boxColor" style={{ backgroundColor: newColor }}></div>

        <div className="boxInputs">
          <label>Choose Color: </label>
          <input 
            type="text" 
            name="choose_color" 
            value={chooseColor} 
            onChange={handleChooseColor} 
            maxLength={7}
            onBlur={handleOnBlur}
          />
        </div>

        <div>
          <Slider disabled={disabled} axis="x" xstep={0.01} xmin={-1} xmax={1} x={slider.x} onChange={({x}) => lumiance(chooseColor, x)} />
        </div>

        <div className="boxInputs">
          <label>New Color Hex</label>
          <input type="text" value={newColor} onChange={() => {}} readOnly />
        </div>

        <div className="boxInputs">
          <label>New Color RGB</label>
          <input type="text" value={newColorRGB} onChange={() => {}} readOnly />
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default App;
