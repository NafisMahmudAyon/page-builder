'use client'
import { cn } from '../../utils/cn'

export const NavbarItem = ({ children, className = '', ...rest }) => {
  return (
    <button
      className={cn(
        'text-text hover:bg-bg-light focus-visible:bg-bg-light inline-flex rounded-md px-2 py-1 transition-colors ease-in-out',
        className
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
