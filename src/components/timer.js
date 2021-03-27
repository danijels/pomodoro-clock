const Timer = (props) => (
  <div id='timer'>
  	<svg id='timer-svg' viewBox='0 0 100 100'>
  		<g id='timer-circle'>
  			<circle id='timer-circle-outter' cx='50' cy='50' r='45' />
  			<path
		        id="timer-circle-outer-rem"
		        strokeDasharray={props.outerLength}
		        d="
		          M 50, 50
		          m -45, 0
		          a 45,45 0 1,0 90,0
		          a 45,45 0 1,0 -90,0
		        "
		        style={{ stroke: props.outerColor }}
		    ></path>
  			<circle id='timer-circle-inner' cx='50' cy='50' r='40' />
  			<path
		        id="timer-circle-inner-rem"
		        strokeDasharray={props.innerLength}
		        d="
		          M 50, 50
		          m -40, 0
		          a 40,40 0 1,0 80,0
		          a 40,40 0 1,0 -80,0
		        "
		        style={{ stroke: props.innerColor }}
		    ></path>
  		</g>
  	</svg>
  	<div id='timer-text'>
	    <p id='timer-label'>{props.label}</p>
	    <p id='time-left'>{props.time}</p>
    </div>
  </div>
)

export default Timer