import Control from "./control.js"
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons"

const LengthControl = (props) => (
  <div>
    <p id={props.name+'-label'}>{props.title}</p>
    <Control 
      id={props.name+'-decrement'}
      handleClick={props.handleClick}
      icon={faArrowDown}
      value='dec'
    />
    <input 
      type='text' 
      id={props.name+'-length'} 
      value={props.value} 
      onChange={props.handleChange} 
    />
    <Control 
      id={props.name+'-increment'}
      handleClick={props.handleClick}
      icon={faArrowUp}
      value='inc'
    />
  </div>
)

export default LengthControl