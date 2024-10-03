import React from "react"
import ButtonBase from "./ButtonBase"
import PropTypes from "prop-types"

function CopyImageButton({ canvas }) {
  function copyImage() {
    if (!canvas) return
    try {
      canvas.toBlob(async (blob) => {
        if (blob) {
          const clipboardItem = new ClipboardItem({ [blob.type]: blob })

          await navigator.clipboard.write([clipboardItem])
          console.log("Canvas image copied to clipboard!")
        }
      })
    } catch (error) {
      console.error("Failed to copy canvas image: ", error)
    }
  }

  return <ButtonBase label="Copy Image" onClickFunc={copyImage} />
}

CopyImageButton.propTypes = {
  canvas: PropTypes.canvas,
}

export default CopyImageButton
