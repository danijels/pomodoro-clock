const Timer = (props) => (
  <div id='timer' style={{backgroundColor: props.color}}>
    <h2 id='timer-label'>{props.label}</h2>
    <p id='time-left'>{props.time}</p>
  </div>
)

export default Timer