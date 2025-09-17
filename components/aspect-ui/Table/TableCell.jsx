'use client'

import { cn } from '../../utils/cn'

export const TableCell = ({ children, className = '', colSpan, ...rest }) => {
  return (
    <td
      className={cn('whitespace-nowrap p-2 align-middle text-sm', className)}
      colSpan={colSpan}
      {...rest}
    >
      {children}
    </td>
  )
}
