import React from "react"
import PropTypes from "prop-types"

function Form(props) {
  return (
    <form className="pt-20 flex justify-center">
      <input
        placeholder="Username"
        type="text"
        value={props.username}
        onChange={props.onChange}
      />
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={props.connect}
      >
        Connect
      </button>
    </form>
  )
}

Form.propTypes = {
  username: PropTypes.string,
  onChange: PropTypes.func,
  connect: PropTypes.func,
}
export default Form
