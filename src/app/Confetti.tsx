import React from 'react'
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'

function ConfettiComponent() {
  const { width, height } = useWindowSize()
  return (
    <Confetti
      width={width * 2}
      height={height * 2}
    />
  )
}

export default ConfettiComponent;