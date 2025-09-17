'use client'
import React, { useEffect, useRef, useState } from 'react'
import { cn } from '../../utils/cn'

export const Slider = ({
  min = 0,
  max = 100,
  step = 1,
  defaultValue,
  onChange,
  className = '',
  disabled = false,
  ...rest
}) => {
  const [values, setValues] = useState(defaultValue)
  const sliderRef = useRef(null)

  useEffect(() => {
    if (onChange) {
      onChange(values)
    }
  }, [values, onChange])

  // Helper function to round value to nearest step
  const roundToStep = value => {
    const steps = Math.round((value - min) / step)
    return Math.min(max, Math.max(min, min + steps * step))
  }

  const handleMouseDown = index => e => {
    e.preventDefault()

    const handleMouseMove = e => {
      if (sliderRef.current) {
        const rect = sliderRef.current.getBoundingClientRect()
        const percentage = Math.max(
          0,
          Math.min(1, (e.clientX - rect.left) / rect.width)
        )
        const rawValue = percentage * (max - min) + min
        const steppedValue = roundToStep(rawValue) // Round to nearest step

        setValues(prevValues => {
          const newValues = [...prevValues]
          newValues[index] = steppedValue
          return newValues.sort((a, b) => a - b)
        })
      }
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const getLeftPosition = value => {
    return ((value - min) / (max - min)) * 100
  }

  return (
    <div
      className={cn(
        'bg-bg-light relative h-2 w-full rounded-full',
        disabled && 'pointer-events-none cursor-not-allowed opacity-50',
        className
      )}
      ref={sliderRef}
      {...rest}
    >
      <div
        className='bg-primary absolute h-full rounded-full'
        style={{
          left: `${values.length === 1 ? '0' : getLeftPosition(values[0])}%`,
          right: `${
            values.length === 1
              ? 100 - getLeftPosition(values[0])
              : 100 - getLeftPosition(values[1])
          }%`
        }}
      ></div>
      {values.map((value, index) => (
        <div
          key={index}
          className={cn(
            'border-primary bg-primary-foreground absolute size-4 cursor-pointer rounded-full border-2'
          )}
          style={{
            left: `calc(${getLeftPosition(value)}% - 0.5rem)`,
            top: '-0.25rem'
          }}
          onMouseDown={handleMouseDown(index)}
        ></div>
      ))}
    </div>
  )
}
