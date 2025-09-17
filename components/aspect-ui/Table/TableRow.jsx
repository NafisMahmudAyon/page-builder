'use client'

import { cn } from '../../utils/cn'

export const TableRow = ({ children, className = '' }) => {
  return (
    <tr
      className={cn(
        'hover:bg-bg-light/50 border-b-border border-b transition-colors',
        className
      )}
    >
      {children}
    </tr>
  )
}
