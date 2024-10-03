import React from "react"
import PropTypes from "prop-types"

function ButtonBase({ label, onClickFunc }) {
  return (
    <button
      type="button"
      className="p-2 rounded-md border border-black"
      onClick={onClickFunc}
    >
      {label}
    </button>
  )
}

ButtonBase.propTypes = {
  onClickFunc: PropTypes.func,
  label: PropTypes.string,
}

export default ButtonBase
