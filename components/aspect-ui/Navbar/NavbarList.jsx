'use client'

import { cn } from '../../utils/cn'
import { useNavbar } from './NavbarContext'

export const NavbarList = ({ children, className = '', ...rest }) => {
  const { collapseBreakpoint } = useNavbar()
  return (
    <ul
      className={cn(
        'items-center space-x-4',
        `hidden ${collapseBreakpoint === 'sm' && 'sm:flex'} ${
          collapseBreakpoint === 'md' && 'md:flex'
        } ${collapseBreakpoint === 'lg' && 'lg:flex'} ${
          collapseBreakpoint === 'xl' && 'xl:flex'
        } ${collapseBreakpoint === '2xl' && '2xl:flex'}`,
        className
      )}
      {...rest}
    >
      {children}
    </ul>
  )
}
