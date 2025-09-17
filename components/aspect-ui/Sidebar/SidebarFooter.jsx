'use client'

import { cn } from '../../utils/cn'

export const SidebarFooter = ({ children, className = '', ...rest }) => {
  return (
    <div
      className={cn(
        'border-border border-t-2 px-2.5 py-3 transition-all duration-200 ease-in-out',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
