import React from 'react'
import './loading.css';

export default function Ripple({ color, style, size }) {
  const circles = [...Array(2)].map((_, index) => (
    <div
      key={index}
      style={{
        borderColor: `${color}`,
        borderWidth: size * 0.05,
      }}
    />
  ))
  return (
    <div
        className="lds-ripple"
        style={{ width: size, height: size, ...style }}>
      {circles}
    </div>
  )
}

Ripple.defaultProps = {
  color: '#7f58af',
  className: '',
  style: {},
  size: 80,
}