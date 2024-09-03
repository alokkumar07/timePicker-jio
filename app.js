import React, { useRef, useEffect, useState, useCallback } from 'react';
import moment from 'moment';
import { TimepickerUI } from 'timepicker-ui'; // Ensure this package is correctly installed and imported

const App = () => {
  const tmRef = useRef(null);
  const [inputValue, setInputValue] = useState(getCurrentTimeInIST());

  // Function to get the current time in IST
  function getCurrentTimeInIST() {
    return moment().utcOffset('+05:30').format('hh:mm A');
  }

  // Function to update the time dynamically
  const updateTime = useCallback(() => {
    setInputValue(getCurrentTimeInIST());
  }, []);

  useEffect(() => {
    // Update time every minute
    const intervalId = setInterval(updateTime, 60000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [updateTime]);

  useEffect(() => {
    const tmElement = tmRef.current;

    if (tmElement) {
      const newPicker = new TimepickerUI(tmElement, {});
      newPicker.create();

      // Ensure the time picker is always open
      newPicker.open();

      // Update time picker to reflect inputValue
      const inputField = tmElement.querySelector('input');
      if (inputField) {
        inputField.value = inputValue;
      }

      const handleAccept = (e) => {
        const { hour, minutes, type } = e.detail;
        setInputValue(`${hour}:${minutes} ${type}`);
      };

      tmElement.addEventListener('accept', handleAccept);

      return () => {
        tmElement.removeEventListener('accept', handleAccept);
      };
    }
  }, [inputValue]);

  return (
    <div className='timepicker-ui' ref={tmRef}>
      <input
        type='text'
        className='timepicker-ui-input'
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
    </div>
  );
};

export default App;
