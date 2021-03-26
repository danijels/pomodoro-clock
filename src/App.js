import { useState, useRef, useEffect } from 'react'
import { faPause, faPlay, faSync } from '@fortawesome/free-solid-svg-icons'
import './App.scss'

import Control from './components/control.js'
import Timer from './components/timer.js'
import LengthControl from './components/lengthControl.js'

const App = (props) => {
  const intervalRef = useRef();
  const audioRef = useRef();
  const [sessionLength, setSessionLength] = useState(25);  
  const [breakLength, setBreakLength] = useState(5);
  const [displayTime, setDisplayTime] = useState(sessionLength+':00');  
  const [current, setCurrent] = useState('Session');    
  const [running, setRunning] = useState(false);    
  const [newPeriod, setNewPeriod] = useState('');
  //This is the function that runs in a loop
  //Takes the difference between the starting time and the moment at which runs 
  //Subtracts that from the initial length
  //Does some calculations and string manipulation so the display value is always in the mm:ss format
  const countdown = (startTime, countFrom) => {  
    const difference = Math.floor((Date.now() - startTime) / 1000);
    const left = countFrom - difference;
    //this part plays a sound when the timer reaches 00:00
    if (left === 0) audioRef.current.play();
    if (left < 0) {
      //Setting running to false triggers the effect which handles the interval setup or more precisely in this case the cleanup
      setRunning(false);
      //This setter triggers effect responsive to newPeriod changes
      setNewPeriod(current === 'Break' ? 'session' : 'break');        
    } else {
      let mm = Math.floor(left / 60);
      mm = mm < 10 ? '0'.concat(mm) : mm;
      let ss = Math.floor(left % 60);
      ss = ss < 10 ? '0'.concat(ss) : ss;
      const displayValue = `${mm}:${ss}`;
      setDisplayTime(displayValue);
    }
  }
  //This effect responds to changes of newPeriod state variable - sets up a new session depending on which one just ended with the displayTime and everything AND sets running to true which again triggers the interval setter
  useEffect(() => {
    if (newPeriod === 'break') {
      setCurrent('Break');
      const length = breakLength < 10 ? '0'+breakLength : breakLength;
      setDisplayTime(length+':00');
      setRunning(true);
    } else if (newPeriod === 'session') {
      setCurrent('Session');
      const length = sessionLength < 10 ? '0'+sessionLength : sessionLength;
      setDisplayTime(length+':00');
      setRunning(true);
    }
  }, [newPeriod]);
  //Responds to changes in sessionLength and adjusts the value displayed in the timer accordingly
  useEffect(() => { 
    const length = sessionLength < 10 ? '0'+sessionLength : sessionLength;
    setDisplayTime(length+':00') 
  }, [sessionLength]);
  //Responds to each change of running value
  //Sets up the variables that countdown depends on - the starting time and what value it counts down from
  //Then it conditionally sets up a start of an interval and its clearing
  useEffect(() => {   
    const startDate = Date.now();
    const countFrom = Number(displayTime.split(':')[0] * 60) + Number(displayTime.split(':')[1]);
        
    if (running) intervalRef.current = setInterval(() => countdown(startDate, countFrom), 1000);    
    const clear = (int) => { clearInterval(int) };
    if (!running) clear(intervalRef.current);       
  }, [running]);
  //Handles incrementing and decrementing of the sessionLength
  //If the timer is running the buttons do not respond
  const handleSessionClick = (e) => {
    const id = e.target.id;
    if(!running) {
      if (sessionLength < 60 && id === 'session-increment') setSessionLength(sessionLength => sessionLength + 1);

      if (sessionLength > 1 && id === 'session-decrement') setSessionLength(sessionLength => sessionLength - 1);
    }
  }
  //Handles incrementing and decrementing of the breakLength
  //If the timer is running the buttons do not respond
  const handleBreakClick = (e) => {
    const id = e.target.id;
    if (!running) {
      if (breakLength < 60 && id === 'break-increment') setBreakLength(breakLength => breakLength + 1);
      if (breakLength > 1 && id === 'break-decrement') setBreakLength(breakLength => breakLength - 1);
    }
  }
  //Handles a click on the start_stop button 
  //Changes the value of running and the effects take care of the rest
  const startPause = () => {
    setRunning(running => !running);
  }
  //Handles a click on the reset button
  //Sets everything back to the initial state and in case the button is pressed in the middle of the sound playing it stops the playback and rewinds the audio to the beginning
  const reset = () => {
    setCurrent('Session');
    setSessionLength(25);
    setBreakLength(5);
    setRunning(false);
    setNewPeriod('');
    audioRef.current.pause();
    audioRef.current.load();
  }
  //The 'tomato' becomes green when on a break and is red otherwise 
  const timerColor = current === 'Session' ? 'red' : 'green';
  //Handles the icon of the start_pause button
  const playPause = running ? faPause : faPlay;
  const beepUrl = "https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav";
  
  return (
    <div id='app'>
      <h1>25 + 5 clock</h1>      
      <div id='length-control'>
        <LengthControl 
          name='session'
          title='Session length'
          handleClick={handleSessionClick}
          value={sessionLength}
        />
        <LengthControl 
          name='break'
          title='Break length'
          handleClick={handleBreakClick}
          value={breakLength}
        />
      </div>
      <Timer 
        label={current}
        time={displayTime}
        color={timerColor}
      />
      <div id='controls'>
        <Control
          id='start_stop'
          handleClick={startPause}
          icon={playPause}
        />
        <Control
          id='reset'
          handleClick={reset}
          icon={faSync}
        />
        <audio 
          id='beep' 
          src={beepUrl}
          ref={audioRef} 
        />
      </div>
    </div>
  )
}

export default App;
