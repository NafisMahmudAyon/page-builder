'use client'

import { cn } from '../../utils/cn'

export const TabList = ({ children, className = '', ...rest }) => {
  return (
    <div
      className={cn(
        'bg-bg text-text mb-4 inline-flex items-center space-x-2 rounded-md p-[3px]',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
