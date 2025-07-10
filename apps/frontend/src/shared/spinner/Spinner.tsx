import React from 'react'
import { PulseLoader } from 'react-spinners'

interface IProps {
  color?: string
  size?: number
}
const Spinner = ({ color = '#ffffff', size = 9 }: IProps) => {
  return (
    <PulseLoader
      color={color}
      size={size}
    />
  )
}

export default Spinner
