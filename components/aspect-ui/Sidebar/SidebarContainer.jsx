'use client'

import { cn } from '../../utils/cn'

export const SidebarContainer = ({ children, className = '', ...rest }) => {
  return (
    <div
      className={cn('my-2 grow space-y-1 overflow-y-auto', className)}
      {...rest}
    >
      {children}
    </div>
  )
}
