'use client'

import { cn } from '../../utils/cn'

export const TableHeadCell = ({ children, className = '' }) => {
  return (
    <th
      className={cn(
        'text-text h-10 whitespace-nowrap px-2 text-left align-middle font-medium',
        className
      )}
    >
      {children}
    </th>
  )
}
