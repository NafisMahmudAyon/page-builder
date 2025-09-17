'use client'

import { cn } from '../../utils/cn'

export const TableCaption = ({
  children,
  className = '',
  position = 'bottom',
  ...rest
}) => {
  return (
    <caption
      className={cn(
        'text-text-muted mb-2 mt-4 text-sm',
        position === 'top' ? 'caption-top' : 'caption-bottom',
        className
      )}
      {...rest}
    >
      {children}
    </caption>
  )
}
