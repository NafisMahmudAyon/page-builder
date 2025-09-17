'use client'
import { useEffect, useState } from 'react'

const Star = ({
  className = '',
  size = 24,
  icon,
  style,
  fillPercentage = 100,
  unratedColor,
  onClick,
  onMouseEnter,
  onMouseLeave,
  ...rest
}) => {
  if (icon) {
    return (
      <span
        className={className}
        style={{
          display: 'inline-flex',
          position: 'relative',
          ...style
        }}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        {...rest}
      >
        <span
          style={{
            position: 'absolute',
            color: `${fillPercentage < 100 ? unratedColor : style.color}`
          }}
        >
          {icon}
        </span>
        <span
          style={{
            clipPath: `inset(0 ${100 - fillPercentage}% 0 0)`
          }}
        >
          {icon}
        </span>
      </span>
    )
  }

  return (
    <span
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        display: 'inline-flex',
        position: 'relative',
        ...style
      }}
      className={className}
      {...rest}
    >
      {/* Background star (unfilled) */}
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 22'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        style={{
          position: 'absolute',
          color: `${fillPercentage < 100 ? unratedColor : style.color}`
        }}
      >
        <g clipPath='url(#a)'>
          <path
            d='M11.996 0c.383 0 .733.217.9.563l2.858 5.887 6.384.942a.99.99 0 0 1 .804.679c.116.362.02.754-.246 1.02l-4.63 4.592 1.092 6.484a1.002 1.002 0 0 1-1.458 1.05l-5.708-3.05-5.7 3.045a.99.99 0 0 1-1.054-.07 1.01 1.01 0 0 1-.405-.98l1.092-6.483-4.63-4.587A1 1 0 0 1 1.05 8.07c.117-.358.43-.621.804-.68l6.384-.941L11.096.563a1 1 0 0 1 .9-.563z'
            fill='currentColor'
          />
        </g>
        <defs>
          <clipPath id='a'>
            <path fill='currentColor' d='M0 0h24v21.333H0z' />
          </clipPath>
        </defs>
      </svg>

      {/* Foreground star (filled) with clip path */}
      <svg
        width={size}
        height={size}
        viewBox='0 0 24 22'
        fill='currentColor'
        xmlns='http://www.w3.org/2000/svg'
        style={{
          clipPath: `inset(0 ${100 - fillPercentage}% 0 0)`
        }}
      >
        <g clipPath='url(#b)'>
          <path
            d='M11.996 0c.383 0 .733.217.9.563l2.858 5.887 6.384.942a.99.99 0 0 1 .804.679c.116.362.02.754-.246 1.02l-4.63 4.592 1.092 6.484a1.002 1.002 0 0 1-1.458 1.05l-5.708-3.05-5.7 3.045a.99.99 0 0 1-1.054-.07 1.01 1.01 0 0 1-.405-.98l1.092-6.483-4.63-4.587A1 1 0 0 1 1.05 8.07c.117-.358.43-.621.804-.68l6.384-.941L11.096.563a1 1 0 0 1 .9-.563z'
            fill='currentColor'
          />
        </g>
        <defs>
          <clipPath id='b'>
            <path fill='currentColor' d='M0 0h24v21.333H0z' />
          </clipPath>
        </defs>
      </svg>
    </span>
  )
}

const defaultRatingTexts = ['Terrible', 'Bad', 'OK', 'Good', 'Excellent']

export const Rating = ({
  maxRating = 5,
  initialRating = 0,
  size = 24,
  onChange,
  starColor = 'color-mix(in oklab, var(--color-primary) 50%, transparent)',
  hoverColor = 'var(--color-primary)',
  unratedColor = 'var(--color-bg)',
  ratingTexts = defaultRatingTexts,
  readOnly = false,
  className = '',
  icon
}) => {
  const [rating, setRating] = useState(initialRating)
  const [hover, setHover] = useState(null)

  useEffect(() => {
    setRating(initialRating)
  }, [initialRating])

  const handleClick = value => {
    if (!readOnly) {
      setRating(value)
      const syntheticEvent = {
        target: { value: value.toString() },
        currentTarget: { value: value.toString() }
      }

      onChange?.(syntheticEvent, value)
    }
  }

  const handleMouseEnter = value => {
    if (!readOnly) {
      setHover(value)
    }
  }

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHover(null)
    }
  }

  const getColor = index => {
    if (hover !== null) {
      return index <= hover ? hoverColor : unratedColor
    }
    const currentRating = hover !== null ? hover : rating
    const difference = index - currentRating
    if (difference > 0 && difference < 1) {
      return starColor
    }
    return index <= rating ? starColor : unratedColor
  }

  const getStarFillPercentage = index => {
    const currentRating = hover !== null ? hover : rating
    const difference = currentRating - index

    if (difference <= 0) return 0
    if (difference >= 1) return 100
    if (difference > 0 && difference < 1) return difference * 100
    return Math.round(difference * 100)
  }

  const getRatingText = () => {
    const currentRating = hover !== null ? hover : rating
    return ratingTexts[Math.ceil(currentRating) - 1] || ''
  }

  return (
    <div
      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
      className={className}
    >
      <div style={{ display: 'flex', gap: '4px' }}>
        {[...Array(maxRating)].map((_, index) => {
          const value = index + 1
          const fillPercentage = getStarFillPercentage(index)

          return (
            <Star
              key={index}
              icon={icon}
              className={fillPercentage > 0 ? 'filled' : ''}
              size={size}
              fillPercentage={fillPercentage}
              unratedColor={unratedColor}
              style={{
                cursor: readOnly ? 'default' : 'pointer',
                color: getColor(value)
              }}
              onClick={() => handleClick(value)}
              onMouseEnter={() => handleMouseEnter(value)}
              onMouseLeave={handleMouseLeave}
            />
          )
        })}
      </div>
      {ratingTexts.length > 0 && (
        <span style={{ marginLeft: '8px' }}>{getRatingText()}</span>
      )}
    </div>
  )
}

export default Rating
