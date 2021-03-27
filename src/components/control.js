import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Control = (props) => (
  <button
  	id={props.id}
    type='button'
    onClick={props.handleClick}
    value={props.value}
  >
    <FontAwesomeIcon icon={props.icon} />
  </button>
)

export default Control