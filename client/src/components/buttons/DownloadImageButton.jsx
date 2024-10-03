import React from "react"
import ButtonBase from "./ButtonBase"
import PropTypes from "prop-types"

function DownloadImageButton({ canvas }) {
  function downloadImage() {
    console.log(canvas)
    if (!canvas) return
    try {
      canvas.toBlob((blob) => {
        console.log("blob size:", blob.size)
        const pngUrl = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = pngUrl
        link.download = "canvas-drawing" // Name of downloaded file
        link.click()
        // Clean up the object URL to prevent memory leaks
        URL.revokeObjectURL(pngUrl)
      })
    } catch (error) {
      console.error("Failed to download canvas image: ", error)
    }
  }

  return <ButtonBase label="Download Image" onClickFunc={downloadImage} />
}

DownloadImageButton.propTypes = {
  canvas: PropTypes.canvas,
}

export default DownloadImageButton
