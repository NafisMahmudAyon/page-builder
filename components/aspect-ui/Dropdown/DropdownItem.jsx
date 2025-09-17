'use client'
import { cn } from '../../utils/cn'
import { useDropdown } from './DropdownContext'

export const DropdownItem = ({
  children,
  className = '',
  activeClassName = '',
  onClick,
  isSelected = false,
  isLink = false,
  ...rest
}) => {
  const { closeDropdown } = useDropdown()

  const handleClick = () => {
    if (onClick) {
      onClick()
    }
    closeDropdown()
  }
  if (isLink === true) {
    return (
      <a
        href='#'
        className={cn(
          'hover:bg-bg-light/80 block text-nowrap px-4 py-2 text-sm',
          className,
          isSelected ? cn('bg-bg-light', activeClassName) : ''
        )}
        role='option'
        area-selected={isSelected}
        onClick={handleClick}
        data-selected={isSelected}
        {...rest}
      >
        {children}
      </a>
    )
  }
  return (
    <div
      className={cn(
        'hover:bg-bg-light/80 block text-nowrap px-4 py-2 text-sm',
        className,
        isSelected ? cn('bg-bg-light', activeClassName) : ''
      )}
      are-selected={isSelected}
      role='option'
      onClick={handleClick}
      data-selected={isSelected}
      {...rest}
    >
      {children}
    </div>
  )
}
