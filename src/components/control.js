import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Control = (props) => (
  <button
    type='button'
    onClick={props.handleClick}
    value={props.value}
    id={props.id}
  >
    <FontAwesomeIcon icon={props.icon} />
  </button>
)

export default Control