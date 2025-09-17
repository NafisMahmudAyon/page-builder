'use client'
import { cn } from '../../utils/cn'

export const NavbarContainer = ({ children, className = '', ...rest }) => {
  return (
    <div
      className={cn(
        'container mx-auto flex items-center justify-between px-4 py-4',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
