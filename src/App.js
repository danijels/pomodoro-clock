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
    const [short, setShort] = useState(5);
    const [fourth, setFourth] = useState(15);     
    const [breakLength, setBreakLength] = useState(short);
    const [displayTime, setDisplayTime] = useState(sessionLength+':00');  
    const [current, setCurrent] = useState('Session');    
    const [running, setRunning] = useState(false);    
    const [newPeriod, setNewPeriod] = useState('');
    //283 is default because it matches the bigger circle
    const [remaining, setRemaining] = useState('283'); 
    const [pomodoros, setPomodoros] = useState(0);
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
            //Setting running to false triggers the effect which handles the interval setup 
            //or more precisely in this case - the cleanup
            setRunning(false);
            //This setter triggers effect responsive to newPeriod changes
            setNewPeriod(current === 'Break' ? 'session' : 'break');
            setRemaining('283')        
        } else {
            let mm = Math.floor(left / 60);
            mm = mm < 10 ? '0'.concat(mm) : mm;
            let ss = Math.floor(left % 60);
            ss = ss < 10 ? '0'.concat(ss) : ss;

            const displayValue = `${mm}:${ss}`;
            const wholeLength = current === 'Session' ? sessionLength : breakLength;
            const wholeCircle = current === 'Session' ? 251 : 283;
            setRemaining(`${wholeCircle * left / (wholeLength * 60)}`);
            setDisplayTime(displayValue);
        }
    }
    //This effect responds to changes of newPeriod state variable - 
    //sets up a new session depending on which one just ended with the displayTime and everything 
    //AND sets running to true which again triggers the interval setter
    useEffect(() => {
        if (newPeriod === 'break') {
            setCurrent('Break');
            const length = breakLength < 10 ? '0'+breakLength : breakLength;
            setDisplayTime(length+':00');
            setRunning(true);
            setPomodoros(p => p + 1);
        } else if (newPeriod === 'session') {
            setCurrent('Session');
            const length = sessionLength < 10 ? '0'+sessionLength : sessionLength;
            setDisplayTime(length+':00');
            setRunning(true);
            //The tally mark gets added only when a session ENDS so we set the longer break
            //while in the 4th pomodoro i.e. when there are 3 tally marks
            if (pomodoros === 3) setBreakLength(fourth);
            if (pomodoros === 4) {
                setBreakLength(short);
                setPomodoros(0);
            }
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

    useEffect(() => {
        setBreakLength(short);
    }, [short]);
    //Handles incrementing and decrementing of the sessionLength
    //If the timer is running the buttons do not respond
    const handleSessionClick = (e) => {
        const id = e.currentTarget.id;
        if (!running) {
            if (sessionLength < 60 && id === 'session-increment') 
              setSessionLength(sessionLength => sessionLength + 1);
            if (sessionLength > 1 && id === 'session-decrement') 
              setSessionLength(sessionLength => sessionLength - 1);
        }
    }
    //Handles incrementing and decrementing of the breakLength
    //If the timer is running the buttons do not respond
    const handleBreakClick = (e) => {
        const id = e.currentTarget.id;
        if (!running) {
            if (short < 60 && id === 'short-increment') setShort(breakLength => breakLength + 1);
            if (short > 1 && id === 'short-decrement') setShort(breakLength => breakLength - 1);
            if (fourth < 60 && id === 'fourth-increment') setFourth(breakLength => breakLength + 1);
            if (fourth > 1 && id === 'fourth-decrement') setFourth(breakLength => breakLength - 1);
        }
    }
    //Handles a click on the start_stop button 
    //Changes the value of running and the effects take care of the rest
    const startPause = () => {
        setRunning(running => !running);
    }
    //Handles a click on the reset button
    //Sets everything back to the initial state and in case the button is pressed in the middle of the sound playing
    //it stops the playback and rewinds the audio to the beginning
    const reset = () => {
        setCurrent('Session');
        setSessionLength(25);
        setBreakLength(5);
        setRunning(false);
        setNewPeriod('');
        audioRef.current.pause();
        audioRef.current.load();
    }
    const change = (e) => {
        const input = e.currentTarget;
        const val = input.value;

        if (!running) {
            if ((Number(val) > 0 && Number(val) <= 60) || val === '') {
                if (input.id === 'session-length') setSessionLength(input.value);
                if (input.id === 'short-length') setShort(input.value);
                if (input.id === 'fourth-length') setFourth(input.value);
            }
        }
    }
    //The 'tomato' becomes green when on a break and is red otherwise 
    const sessionLoopOutline = current === 'Session' ? `${remaining} 251` : "251";
    const sessionLoopColor = current === 'Session' ? "rgb(213, 101, 103)" : "rgba(255, 255, 255, 0.1)";
    const breakLoopOutline = current === 'Break' ? `${remaining} 283` : "283";
    const breakLoopColor = current === 'Break' ? "rgb(159, 213, 101)" : "rgba(255, 255, 255, 0.1)";

    //Handles the icon of the start_pause button
    const playPause = running ? faPause : faPlay;
    const beepUrl = "https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav";
    
    return (
        <div id='app'>    
            <div id='length-control'>
                    <LengthControl 
                      name='session'
                      title='Session length'
                      handleClick={handleSessionClick}
                      value={sessionLength}
                      handleChange={change}
                    />
                    <div>
                        <LengthControl 
                          name='short'
                          title='Short break length'
                          handleClick={handleBreakClick}
                          value={short}
                          handleChange={change}
                        />
                        <LengthControl 
                          name='fourth'
                          title='Fourth break length'
                          handleClick={handleBreakClick}
                          value={fourth}
                          handleChange={change}
                        />
                    </div>
                
                <p id='counter'>
                    {`Pomodoros done: ${'|'.repeat(pomodoros)}`}
                </p>
            </div>
            <div id='timer-controls-wrapper'>
                <Timer 
                  label={current}
                  time={displayTime}
                  innerColor={sessionLoopColor}
                  innerLength={sessionLoopOutline}
                  outerColor={breakLoopColor}
                  outerLength={breakLoopOutline}
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
        </div>
    )
}

export default App;
