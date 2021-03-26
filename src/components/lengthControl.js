import Control from "./control.js"
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons"

const LengthControl = (props) => (
  <div>
    <h3 id={props.name+'-label'}>{props.title}</h3>
    <Control 
      id={props.name+'-decrement'}
      handleClick={props.handleClick}
      icon={faArrowDown}
      value='dec'
    />
    <span id={props.name+'-length'}>{props.value}</span>
    <Control 
      id={props.name+'-increment'}
      handleClick={props.handleClick}
      icon={faArrowUp}
      value='inc'
    />
  </div>
)

export default LengthControl