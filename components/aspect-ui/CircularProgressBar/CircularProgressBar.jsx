'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '../../utils/cn'

export const CircularProgressBar = ({
  value = 75,
  className = '',
  onVisible,
  duration = 2,
  strokeColor = 'var(--color-bg-light)',
  strokeFillColor = 'var(--color-primary)',
  strokeWidth = 2,
  contentClassName = '',
  hideValue = false,
  children,
  onClick,
  ...rest
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [percentage, setPercentage] = useState(0)
  const svgRef = useRef(null)

  // Clamp value to avoid unexpected dashoffset results
  const clampedValue = Math.min(Math.max(value, 0), 100)

  // Calculate how long each increment should take
  const durationValue = (duration * 1000) / clampedValue

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
      }
    )

    if (svgRef.current) {
      observer.observe(svgRef.current)
    }

    return () => {
      if (svgRef.current) {
        observer.unobserve(svgRef.current)
      }
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (onVisible && !isVisible) {
      setPercentage(0)
    } else if (isVisible) {
      const interval = setInterval(() => {
        setPercentage(prev => {
          if (prev < clampedValue) {
            return Math.min(prev + 1, clampedValue)
          } else {
            clearInterval(interval)
            return prev
          }
        })
      }, durationValue)

      return () => clearInterval(interval)
    }
  }, [onVisible, isVisible, clampedValue, durationValue])

  return (
    <div
      className={cn('relative size-24', className)}
      onClick={onClick}
      role='progressbar'
      {...rest}
    >
      <div className='absolute left-0 top-0 h-full w-full origin-center -rotate-90 transform'>
        {/* Background circle */}
        <svg
          className='absolute left-1/2 top-1/2 z-0 h-full w-full -translate-x-1/2 -translate-y-1/2'
          viewBox='0 0 24 24'
        >
          <circle
            cx='12'
            cy='12'
            r='10'
            fill='none'
            stroke={strokeColor}
            strokeLinecap='round'
            strokeWidth={strokeWidth}
          />
        </svg>
        {/* Progress circle */}
        <svg
          className='absolute left-1/2 top-1/2 z-10 h-full w-full -translate-x-1/2 -translate-y-1/2 stroke-slate-600'
          viewBox='0 0 24 24'
          ref={svgRef}
        >
          <circle
            cx='12'
            cy='12'
            r='10'
            fill='none'
            stroke={strokeFillColor}
            strokeLinecap='round'
            strokeDasharray='62.83'
            strokeWidth={strokeWidth}
            style={{
              strokeDashoffset: `${((100 - percentage) * 62.83) / 100}`
            }}
          />
        </svg>
        {/* Center content */}
        <span
          className={cn(
            'text-text absolute inset-0 flex h-full w-full rotate-90 items-center justify-center',
            contentClassName
          )}
        >
          {!children && !hideValue && <>{percentage}%</>}
          {children && <>{children}</>}
        </span>
      </div>
    </div>
  )
}
